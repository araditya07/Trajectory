'use client';

import { useState } from 'react';
import { colors, fonts } from '@/styles/tokens';
import { createClient } from '@/lib/supabase/client';

export function GuestBanner() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/api/auth/callback` },
      });
      if (error) {
        setError(error.message);
        setBusy(false);
      }
      // On success the browser navigates away; no further state needed here.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed');
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '8px 16px',
        background: colors.accentDim,
        borderBottom: `1px solid ${colors.accentBorder}`,
        fontFamily: fonts.body,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: colors.accent,
          fontFamily: fonts.mono,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        Guest mode
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {error && (
          <span style={{ fontSize: 11, color: colors.red }}>{error}</span>
        )}
        <button
          type="button"
          onClick={signIn}
          disabled={busy}
          style={{
            padding: '4px 12px',
            borderRadius: 999,
            background: colors.accent,
            color: '#1A1608',
            border: 0,
            fontFamily: fonts.body,
            fontSize: 12,
            fontWeight: 600,
            cursor: busy ? 'wait' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? 'Redirecting…' : 'Sign in to sync'}
        </button>
      </div>
    </div>
  );
}
