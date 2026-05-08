'use client';

import { Icon } from '@/components/ui';
import { colors, fonts } from '@/styles/tokens';
import { formatTime } from '@/lib/utils';
import type { ChatMessage } from '@/types';

export function TextBubble({ msg }: { msg: ChatMessage }) {
  const role = msg.role;
  const isUser = role === 'user';
  const actions: string[] = Array.isArray(msg.metadata?.actions) ? msg.metadata.actions : [];
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
          gap: 4,
          maxWidth: isUser ? '82%' : '90%',
        }}
      >
        <div
          style={{
            padding: '10px 13px',
            borderRadius: 14,
            borderBottomLeftRadius: isUser ? 14 : 4,
            borderBottomRightRadius: isUser ? 4 : 14,
            background: isUser ? colors.accentDim : colors.cardAlt,
            border: `1px solid ${isUser ? colors.accentBorder : colors.border}`,
            color: colors.text,
            fontFamily: fonts.body,
            fontSize: 13,
            lineHeight: 1.65,
            whiteSpace: 'pre-wrap',
          }}
        >
          {msg.content}
        </div>
        {actions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
            {actions.map((a, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: colors.greenDim,
                  border: `1px solid ${colors.greenBorder}`,
                  color: colors.green,
                  fontFamily: fonts.mono,
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                {a}
              </span>
            ))}
          </div>
        )}
        <span style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textDim }}>
          {formatTime(msg.created_at)}
        </span>
      </div>
    </div>
  );
}

export function InsightBubble({
  tag = 'Pattern Recognition',
  text,
}: {
  tag?: string;
  text: string;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
      <div
        style={{
          maxWidth: '90%',
          padding: '12px 14px',
          borderRadius: 14,
          borderBottomLeftRadius: 4,
          background:
            'linear-gradient(135deg, rgba(149,117,205,0.14), rgba(28,27,40,0.6))',
          border: '1px solid rgba(149,117,205,0.30)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: fonts.mono,
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: colors.purple,
          }}
        >
          <Icon name="pattern" size={12} />
          {tag}
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 13,
            lineHeight: 1.65,
            color: colors.text,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
