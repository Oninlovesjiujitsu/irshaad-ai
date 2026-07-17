import './env.js';
import {
  type JobContext,
  ServerOptions,
  cli,
  defineAgent,
  voice,
} from '@livekit/agents';
import * as google from '@livekit/agents-plugin-google';
import { fileURLToPath } from 'node:url';
import { CoachAgent } from './coach.js';
import { buildCoachInstructions } from './prompt.js';
import type { JobMetadata } from '@irshaad/shared-types';
import { supabaseAdmin } from '@irshaad/database';

const AGENT_NAME = process.env.LIVEKIT_AGENT_NAME ?? 'interview-coach';

export default defineAgent({
  entry: async (ctx: JobContext) => {
    // Parse session ID from room metadata
    let sessionId: string | undefined;
    try {
      const meta = ctx.job.metadata ? (JSON.parse(ctx.job.metadata) as JobMetadata) : undefined;
      sessionId = meta?.sessionId;
    } catch (err) {
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

    const instructions = buildCoachInstructions(
      sessionData.job_description,
      sessionData.resume_text
    );

    let ended = false;
    const endSession = async (transcript: string, summary: string) => {
      if (ended) return;
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
      } catch (dbErr) {
        console.error('[agent] Unexpected error during session end cleanup:', dbErr);
      } finally {
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

    const model = new google.realtime.RealtimeModel({
      model: "gemini-3.1-flash-live-preview",
      instructions: instructions + "\n\nGreet the candidate warmly, confirm the role being practiced, briefly explain that you will ask a mix of behavioral and role-specific questions one at a time, and ask your first question. Speak first.",
      temperature: 0.8,
    });

    const session = new voice.AgentSession({
      llm: model as any,
    });

    const agent = new CoachAgent({
      instructions,
      room: ctx.room,
      sessionId,
      onEnd: endSession,
    });

    await ctx.connect();
    await session.start({ agent, room: ctx.room });
  },
});

cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: AGENT_NAME,
  }),
);
