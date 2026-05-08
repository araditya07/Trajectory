'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui';
import { Button } from '@/components/ui';
import { colors, fonts } from '@/styles/tokens';
import { createClient } from '@/lib/supabase/client';
import type { IconName } from '@/types';

interface Step {
  icon: IconName;
  heading: string[];
  sub: string;
}

const STEPS: Step[] = [
  {
    icon: 'review',
    heading: ['Your thoughts', 'deserve a witness.'],
    sub: "Trajectory reads your daily journal, tracks your habits, and tells you — with evidence — whether you're actually making progress.",
  },
  {
    icon: 'goal',
    heading: ['Habits & goals,', 'structured for you.'],
    sub: 'Pick from pre-built habits or create your own. Set goals with measurable signals. The AI uses this structure to give you real feedback, not vibes.',
  },
  {
    icon: 'pattern',
    heading: ['AI that shows', 'its homework.'],
    sub: 'Every verdict comes with a Decision Architecture — 5 evaluation lenses, their methods, and the data they used. No black box. Challenge anything.',
  },
  {
    icon: 'spark',
    heading: ['Ready to begin?'],
    sub: 'You can explore without logging in. Your data saves locally and syncs when you sign up.',
  },
];

function HeroTile({ name }: { name: IconName }) {
  return (
    <div
      style={{
        width: 88,
        height: 88,
        borderRadius: 22,
        background: colors.accentDim,
        border: `1px solid ${colors.accentBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.accent,
        position: 'relative',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: -22,
          borderRadius: 32,
          background: 'radial-gradient(closest-side, rgba(201,168,76,0.18), transparent 70%)',
          zIndex: -1,
          animation: 'haloPulse 4s ease-in-out infinite',
        }}
      />
      <Icon name={name} size={40} />
    </div>
  );
}

function ProgressDots({
  count,
  active,
  onJump,
}: {
  count: number;
  active: number;
  onJump: (i: number) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === active;
        const isPast = i < active;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onJump(i)}
            aria-label={`Step ${i + 1}`}
            style={{
              width: isActive ? 24 : 8,
              height: 8,
              borderRadius: 999,
              background: isActive
                ? colors.accent
                : isPast
                  ? 'rgba(201,168,76,0.6)'
                  : 'rgba(255,255,255,0.08)',
              border: 0,
              padding: 0,
              cursor: 'pointer',
              transition: 'width 0.3s var(--ease-out-soft), background 0.3s ease',
            }}
          />
        );
      })}
    </div>
  );
}

function GoogleGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.46-.8 5.95-2.18l-2.92-2.26c-.8.54-1.83.86-3.03.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.32A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.69 9c0-.6.1-1.18.28-1.72V4.96H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.04l3.02-2.32z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .95 4.96L3.97 7.28C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

export function Walkthrough({ onDone }: { onDone: (opts: { guest: boolean }) => void }) {
  const [step, setStep] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);
  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const goNext = () => setStep((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStep((i) => Math.max(i - 1, 0));

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) setAuthError(error.message);
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Sign-in failed');
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 24px 28px',
        minHeight: 0,
      }}
    >
      <div style={{ paddingTop: 8 }}>
        <ProgressDots count={STEPS.length} active={step} onJump={setStep} />
      </div>

      <div
        key={step}
        className="fade-up"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 22,
          padding: '24px 6px',
        }}
      >
        <HeroTile name={s.icon} />
        <h1
          style={{
            fontFamily: fonts.display,
            fontSize: 26,
            fontWeight: 400,
            lineHeight: 1.3,
            margin: 0,
            color: colors.text,
            maxWidth: 320,
          }}
        >
          {s.heading.map((line, i) => (
            <span key={i}>
              {line}
              {i < s.heading.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: 14,
            lineHeight: 1.65,
            color: colors.textMid,
            margin: 0,
            maxWidth: 320,
          }}
        >
          {s.sub}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {!isLast && step === 0 && <Button onClick={goNext}>Continue</Button>}
        {!isLast && step > 0 && (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" style={{ flex: '0 0 38%' }} onClick={goBack}>
              Back
            </Button>
            <Button style={{ flex: 1 }} onClick={goNext}>
              Continue
            </Button>
          </div>
        )}
        {isLast && (
          <>
            <Button onClick={() => onDone({ guest: true })}>Explore without logging in</Button>
            <Button variant="ghost" onClick={signInWithGoogle}>
              <GoogleGlyph size={16} />
              Sign in with Google
            </Button>
            {authError && (
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: 11,
                  color: colors.red,
                  textAlign: 'center',
                  margin: '4px 0 0',
                }}
              >
                {authError}
              </p>
            )}
            <p
              style={{
                fontFamily: fonts.body,
                fontSize: 11,
                color: colors.textDim,
                textAlign: 'center',
                margin: '4px 0 0',
                lineHeight: 1.5,
              }}
            >
              Guest data saves locally. Sign in to sync across devices.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
