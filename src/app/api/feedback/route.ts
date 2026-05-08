import { NextRequest, NextResponse } from 'next/server';
import { runAllLenses, weightedScore } from '@/lib/ai/evaluation-lenses';
import type { RAGContext } from '@/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const ctx = (body.context as RAGContext) ?? null;
  if (!ctx) return NextResponse.json({ error: 'missing context' }, { status: 400 });

  const lenses = runAllLenses(ctx);
  const overall = weightedScore(lenses);

  return NextResponse.json({
    report: {
      summary:
        'Auto-generated report from local lens runs. Wire FEEDBACK_REPORT_SYSTEM to Claude for narrative summaries.',
      overall_score: overall,
      decision_architecture: lenses,
      goal_breakdowns: ctx.goals.map((g) => ({
        goal_id: g.id,
        title: g.title,
        progress_pct: g.progress_pct,
        status: g.status,
        delta: '+0%',
        comment: 'Stub breakdown — connect Claude to fill in.',
      })),
      improvement_plan: [],
      report_date: new Date().toISOString().slice(0, 10),
    },
  });
}
