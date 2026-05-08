import { NextRequest } from 'next/server';
import { streamChat } from '@/lib/ai/claude';
import { DAILY_CHAT_SYSTEM } from '@/lib/ai/prompts';
import { buildContext, contextToXml } from '@/lib/ai/rag';
import type { Goal, JournalEntry, RAGContext } from '@/types';

export const runtime = 'nodejs';

interface ChatBody {
  message: string;
  userId?: string;
  goals?: Goal[];
  recentEntries?: JournalEntry[];
  habitSummary?: RAGContext['habit_summary'];
  moodTrend?: number[];
  streak?: number;
  dayNumber?: number;
  userPurpose?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as ChatBody;
  if (!body.message || typeof body.message !== 'string') {
    return new Response('Missing message', { status: 400 });
  }

  let systemPrompt = DAILY_CHAT_SYSTEM;
  if (body.userId) {
    try {
      const ctx = await buildContext({
        userId: body.userId,
        message: body.message,
        goals: body.goals ?? [],
        recentEntries: body.recentEntries ?? [],
        habitSummary: body.habitSummary ?? { today: {}, week: {}, consistency_pct: 0 },
        moodTrend: body.moodTrend ?? [],
        streak: body.streak ?? 0,
        dayNumber: body.dayNumber ?? 1,
        userPurpose: body.userPurpose ?? '',
      });
      systemPrompt = `${DAILY_CHAT_SYSTEM}\n\n${contextToXml(ctx)}`;
    } catch {
      // Continue without context if RAG fails
    }
  }

  const messages = [
    ...(body.history ?? []).slice(-20),
    { role: 'user' as const, content: body.message },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamChat({ system: systemPrompt, messages })) {
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
