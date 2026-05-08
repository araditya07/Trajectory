'use client';

import { useState } from 'react';
import { Icon, Button } from '@/components/ui';
import { colors, fonts } from '@/styles/tokens';
import { PRESET_HABITS } from '@/lib/constants';
import type { IconName } from '@/types';

export interface HabitSetupItem {
  id: string;
  name: string;
  icon: IconName;
  category: string;
  recommended?: boolean;
  custom?: boolean;
  selected: boolean;
}

function HabitToggleRow({
  habit,
  checked,
  onToggle,
}: {
  habit: HabitSetupItem;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        background: checked ? colors.greenDim : colors.card,
        border: `1px solid ${checked ? 'rgba(76,175,110,0.30)' : colors.border}`,
        borderRadius: 12,
        padding: '12px 14px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: checked ? 'rgba(76,175,110,0.16)' : colors.cardAlt,
          border: `1px solid ${checked ? 'rgba(76,175,110,0.30)' : colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: checked ? colors.green : colors.textMid,
          flexShrink: 0,
        }}
      >
        <Icon name={habit.icon} size={16} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontFamily: fonts.body, fontSize: 14, color: checked ? colors.text : colors.textMid }}>
          {habit.name}
        </span>
        <span
          style={{
            display: 'inline-flex',
            gap: 6,
            alignItems: 'center',
            fontFamily: fonts.mono,
            fontSize: 9,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: colors.textDim,
          }}
        >
          <span>{habit.category}</span>
          {habit.recommended && <span style={{ color: colors.accent }}>· recommended</span>}
          {habit.custom && <span style={{ color: colors.accent }}>· custom</span>}
        </span>
      </div>
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          border: `1.5px solid ${checked ? colors.green : colors.borderFocus}`,
          background: checked ? colors.green : 'transparent',
          color: '#0C0B10',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.2s ease, border-color 0.2s ease',
        }}
      >
        {checked ? <Icon name="check" size={14} /> : null}
      </span>
    </button>
  );
}

export function HabitSetup({ onNext }: { onNext: (habits: HabitSetupItem[]) => void }) {
  const [habits, setHabits] = useState<HabitSetupItem[]>(() =>
    PRESET_HABITS.map((h) => ({
      id: h.id,
      name: h.name,
      icon: h.icon,
      category: h.category,
      recommended: h.recommended,
      selected: !!h.recommended,
    })),
  );
  const [draft, setDraft] = useState('');

  const toggle = (id: string) =>
    setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, selected: !h.selected } : h)));

  const addCustom = () => {
    const t = draft.trim();
    if (!t) return;
    const id = 'c' + Date.now();
    setHabits((hs) => [
      ...hs,
      { id, icon: 'spark', name: t, category: 'custom', custom: true, selected: true },
    ]);
    setDraft('');
  };

  const count = habits.filter((h) => h.selected).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px 22px 12px',
        }}
      >
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
            Step 1 of 2
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
            Pick your daily habits
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
            We&rsquo;ve recommended four based on popular choices. Toggle any on or off, or add your own below.
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {habits.map((h) => (
            <HabitToggleRow key={h.id} habit={h} checked={h.selected} onToggle={() => toggle(h.id)} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder="Add your own habit…"
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
          {count} habit{count === 1 ? '' : 's'} selected
        </span>
        <Button disabled={count === 0} onClick={() => onNext(habits.filter((h) => h.selected))}>
          Next — Set your goals
        </Button>
      </div>
    </div>
  );
}
