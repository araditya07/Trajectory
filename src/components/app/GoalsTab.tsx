'use client';

import { useState } from 'react';
import { Icon, SectionLabel, ProgressBar, Badge, Button } from '@/components/ui';
import { colors, fonts, STATUS_COLOR } from '@/styles/tokens';
import { useDataStore } from '@/stores/data-store';
import type { Goal, IconName } from '@/types';

function GoalCard({ goal, onAdjust }: { goal: Goal; onAdjust: (delta: number) => void }) {
  const status =
    goal.progress_pct >= 100 ? 'on-track' :
    goal.progress_pct < 30 ? 'behind' :
    'on-track';
  const c = STATUS_COLOR[status];

  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: colors.cardAlt,
            border: `1px solid ${colors.border}`,
            color: colors.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name={(goal.icon as IconName) || 'goal'} size={16} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: fonts.body, fontSize: 14, fontWeight: 600, color: colors.text }}>
            {goal.title}
          </span>
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.textDim,
            }}
          >
            {goal.cycle} · {goal.target ?? '—'}
          </span>
        </div>
        <Badge variant={goal.progress_pct >= 100 ? 'success' : goal.progress_pct < 30 ? 'danger' : 'success'}>
          {c.label}
        </Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: fonts.mono, fontSize: 24, color: c.fg, fontWeight: 600 }}>
          {Math.round(goal.progress_pct)}
          <span style={{ fontSize: 12, color: colors.textMid }}>%</span>
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={() => onAdjust(-5)}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              background: colors.cardAlt,
              border: `1px solid ${colors.border}`,
              color: colors.textMid,
              fontFamily: fonts.mono,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            −5
          </button>
          <button
            type="button"
            onClick={() => onAdjust(5)}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              background: colors.accentDim,
              border: `1px solid ${colors.accentBorder}`,
              color: colors.accent,
              fontFamily: fonts.mono,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            +5
          </button>
        </div>
      </div>
      <ProgressBar value={goal.progress_pct} color={c.fg} />
    </div>
  );
}

export function GoalsTab() {
  const goals = useDataStore((s) => s.goals);
  const updateGoal = useDataStore((s) => s.updateGoal);
  const addGoal = useDataStore((s) => s.addGoal);
  const removeGoal = useDataStore((s) => s.removeGoal);

  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState('');

  const onAdjust = (id: string, delta: number) => {
    const g = goals.find((x) => x.id === id);
    if (!g) return;
    updateGoal(id, { progress_pct: Math.max(0, Math.min(100, g.progress_pct + delta)) });
  };

  const submitNew = () => {
    const t = draft.trim();
    if (!t) return;
    addGoal({
      title: t,
      category: 'personal',
      cycle: '30-day',
      measurable_signal: null,
      target: null,
      icon: 'spark',
    });
    setDraft('');
    setShowForm(false);
  };

  return (
    <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <SectionLabel>Your goals</SectionLabel>
        <h1 style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 400, margin: 0, color: colors.text }}>
          Active cycle
        </h1>
        <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textMid, margin: 0 }}>
          {goals.length} goal{goals.length === 1 ? '' : 's'} in progress.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {goals.length === 0 ? (
          <p style={{ color: colors.textDim, fontSize: 13 }}>No goals yet.</p>
        ) : (
          goals.map((g) => (
            <div key={g.id} style={{ position: 'relative' }}>
              <GoalCard goal={g} onAdjust={(delta) => onAdjust(g.id, delta)} />
              <button
                type="button"
                onClick={() => removeGoal(g.id)}
                aria-label="Remove"
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: 'transparent',
                  border: `1px solid ${colors.border}`,
                  color: colors.textDim,
                  cursor: 'pointer',
                  fontSize: 12,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {showForm ? (
        <div
          style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 14,
            padding: 14,
            display: 'flex',
            gap: 8,
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitNew()}
            placeholder="New goal title…"
            autoFocus
            style={{
              flex: 1,
              padding: '11px 14px',
              borderRadius: 11,
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              fontFamily: fonts.body,
              fontSize: 13,
            }}
          />
          <button
            type="button"
            onClick={submitNew}
            style={{
              padding: '0 14px',
              borderRadius: 11,
              background: colors.accentDim,
              border: `1px solid ${colors.accentBorder}`,
              color: colors.accent,
              fontFamily: fonts.body,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </div>
      ) : (
        <Button variant="ghost" onClick={() => setShowForm(true)}>
          + Add a goal
        </Button>
      )}
    </div>
  );
}
