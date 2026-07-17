import 'dotenv/config';
import { ServerOptions, cli, defineAgent, voice, } from '@livekit/agents';
import * as silero from '@livekit/agents-plugin-silero';
import * as openai from '@livekit/agents-plugin-openai';
import { fileURLToPath } from 'node:url';
import { CoachAgent } from './coach.js';
import { buildCoachInstructions } from './prompt.js';
import { supabaseAdmin } from '@irshaad/database';
const AGENT_NAME = process.env.LIVEKIT_AGENT_NAME ?? 'interview-coach';
export default defineAgent({
    prewarm: async (proc) => {
        proc.userData.vad = await silero.VAD.load();
    },
    entry: async (ctx) => {
        const vad = ctx.proc.userData.vad;
        // Parse session ID from room metadata
        let sessionId;
        try {
            const meta = ctx.job.metadata ? JSON.parse(ctx.job.metadata) : undefined;
            sessionId = meta?.sessionId;
        }
        catch (err) {
            console.error('[agent] Error parsing job metadata:', err);
        }
        if (!sessionId) {
            console.error('[agent] missing sessionId in job metadata — aborting');
            await ctx.shutdown();
            return;
        }
        console.log(`[agent] Starting session for ID: ${sessionId}`);
        // Fetch session details directly from Supabase
        const { data: sessionData, error: sessionError } = await supabaseAdmin
            .from('sessions')
            .select('job_description, resume_text')
            .eq('id', sessionId)
            .single();
        if (sessionError || !sessionData) {
            console.error(`[agent] Failed to load session context for ${sessionId}:`, sessionError);
            await ctx.shutdown();
            return;
        }
        // Set session status to active
        await supabaseAdmin
            .from('sessions')
            .update({ status: 'active' })
            .eq('id', sessionId);
        const instructions = buildCoachInstructions(sessionData.job_description, sessionData.resume_text);
        const session = new voice.AgentSession({
            vad,
            stt: new openai.STT(),
            llm: new openai.LLM({ model: 'gpt-4o' }),
            tts: new openai.TTS({
                model: 'tts-1',
                voice: 'alloy',
            }),
            turnHandling: {
                // Interview answers need more pause room than casual chat.
                // 1.2 s min gives candidates time to collect thoughts mid-sentence.
                endpointing: {
                    minDelay: 1200,
                    maxDelay: 4000,
                },
                // Require at least 2 words before treating user speech as an
                // interruption, reducing false positives from filler sounds.
                interruption: {
                    minWords: 2,
                    resumeFalseInterruption: true,
                    falseInterruptionTimeout: 2000,
                },
            },
        });
        let ended = false;
        const endSession = async (transcript, summary) => {
            if (ended)
                return;
            ended = true;
            try {
                console.log(`[agent] Interview concluded for session: ${sessionId}. Saving summary...`);
                // Save transcript and feedback summary
                const { error: summaryError } = await supabaseAdmin
                    .from('interview_summaries')
                    .insert({
                    session_id: sessionId,
                    transcript,
                    feedback: { summary },
                });
                if (summaryError) {
                    console.error('[agent] Error saving summary to DB:', summaryError);
                }
                // Update session status to completed
                const { error: updateError } = await supabaseAdmin
                    .from('sessions')
                    .update({ status: 'completed' })
                    .eq('id', sessionId);
                if (updateError) {
                    console.error('[agent] Error updating session status:', updateError);
                }
            }
            catch (dbErr) {
                console.error('[agent] Unexpected error during session end cleanup:', dbErr);
            }
            finally {
                ctx.shutdown();
            }
        };
        ctx.addShutdownCallback(async () => {
            if (!ended) {
                ended = true;
                console.log(`[agent] Connection closed early for session: ${sessionId}. Cleaning up...`);
                // Mark session as completed/aborted
                await supabaseAdmin
                    .from('sessions')
                    .update({ status: 'completed' })
                    .eq('id', sessionId);
            }
        });
        const agent = new CoachAgent({
            instructions,
            room: ctx.room,
            sessionId,
            onEnd: endSession,
        });
        // Start voice pipeline, connect participant, and speak greeting
        await session.start({ agent, room: ctx.room });
        await ctx.connect();
        session.generateReply({
            instructions: 'Greet the candidate warmly, confirm the role being practiced (from the job description in your system prompt), briefly explain that you will ask a mix of behavioral and role-specific questions one at a time, and ask your first question.',
        });
    },
});
cli.runApp(new ServerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: AGENT_NAME,
}));
