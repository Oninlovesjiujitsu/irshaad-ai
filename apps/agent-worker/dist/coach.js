import { voice, llm } from '@livekit/agents';
import * as openai from '@livekit/agents-plugin-openai';
import { z } from 'zod';
import { SUMMARY_STREAM_TOPIC, STATUS_STREAM_TOPIC } from '@irshaad/shared-types';
import { buildSummaryInstructions } from './prompt.js';
export class CoachAgent extends voice.Agent {
    constructor(opts) {
        super({
            instructions: opts.instructions,
            tools: {
                endInterview: llm.tool({
                    description: 'Call this as soon as the candidate signals they want to end the interview (e.g. "that\'s all", "end the interview", "I\'m done", "stop here") or when the interview has naturally concluded. Do not verbally acknowledge the request before calling — call this tool directly. This tool will emit the written summary to the candidate and disconnect. Do not end the interview any other way.',
                    parameters: z.object({}),
                    execute: async (_args, { ctx: runCtx }) => {
                        // Prevent the candidate from interrupting while the summary is generated
                        runCtx.speechHandle.allowInterruptions = false;
                        // Signal the frontend that summary generation has started
                        await opts.room.localParticipant?.sendText('generating-summary', {
                            topic: STATUS_STREAM_TOPIC,
                        });
                        const transcript = buildTranscript(this);
                        const summary = await generateSummary(this);
                        await publishSummary(opts.room, summary);
                        // Invoke the onEnd callback and pass transcript + summary
                        await opts.onEnd(transcript, summary);
                        return 'Interview ended. Summary delivered.';
                    },
                }),
            },
        });
    }
}
/**
 * Builds a plain-text transcript from the agent's chat history.
 */
function buildTranscript(agent) {
    return agent.chatCtx.items
        .filter((item) => item.type === 'message')
        .map(({ role, content }) => {
        const text = Array.isArray(content)
            ? content.filter((c) => typeof c === 'string').join(' ')
            : typeof content === 'string'
                ? content
                : '';
        return text ? `${role}: ${text}` : null;
    })
        .filter((line) => line !== null)
        .join('\n');
}
/**
 * Generates a structured Markdown summary of the interview.
 */
async function generateSummary(agent) {
    const transcript = buildTranscript(agent);
    const chatCtx = llm.ChatContext.empty();
    chatCtx.addMessage({ role: 'system', content: buildSummaryInstructions() });
    chatCtx.addMessage({
        role: 'user',
        content: `Here is the full interview transcript:\n\n${transcript}`,
    });
    const summaryLLM = new openai.LLM({
        model: 'gpt-4o',
    });
    try {
        const stream = summaryLLM.chat({ chatCtx });
        let out = '';
        for await (const chunk of stream) {
            if (chunk.delta?.content) {
                out += chunk.delta.content;
            }
        }
        return out.trim() || '# Interview Feedback\n\n_Empty summary._';
    }
    catch (err) {
        console.error('[agent] summary generation failed', err);
        return '# Interview Feedback\n\n_Sorry — we were unable to generate your written summary. Please try another session._';
    }
}
/**
 * Publishes the interview summary as a text stream on the dedicated stream topic.
 */
async function publishSummary(room, summary) {
    try {
        await room.localParticipant?.sendText(summary, {
            topic: SUMMARY_STREAM_TOPIC,
        });
    }
    catch (err) {
        console.error('[agent] failed to publish summary', err);
    }
}
