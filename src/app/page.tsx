'use client';

import { useEffect, useState } from 'react';
import { Walkthrough } from '@/components/walkthrough/Walkthrough';
import { HabitSetup, type HabitSetupItem } from '@/components/setup/HabitSetup';
import { GoalSetup, type GoalSetupItem } from '@/components/setup/GoalSetup';
import { AppShell } from '@/components/app/AppShell';
import { useAppStore } from '@/stores/app-store';
import { useDataStore } from '@/stores/data-store';
import { colors } from '@/styles/tokens';
import { newId } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const screen = useAppStore((s) => s.screen);
  const setScreen = useAppStore((s) => s.setScreen);
  const setProfile = useAppStore((s) => s.setProfile);
  const profile = useAppStore((s) => s.profile);

  const setHabits = useDataStore((s) => s.setHabits);
  const setGoals = useDataStore((s) => s.setGoals);

  useEffect(() => setMounted(true), []);

  // Detect Supabase session: if user just completed Google OAuth, pull profile
  // and skip past the walkthrough.
  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (cancelled || !data.user) return;
        const u = data.user;
        const existingId = useAppStore.getState().profile?.id;
        if (existingId === u.id) return;
        setProfile({
          id: u.id,
          name: (u.user_metadata?.full_name as string) ?? u.email ?? null,
          avatar_url: (u.user_metadata?.avatar_url as string) ?? null,
          purpose_tags: [],
          purpose_freetext: null,
          onboarding_completed: false,
          timezone: 'UTC',
          is_guest: false,
        });
        if (useAppStore.getState().screen === 'walkthrough') {
          setScreen('setup_habits');
        }
      } catch {
        // No env vars / offline — stay in local mode silently
      }
    })();
    return () => { cancelled = true; };
  }, [mounted, setProfile, setScreen]);

  const onWalkthroughDone = ({ guest }: { guest: boolean }) => {
    setProfile({
      id: newId(),
      name: guest ? 'Guest' : null,
      avatar_url: null,
      purpose_tags: [],
      purpose_freetext: null,
      onboarding_completed: false,
      timezone: 'UTC',
      is_guest: guest,
    });
    setScreen('setup_habits');
  };

  const onHabitsDone = (selected: HabitSetupItem[]) => {
    setHabits(
      selected.map((h) => ({
        id: h.id,
        user_id: profile?.id ?? 'local',
        name: h.name,
        icon: h.icon,
        goal_id: null,
        is_active: true,
        is_preset: !h.custom,
        category: h.category,
      })),
    );
    setScreen('setup_goals');
  };

  const onGoalsDone = (selected: GoalSetupItem[]) => {
    setGoals(
      selected.map((g) => ({
        id: g.id,
        user_id: profile?.id ?? 'local',
        title: g.title,
        category: g.category === 'custom' ? 'personal' : g.category,
        cycle: g.cycle,
        measurable_signal: null,
        target: g.target,
        frequency: 'daily',
        progress_pct: 0,
        status: 'active',
        is_preset: !g.custom,
        started_at: new Date().toISOString(),
        target_date: null,
        icon: g.icon,
      })),
    );
    if (profile) setProfile({ ...profile, onboarding_completed: true });
    setScreen('app');
  };

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: colors.bg }} />;
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: colors.bg,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: colors.bg,
          borderLeft: `1px solid ${colors.border}`,
          borderRight: `1px solid ${colors.border}`,
          overflow: 'hidden',
        }}
      >
        {screen === 'walkthrough' && <Walkthrough onDone={onWalkthroughDone} />}
        {screen === 'setup_habits' && <HabitSetup onNext={onHabitsDone} />}
        {screen === 'setup_goals' && <GoalSetup onNext={onGoalsDone} />}
        {screen === 'app' && <AppShell />}
      </div>
    </main>
  );
}
