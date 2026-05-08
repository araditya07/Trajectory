'use client';

import { Icon, SectionLabel, ProgressBar } from '@/components/ui';
import { colors, fonts } from '@/styles/tokens';
import { useDataStore } from '@/stores/data-store';
import { todayKey } from '@/lib/utils';
import type { IconName } from '@/types';

function HabitRow({
  id,
  icon,
  name,
  done,
  onToggle,
}: {
  id: string;
  icon: IconName;
  name: string;
  done: boolean;
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
        background: done ? colors.greenDim : colors.card,
        border: `1px solid ${done ? 'rgba(76,175,110,0.30)' : colors.border}`,
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
          background: done ? 'rgba(76,175,110,0.16)' : colors.cardAlt,
          border: `1px solid ${done ? 'rgba(76,175,110,0.30)' : colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: done ? colors.green : colors.textMid,
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={16} />
      </div>
      <span style={{ flex: 1, fontFamily: fonts.body, fontSize: 14, color: done ? colors.text : colors.textMid }}>
        {name}
      </span>
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          border: `1.5px solid ${done ? colors.green : colors.borderFocus}`,
          background: done ? colors.green : 'transparent',
          color: '#0C0B10',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {done ? <Icon name="check" size={14} /> : null}
      </span>
    </button>
  );
}

export function HabitsTab() {
  const habits = useDataStore((s) => s.habits);
  const habitLogs = useDataStore((s) => s.habitLogs);
  const toggleHabitLog = useDataStore((s) => s.toggleHabitLog);

  const today = todayKey();
  const todayLogs = habitLogs[today] || {};
  const completedCount = habits.filter((h) => todayLogs[h.id]).length;
  const pct = habits.length ? Math.round((completedCount / habits.length) * 100) : 0;

  // 7-day overview
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <SectionLabel>Today</SectionLabel>
        <h1
          style={{
            fontFamily: fonts.display,
            fontSize: 22,
            fontWeight: 400,
            margin: 0,
            color: colors.text,
          }}
        >
          Daily check-in
        </h1>
        <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textMid, margin: 0 }}>
          {completedCount}/{habits.length} habits completed
        </p>
      </header>

      <div>
        <ProgressBar value={pct} color={colors.accent} height={6} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {habits.length === 0 ? (
          <p style={{ color: colors.textDim, fontSize: 13 }}>No habits set up yet.</p>
        ) : (
          habits.map((h) => (
            <HabitRow
              key={h.id}
              id={h.id}
              icon={(h.icon as IconName) || 'spark'}
              name={h.name}
              done={!!todayLogs[h.id]}
              onToggle={() => toggleHabitLog(h.id)}
            />
          ))
        )}
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SectionLabel>This week</SectionLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 6,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 14,
            padding: 14,
          }}
        >
          {days.map((d) => {
            const dayLogs = habitLogs[d] || {};
            const completed = habits.filter((h) => dayLogs[h.id]).length;
            const ratio = habits.length ? completed / habits.length : 0;
            const dayLabel = new Date(d).toLocaleDateString([], { weekday: 'short' }).slice(0, 1);
            return (
              <div key={d} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: ratio === 0 ? colors.cardAlt : `rgba(76,175,110,${0.15 + ratio * 0.6})`,
                    border: `1px solid ${ratio > 0 ? colors.greenBorder : colors.border}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 9,
                    color: colors.textDim,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                  }}
                >
                  {dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
