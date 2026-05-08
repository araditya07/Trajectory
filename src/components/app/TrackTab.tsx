'use client';

import { useState } from 'react';
import { Icon, SectionLabel, ProgressBar, Badge } from '@/components/ui';
import { colors, fonts, STATUS_COLOR } from '@/styles/tokens';
import { useDataStore } from '@/stores/data-store';
import type { LensResult } from '@/types';

const DEFAULT_LENSES: LensResult[] = [
  {
    name: 'Consistency',
    weight: 0.30,
    method: 'Habit logs vs declared frequency, 7-day window',
    data_source: 'habit_logs table',
    verdict: 'You logged 18/21 expected habits this week.',
    score: 86,
    color: 'success',
  },
  {
    name: 'Trajectory',
    weight: 0.25,
    method: 'Cosine similarity between recent entries and goal embeddings',
    data_source: 'Pinecone vectors + goal description',
    verdict: 'Entries are drifting toward fitness language. Up trend.',
    score: 72,
    color: 'success',
  },
  {
    name: 'Effort-to-Output',
    weight: 0.20,
    method: 'NLP extraction: time mentions vs measurable outcomes',
    data_source: 'journal_entries content',
    verdict: 'High effort on reading goal, lower on side project.',
    score: 58,
    color: 'info',
  },
  {
    name: 'Gap Detection',
    weight: 0.15,
    method: 'progress_pct vs (days_elapsed / total_days × 100)',
    data_source: 'goals table',
    verdict: '1 goal behind expected pace by 14%.',
    score: 64,
    color: 'danger',
  },
  {
    name: 'Pattern Recognition',
    weight: 0.10,
    method: 'Cluster recent entries by topic via embedding proximity',
    data_source: 'last 14 entries',
    verdict: 'Recurring theme: evening fatigue. Worth noticing.',
    score: 70,
    color: 'insight',
  },
];

const COLOR_MAP: Record<string, string> = {
  success: colors.green,
  danger: colors.red,
  info: colors.blue,
  insight: colors.purple,
  accent: colors.accent,
};

const VARIANT_MAP: Record<string, 'success' | 'danger' | 'info' | 'insight' | 'accent'> = {
  success: 'success', danger: 'danger', info: 'info', insight: 'insight', accent: 'accent',
};

function LensRow({ lens, expanded, onToggle }: { lens: LensResult; expanded: boolean; onToggle: () => void }) {
  const fg = COLOR_MAP[lens.color] || colors.accent;
  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: 14,
          background: 'transparent',
          border: 0,
          gap: 12,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 600, color: colors.text }}>
              {lens.name}
            </span>
            <Badge variant={VARIANT_MAP[lens.color] || 'accent'} dot>
              {Math.round(lens.weight * 100)}%
            </Badge>
          </div>
          <ProgressBar value={lens.score} color={fg} />
        </div>
        <span style={{ fontFamily: fonts.mono, fontSize: 18, fontWeight: 600, color: fg }}>
          {lens.score}
        </span>
        <span style={{ color: colors.textMid, fontSize: 12 }}>{expanded ? '▴' : '▾'}</span>
      </button>
      {expanded && (
        <div
          style={{
            padding: '0 14px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            borderTop: `1px solid ${colors.border}`,
            paddingTop: 12,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SectionLabel>Method</SectionLabel>
            <span style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textMid }}>{lens.method}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SectionLabel>Data source</SectionLabel>
            <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMid }}>{lens.data_source}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SectionLabel>Verdict</SectionLabel>
            <span style={{ fontFamily: fonts.body, fontSize: 13, color: colors.text }}>{lens.verdict}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function TrackTab() {
  const reports = useDataStore((s) => s.reports);
  const goals = useDataStore((s) => s.goals);
  const latest = reports[reports.length - 1];

  const [expanded, setExpanded] = useState<string | null>(null);
  const lenses = latest?.decision_architecture ?? DEFAULT_LENSES;

  const overall =
    latest?.overall_score ?? Math.round(lenses.reduce((s, l) => s + l.score * l.weight, 0));

  return (
    <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <SectionLabel>Weekly report</SectionLabel>
        <h1 style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 400, margin: 0, color: colors.text }}>
          Where you are
        </h1>
        <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textMid, margin: 0 }}>
          {latest?.summary ??
            'Run for a week and the AI will generate a real evidence-based report. The breakdown below shows how each lens contributes.'}
        </p>
      </header>

      <div
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: colors.accentDim,
            border: `1px solid ${colors.accentBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: fonts.mono, fontSize: 26, fontWeight: 600, color: colors.accent }}>
            {overall}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SectionLabel>Overall score</SectionLabel>
          <span style={{ fontFamily: fonts.body, fontSize: 14, color: colors.text }}>
            {goals.length} active goal{goals.length === 1 ? '' : 's'} · {reports.length} report{reports.length === 1 ? '' : 's'} so far
          </span>
        </div>
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SectionLabel>Decision architecture</SectionLabel>
        <p style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textMid, margin: 0 }}>
          Five lenses, weighted, fully transparent. Tap any to see its method and data.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {lenses.map((l) => (
            <LensRow
              key={l.name}
              lens={l}
              expanded={expanded === l.name}
              onToggle={() => setExpanded((e) => (e === l.name ? null : l.name))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
