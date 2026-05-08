'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppScreen, AppTab, Profile } from '@/types';

interface AppState {
  screen: AppScreen;
  tab: AppTab;
  profile: Profile | null;
  setScreen: (s: AppScreen) => void;
  setTab: (t: AppTab) => void;
  setProfile: (p: Profile | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      screen: 'walkthrough',
      tab: 'journal',
      profile: null,
      setScreen: (screen) => set({ screen }),
      setTab: (tab) => set({ tab }),
      setProfile: (profile) => set({ profile }),
      reset: () => set({ screen: 'walkthrough', tab: 'journal', profile: null }),
    }),
    { name: 'trajectory-app' },
  ),
);
