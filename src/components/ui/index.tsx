'use client';

import type { CSSProperties, ReactNode, ButtonHTMLAttributes } from 'react';
import { colors, fonts } from '@/styles/tokens';

export { Icon } from './Icon';

export function SectionLabel({
  children,
  color = colors.textMid,
  style,
}: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: fonts.mono,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Card({
  children,
  alt,
  style,
  ...rest
}: { children: ReactNode; alt?: boolean; style?: CSSProperties } & ButtonHTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...(rest as any)}
      style={{
        background: alt ? colors.cardAlt : colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  active,
  onClick,
  color,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 20,
        background: active ? colors.accentDim : colors.cardAlt,
        border: `1px solid ${active ? colors.accentBorder : colors.border}`,
        color: active ? color || colors.accent : colors.text,
        fontFamily: fonts.body,
        fontSize: 13,
        cursor: 'pointer',
        transition: 'background 0.2s ease, border-color 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

const BADGE_COLORS = {
  default: { bg: colors.cardAlt,    bd: colors.border,        fg: colors.textMid },
  success: { bg: colors.greenDim,   bd: colors.greenBorder,   fg: colors.green },
  danger:  { bg: colors.redDim,     bd: colors.redBorder,     fg: colors.red },
  info:    { bg: colors.blueDim,    bd: colors.blueBorder,    fg: colors.blue },
  insight: { bg: colors.purpleDim,  bd: colors.purpleBorder,  fg: colors.purple },
  accent:  { bg: colors.accentDim,  bd: colors.accentBorder,  fg: colors.accent },
} as const;

export type BadgeVariant = keyof typeof BADGE_COLORS;

export function Badge({
  children,
  variant = 'default',
  dot = true,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
}) {
  const c = BADGE_COLORS[variant];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 8px',
        borderRadius: 6,
        fontFamily: fonts.mono,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        background: c.bg,
        border: `1px solid ${c.bd}`,
        color: c.fg,
      }}
    >
      {dot && (
        <span
          style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }}
        />
      )}
      {children}
    </span>
  );
}

export function ProgressBar({
  value = 0,
  color = colors.accent,
  height = 5,
}: {
  value?: number;
  color?: string;
  height?: number;
}) {
  return (
    <div
      style={{
        width: '100%',
        height,
        borderRadius: 999,
        background: 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          height: '100%',
          borderRadius: 'inherit',
          background: color,
          transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)',
        }}
      />
    </div>
  );
}

export function MetricDisplay({
  value,
  unit,
  label,
  delta,
  color = colors.text,
  size = 42,
}: {
  value: ReactNode;
  unit?: string;
  label?: string;
  delta?: string;
  color?: string;
  size?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && <SectionLabel>{label}</SectionLabel>}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span
          style={{
            fontFamily: fonts.mono,
            fontWeight: 600,
            fontSize: size,
            color,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
          {unit && (
            <span style={{ fontSize: size * 0.45, color: colors.textMid }}>{unit}</span>
          )}
        </span>
        {delta && (
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 12,
              color: delta.startsWith('-') ? colors.red : colors.green,
            }}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

export function Button({
  children,
  variant = 'primary',
  disabled,
  onClick,
  style,
  type = 'button',
}: {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  type?: 'button' | 'submit';
}) {
  const isPrimary = variant === 'primary';
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        padding: '15px 20px',
        borderRadius: 12,
        border: `1px solid ${isPrimary ? colors.accentBorder : colors.border}`,
        background: isPrimary ? colors.accent : 'transparent',
        color: isPrimary ? '#1A1608' : colors.text,
        fontFamily: fonts.body,
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function QuickAction({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 14px',
        borderRadius: 20,
        background: colors.cardAlt,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        fontFamily: fonts.body,
        fontSize: 13,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      {children}
    </button>
  );
}
