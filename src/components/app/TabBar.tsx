'use client';

import { Icon } from '@/components/ui';
import { colors, fonts } from '@/styles/tokens';
import { useAppStore } from '@/stores/app-store';
import type { AppTab, IconName } from '@/types';

const TABS: { id: AppTab; label: string; icon: IconName }[] = [
  { id: 'habits',  label: 'Habits',  icon: 'habit' },
  { id: 'goals',   label: 'Goals',   icon: 'goal' },
  { id: 'journal', label: 'Journal', icon: 'chat' },
  { id: 'track',   label: 'Track',   icon: 'pattern' },
];

export function TabBar() {
  const tab = useAppStore((s) => s.tab);
  const setTab = useAppStore((s) => s.setTab);

  return (
    <nav
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        background: colors.bg,
        borderTop: `1px solid ${colors.border}`,
        padding: '8px 8px 14px',
      }}
    >
      {TABS.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '8px 4px',
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              color: active ? colors.accent : colors.textMid,
              transition: 'color 0.2s ease',
            }}
          >
            <Icon name={t.icon} size={20} />
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
