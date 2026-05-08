import { NextRequest } from 'next/server';
import { streamChat } from '@/lib/ai/claude';
import { DAILY_CHAT_SYSTEM } from '@/lib/ai/prompts';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { message } = await req.json().catch(() => ({}));
  if (!message || typeof message !== 'string') {
    return new Response('Missing message', { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamChat({
          system: DAILY_CHAT_SYSTEM,
          messages: [{ role: 'user', content: message }],
        })) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(`\n\n[error] ${err instanceof Error ? err.message : 'unknown'}`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
