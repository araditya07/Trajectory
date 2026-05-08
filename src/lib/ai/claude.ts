// AI client. Uses Groq (free, OpenAI-compatible) by default.
// Falls back to Anthropic if ANTHROPIC_API_KEY is set instead.

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

let _groq: OpenAI | null = null;
let _anthropic: Anthropic | null = null;

export const GROQ_MODEL = 'llama-3.3-70b-versatile';
export const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

function getGroq(): OpenAI | null {
  if (_groq) return _groq;
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  _groq = new OpenAI({ apiKey: key, baseURL: 'https://api.groq.com/openai/v1' });
  return _groq;
}

function getAnthropic(): Anthropic | null {
  if (_anthropic) return _anthropic;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  _anthropic = new Anthropic({ apiKey: key });
  return _anthropic;
}

export async function* streamChat(opts: {
  system: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  maxTokens?: number;
}): AsyncGenerator<string> {
  const groq = getGroq();
  if (groq) {
    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      stream: true,
      max_tokens: opts.maxTokens ?? 1024,
      messages: [
        { role: 'system', content: opts.system },
        ...opts.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
    return;
  }

  const anthropic = getAnthropic();
  if (anthropic) {
    const stream = await anthropic.messages.stream({
      model: CLAUDE_MODEL,
      system: opts.system,
      messages: opts.messages,
      max_tokens: opts.maxTokens ?? 1024,
    });
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
    return;
  }

  yield "I'm running without an API key right now. Add GROQ_API_KEY (free at console.groq.com) or ANTHROPIC_API_KEY to .env.local to enable AI responses.";
}
