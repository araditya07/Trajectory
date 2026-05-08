import { querySimilar } from '@/lib/pinecone';
import type { RAGContext, JournalEntry, Goal } from '@/types';

export async function buildContext(opts: {
  userId: string;
  message: string;
  goals: Goal[];
  recentEntries: JournalEntry[];
  habitSummary: RAGContext['habit_summary'];
  moodTrend: number[];
  streak: number;
  dayNumber: number;
  userPurpose: string;
}): Promise<RAGContext> {
  let similar: JournalEntry[] = [];
  if (process.env.PINECONE_API_KEY) {
    try {
      const hits = await querySimilar({ userId: opts.userId, query: opts.message, topK: 8 });
      similar = hits
        .map((h) => {
          const meta = h.metadata ?? {};
          return {
            id: h.id,
            user_id: opts.userId,
            content: (h.text ?? meta.chunk_text ?? '') as string,
            mood_score: (meta.mood_score as number) ?? null,
            mood_label: (meta.mood_label as string) ?? null,
            habits_snapshot: null,
            embedding_id: h.id,
            entry_date: (meta.entry_date as string) ?? '',
            day_number: (meta.day_number as number) ?? 0,
          } as JournalEntry;
        })
        .filter((e) => e.content);
    } catch {
      // Fall through to recent entries
    }
  }

  return {
    similar_entries: similar.length ? similar : opts.recentEntries.slice(-5),
    goals: opts.goals,
    habit_summary: opts.habitSummary,
    mood_trend: opts.moodTrend,
    streak: opts.streak,
    day_number: opts.dayNumber,
    user_purpose: opts.userPurpose,
  };
}

export function contextToXml(ctx: RAGContext): string {
  const goals = ctx.goals
    .map(
      (g) =>
        `  <goal id="${g.id}" cycle="${g.cycle}" progress="${Math.round(g.progress_pct)}%">${g.title}</goal>`,
    )
    .join('\n');
  const entries = ctx.similar_entries
    .slice(0, 5)
    .map(
      (e) =>
        `  <entry date="${e.entry_date}" mood="${e.mood_score ?? 'n/a'}">${e.content.slice(0, 280)}</entry>`,
    )
    .join('\n');
  return `<context>
<user purpose="${ctx.user_purpose}" day="${ctx.day_number}" streak="${ctx.streak}" />
<habits consistency="${ctx.habit_summary.consistency_pct}%" />
<mood_trend>${ctx.mood_trend.join(',')}</mood_trend>
<goals>
${goals || '  <none />'}
</goals>
<recent_entries>
${entries || '  <none />'}
</recent_entries>
</context>`;
}
