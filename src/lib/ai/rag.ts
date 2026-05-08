import { embed } from './embeddings';
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
  const vector = await embed(opts.message);
  let similar: JournalEntry[] = [];
  if (vector) {
    const matches = await querySimilar({ userId: opts.userId, vector, topK: 8 });
    similar = matches
      .map((m) => m.metadata as any)
      .filter(Boolean) as unknown as JournalEntry[];
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
