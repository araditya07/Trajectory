'use client';

import { useState, type KeyboardEvent } from 'react';
import { Icon } from '@/components/ui';
import { colors, fonts } from '@/styles/tokens';
import { QUICK_ACTIONS } from '@/lib/constants';

export function InputBar({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState('');

  const submit = () => {
    const t = value.trim();
    if (!t || disabled) return;
    onSend(t);
    setValue('');
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      style={{
        padding: '10px 14px 14px',
        background: colors.bg,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {QUICK_ACTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSend(q)}
            disabled={disabled}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              background: colors.cardAlt,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              fontFamily: fonts.body,
              fontSize: 12,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {q}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          padding: '4px 4px 4px 14px',
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          placeholder="What's on your mind?"
          disabled={disabled}
          style={{
            flex: 1,
            padding: '10px 0',
            background: 'transparent',
            border: 0,
            color: colors.text,
            fontFamily: fonts.body,
            fontSize: 13,
          }}
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: `1px solid ${colors.accentBorder}`,
            background: value.trim() && !disabled ? colors.accent : colors.cardAlt,
            color: value.trim() && !disabled ? '#1A1608' : colors.textMid,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: !value.trim() || disabled ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          <Icon name="send" size={16} />
        </button>
      </div>
    </div>
  );
}
