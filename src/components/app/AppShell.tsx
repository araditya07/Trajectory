'use client';

import { TabBar } from './TabBar';
import { HabitsTab } from './HabitsTab';
import { GoalsTab } from './GoalsTab';
import { JournalTab } from './JournalTab';
import { TrackTab } from './TrackTab';
import { GuestBanner } from './GuestBanner';
import { useAppStore } from '@/stores/app-store';

export function AppShell() {
  const tab = useAppStore((s) => s.tab);
  const profile = useAppStore((s) => s.profile);
  const isGuest = profile?.is_guest === true;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {isGuest && <GuestBanner />}
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {tab === 'habits' && <HabitsTab />}
        {tab === 'goals' && <GoalsTab />}
        {tab === 'journal' && <JournalTab />}
        {tab === 'track' && <TrackTab />}
      </div>
      <TabBar />
    </div>
  );
}
