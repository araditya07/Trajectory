import type { CSSProperties } from 'react';
import type { IconName } from '@/types';

const ICON_PATHS: Record<IconName, JSX.Element> = {
  goal: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </g>
  ),
  habit: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 0 1 13.5-5.8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1 -13.5 5.8" />
      <path d="M4 20v-4h4" />
    </g>
  ),
  chat: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12c0 4.5-4 8-9 8a9.4 9.4 0 0 1 -3.5-.7L4 21l1.3-3.8A7.7 7.7 0 0 1 3 12c0-4.5 4-8 9-8s9 3.5 9 8z" />
    </g>
  ),
  today: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </g>
  ),
  you: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M5.5 19a7 7 0 0 1 13 0" />
    </g>
  ),
  pattern: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="18" r="2" />
      <circle cx="12" cy="6" r="2" />
      <circle cx="18" cy="14" r="2" />
      <path d="M7.5 16.5l3-8" />
      <path d="M13.5 7l3 5.5" />
    </g>
  ),
  send: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </g>
  ),
  check: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </g>
  ),
  cycle: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 9a8.5 8.5 0 0 1 14.5-3" />
      <path d="M18 3v3.5h-3.5" />
      <path d="M20.5 15a8.5 8.5 0 0 1 -14.5 3" />
      <path d="M6 21v-3.5h3.5" />
    </g>
  ),
  bell: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </g>
  ),
  review: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3.5v3" />
      <path d="M16 3.5v3" />
      <path d="M9 14l2 2 4-4" />
    </g>
  ),
  spark: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="M5.5 5.5l2 2" />
      <path d="M16.5 16.5l2 2" />
      <path d="M5.5 18.5l2 -2" />
      <path d="M16.5 7.5l2 -2" />
    </g>
  ),
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 20, color, style }: IconProps) {
  const path = ICON_PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ color, display: 'inline-block', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
