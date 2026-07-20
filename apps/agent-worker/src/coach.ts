import { voice, llm, type JobContext } from '@livekit/agents';
import * as google from '@livekit/agents-plugin-google';
import { z } from 'zod';
import { SUMMARY_STREAM_TOPIC, STATUS_STREAM_TOPIC } from '@irshaad/shared-types';
import { buildSummaryInstructions } from '@irshaad/utils';

type Room = JobContext['room'];

interface CoachAgentOptions {
  instructions: string;
  room: Room;
  sessionId: string;
  onEnd: (transcript: string, summary: string) => Promise<void> | void;
}

export class CoachAgent extends voice.Agent {
  constructor(opts: CoachAgentOptions) {
    super({
      instructions: opts.instructions,
      tools: {
        endInterview: llm.tool({
          description:
            'Call this as soon as the candidate signals they want to end the interview (e.g. "that\'s all", "end the interview", "I\'m done", "stop here") or when the interview has naturally concluded. Do not verbally acknowledge the request before calling — call this tool directly. This tool will emit the written summary to the candidate and disconnect. Do not end the interview any other way.',
          parameters: z.object({}),
          execute: async (_args, { ctx: runCtx }) => {
            // Prevent the candidate from interrupting while the summary is generated
            runCtx.speechHandle.allowInterruptions = false;

            // Signal the frontend that summary generation has started
            await opts.room.localParticipant?.sendText('generating-summary', {
              topic: STATUS_STREAM_TOPIC,
            });

            const transcript = buildTranscript(this.chatCtx);
            const summary = await generateSummary(transcript);

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
export function buildTranscript(chatCtx: llm.ChatContext): string {
  return chatCtx.items
    .filter((item): item is llm.ChatMessage => item.type === 'message')
    .map(({ role, content }) => {
      const text = Array.isArray(content)
        ? content.filter((c): c is string => typeof c === 'string').join(' ')
        : typeof content === 'string'
          ? content
          : '';
      return text ? `${role}: ${text}` : null;
    })
    .filter((line): line is string => line !== null)
    .join('\n');
}

/**
 * Generates a structured JSON summary of the interview.
 */
export async function generateSummary(transcript: string): Promise<string> {
  const chatCtx = llm.ChatContext.empty();
  chatCtx.addMessage({ role: 'system', content: buildSummaryInstructions() });
  chatCtx.addMessage({
    role: 'user',
    content: `Here is the full interview transcript:\n\n${transcript}`,
  });

  const summaryLLM = new google.LLM({
    model: 'gemini-3.1-flash-lite',
  });

  try {
    const stream = await summaryLLM.chat({ chatCtx });
    let out = '';
    for await (const chunk of stream) {
      if (chunk.delta?.content) {
        out += chunk.delta.content;
      }
    }

    // Clean markdown code blocks if the LLM wrapped the JSON
    out = out.trim();
    if (out.startsWith('```json')) {
      out = out.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (out.startsWith('```')) {
      out = out.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    // Try to parse to validate it's proper JSON
    JSON.parse(out);

    return out;
  } catch (err) {
    console.error('[agent] summary generation failed', err);
    return JSON.stringify({
      score: 0,
      overall_impression: "Sorry — we were unable to generate your written summary. Please try another session.",
      technical_corrections: [],
      transcript_highlights: [],
      recommended_next_steps: []
    });
  }
}

/**
 * Publishes the interview summary as a text stream on the dedicated stream topic.
 */
async function publishSummary(room: Room, summary: string): Promise<void> {
  try {
    await room.localParticipant?.sendText(summary, {
      topic: SUMMARY_STREAM_TOPIC,
    });
  } catch (err) {
    console.error('[agent] failed to publish summary', err);
  }
}
