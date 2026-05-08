import type { LensResult, RAGContext } from '@/types';

// Lens 1 — Consistency (deterministic)
export function lensConsistency(ctx: RAGContext): LensResult {
  const score = Math.round(ctx.habit_summary.consistency_pct || 0);
  return {
    name: 'Consistency',
    weight: 0.30,
    method: 'Habit logs vs declared frequency, 7-day rolling window',
    data_source: 'habit_logs table',
    verdict: score >= 70 ? 'On pace with declared habits.' : 'Several habits slipping this week.',
    score,
    color: score >= 70 ? 'success' : score >= 40 ? 'info' : 'danger',
  };
}

// Lens 4 — Gap Detection (deterministic)
export function lensGap(ctx: RAGContext): LensResult {
  if (!ctx.goals.length) {
    return {
      name: 'Gap Detection',
      weight: 0.15,
      method: 'progress_pct vs (days_elapsed / total_days × 100)',
      data_source: 'goals table',
      verdict: 'No active goals.',
      score: 50,
      color: 'info',
    };
  }
  const cycleDays = (cycle: string) =>
    cycle === '7-day' ? 7 : cycle === '30-day' ? 30 : cycle === '90-day' ? 90 : 365;
  const now = Date.now();
  const deltas = ctx.goals.map((g) => {
    const total = cycleDays(g.cycle);
    const elapsed = Math.max(1, (now - new Date(g.started_at).getTime()) / 86400000);
    const expected = Math.min(100, (elapsed / total) * 100);
    return g.progress_pct - expected;
  });
  const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  const score = Math.max(0, Math.min(100, 65 + avgDelta));
  return {
    name: 'Gap Detection',
    weight: 0.15,
    method: 'progress_pct vs (days_elapsed / total_days × 100)',
    data_source: 'goals table',
    verdict: avgDelta < -5 ? 'Behind expected pace.' : avgDelta > 5 ? 'Ahead of pace.' : 'On expected pace.',
    score: Math.round(score),
    color: avgDelta < -5 ? 'danger' : avgDelta > 5 ? 'success' : 'info',
  };
}

// Lenses 2/3/5 — placeholders for embedding/NLP work
export function lensTrajectory(_ctx: RAGContext): LensResult {
  return {
    name: 'Trajectory',
    weight: 0.25,
    method: 'Cosine similarity between recent entry embeddings and goal description embeddings',
    data_source: 'Pinecone vectors + goal descriptions',
    verdict: 'Not enough entries yet to compute drift.',
    score: 60,
    color: 'info',
  };
}

export function lensEffort(_ctx: RAGContext): LensResult {
  return {
    name: 'Effort-to-Output',
    weight: 0.20,
    method: 'NLP extraction: time mentions vs measurable outcomes',
    data_source: 'journal_entries content',
    verdict: 'Insufficient entries for ratio extraction.',
    score: 60,
    color: 'info',
  };
}

export function lensPatterns(_ctx: RAGContext): LensResult {
  return {
    name: 'Pattern Recognition',
    weight: 0.10,
    method: 'Cluster recent entries by topic via embedding proximity',
    data_source: 'last 14 entries',
    verdict: 'Need 14+ entries before patterns surface.',
    score: 60,
    color: 'insight',
  };
}

export function runAllLenses(ctx: RAGContext): LensResult[] {
  return [
    lensConsistency(ctx),
    lensTrajectory(ctx),
    lensEffort(ctx),
    lensGap(ctx),
    lensPatterns(ctx),
  ];
}

export function weightedScore(lenses: LensResult[]): number {
  const total = lenses.reduce((s, l) => s + l.score * l.weight, 0);
  return Math.round(total);
}
