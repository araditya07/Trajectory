'use client';

import { colors } from '@/styles/tokens';

export function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
      <div
        style={{
          padding: '12px 14px',
          borderRadius: 14,
          borderBottomLeftRadius: 4,
          background: colors.cardAlt,
          border: `1px solid ${colors.border}`,
          display: 'inline-flex',
          gap: 4,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: colors.textMid,
              animation: 'typingPulse 1.2s infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
