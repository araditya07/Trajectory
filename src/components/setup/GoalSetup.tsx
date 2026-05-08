'use client';

import { useState } from 'react';
import { Icon, Button } from '@/components/ui';
import { colors, fonts } from '@/styles/tokens';
import { PRESET_GOALS } from '@/lib/constants';
import type { IconName, GoalCategory, GoalCycle } from '@/types';

export interface GoalSetupItem {
  id: string;
  title: string;
  icon: IconName;
  category: GoalCategory | 'custom';
  cycle: GoalCycle;
  target: string;
  custom?: boolean;
}

function GoalTemplateCard({
  goal,
  selected,
  onClick,
}: {
  goal: GoalSetupItem;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 14,
        borderRadius: 12,
        background: selected ? colors.accentDim : colors.card,
        border: `1px solid ${selected ? colors.accentBorder : colors.border}`,
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: selected ? 'rgba(201,168,76,0.18)' : colors.cardAlt,
          border: `1px solid ${selected ? colors.accentBorder : colors.border}`,
          color: selected ? colors.accent : colors.textMid,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        <Icon name={goal.icon} size={16} />
      </div>
      <span
        style={{
          fontFamily: fonts.body,
          fontSize: 13,
          fontWeight: 600,
          color: selected ? colors.text : colors.textMid,
          lineHeight: 1.3,
        }}
      >
        {goal.title}
      </span>
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 10,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: colors.textDim,
          marginTop: 'auto',
        }}
      >
        {goal.cycle} · {goal.target}
      </span>
    </button>
  );
}

export function GoalSetup({ onNext }: { onNext: (goals: GoalSetupItem[]) => void }) {
  const [picks, setPicks] = useState<Record<string, boolean>>({});
  const [customs, setCustoms] = useState<GoalSetupItem[]>([]);
  const [draft, setDraft] = useState('');

  const presets: GoalSetupItem[] = PRESET_GOALS.map((g) => ({
    id: g.id,
    title: g.title,
    icon: g.icon,
    category: g.category,
    cycle: g.cycle,
    target: g.target,
  }));

  const toggle = (id: string) => setPicks((p) => ({ ...p, [id]: !p[id] }));
  const addCustom = () => {
    const t = draft.trim();
    if (!t) return;
    const id = 'cg' + Date.now();
    const goal: GoalSetupItem = {
      id,
      title: t,
      icon: 'spark',
      category: 'custom',
      cycle: '30-day',
      target: 'TBD',
      custom: true,
    };
    setCustoms((c) => [...c, goal]);
    setPicks((p) => ({ ...p, [id]: true }));
    setDraft('');
  };

  const count = Object.values(picks).filter(Boolean).length;
  const collect = () => [...presets, ...customs].filter((g) => picks[g.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 12px' }}>
        <header style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.3em',
              color: colors.accent,
              textTransform: 'uppercase',
            }}
          >
            Step 2 of 2
          </span>
          <h1
            style={{
              fontFamily: fonts.display,
              fontSize: 22,
              fontWeight: 400,
              lineHeight: 1.3,
              margin: 0,
              color: colors.text,
            }}
          >
            Choose your goals
          </h1>
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: 13,
              lineHeight: 1.55,
              color: colors.textMid,
              margin: 0,
            }}
          >
            Pick from templates or create custom goals. Each has a built-in cycle and measurable signal for the AI to track.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {presets.map((g) => (
            <GoalTemplateCard
              key={g.id}
              goal={g}
              selected={!!picks[g.id]}
              onClick={() => toggle(g.id)}
            />
          ))}
        </div>

        {customs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
            {customs.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => toggle(g.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: 12,
                  background: picks[g.id] ? colors.accentDim : colors.card,
                  border: `1px solid ${picks[g.id] ? colors.accentBorder : colors.border}`,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 9,
                    letterSpacing: '0.20em',
                    textTransform: 'uppercase',
                    color: colors.accent,
                    padding: '3px 7px',
                    borderRadius: 6,
                    background: colors.accentDim,
                    border: `1px solid ${colors.accentBorder}`,
                  }}
                >
                  Custom · 30-day
                </span>
                <span style={{ fontFamily: fonts.body, fontSize: 13, color: colors.text }}>
                  {g.title}
                </span>
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder="Add a custom goal…"
            style={{
              flex: 1,
              padding: '11px 14px',
              borderRadius: 11,
              background: colors.card,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              fontFamily: fonts.body,
              fontSize: 13,
            }}
          />
          <button
            type="button"
            onClick={addCustom}
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
              whiteSpace: 'nowrap',
            }}
          >
            + Add
          </button>
        </div>
      </div>

      <div
        style={{
          padding: '14px 22px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          borderTop: `1px solid ${colors.border}`,
          background: colors.bg,
        }}
      >
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 12,
            color: colors.textDim,
            textAlign: 'center',
          }}
        >
          {count} goal{count === 1 ? '' : 's'} selected
        </span>
        <Button disabled={count === 0} onClick={() => onNext(collect())}>
          Start your journey
        </Button>
      </div>
    </div>
  );
}
