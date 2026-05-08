'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Goal, Habit, JournalEntry, FeedbackReport } from '@/types';
import { todayKey, newId } from '@/lib/utils';

interface DataState {
  habits: Habit[];
  habitLogs: Record<string, Record<string, boolean>>;
  goals: Goal[];
  entries: JournalEntry[];
  reports: FeedbackReport[];

  setHabits: (h: Habit[]) => void;
  addHabit: (name: string, icon: string, isPreset?: boolean) => void;
  removeHabit: (id: string) => void;
  toggleHabitLog: (habitId: string, date?: string) => void;
  isHabitDone: (habitId: string, date?: string) => boolean;

  setGoals: (g: Goal[]) => void;
  addGoal: (g: Pick<Goal, 'title' | 'category' | 'cycle'> & Partial<Pick<Goal, 'measurable_signal' | 'target' | 'frequency' | 'is_preset' | 'icon'>>) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  removeGoal: (id: string) => void;

  addEntry: (entry: Omit<JournalEntry, 'id' | 'user_id' | 'entry_date' | 'day_number'>) => JournalEntry;
  addReport: (report: FeedbackReport) => void;

  reset: () => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      habits: [],
      habitLogs: {},
      goals: [],
      entries: [],
      reports: [],

      setHabits: (habits) => set({ habits }),
      addHabit: (name, icon, isPreset = false) =>
        set((s) => ({
          habits: [
            ...s.habits,
            {
              id: newId(),
              user_id: 'local',
              name,
              icon,
              goal_id: null,
              is_active: true,
              is_preset: isPreset,
            },
          ],
        })),
      removeHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),
      toggleHabitLog: (habitId, date) =>
        set((s) => {
          const d = date || todayKey();
          const day = { ...(s.habitLogs[d] || {}) };
          day[habitId] = !day[habitId];
          return { habitLogs: { ...s.habitLogs, [d]: day } };
        }),
      isHabitDone: (habitId, date) => {
        const d = date || todayKey();
        return !!get().habitLogs[d]?.[habitId];
      },

      setGoals: (goals) => set({ goals }),
      addGoal: (g) =>
        set((s) => ({
          goals: [
            ...s.goals,
            {
              id: newId(),
              user_id: 'local',
              title: g.title,
              category: g.category,
              cycle: g.cycle,
              measurable_signal: g.measurable_signal ?? null,
              target: g.target ?? null,
              frequency: g.frequency ?? 'daily',
              progress_pct: 0,
              status: 'active' as const,
              is_preset: g.is_preset ?? false,
              started_at: new Date().toISOString(),
              target_date: null,
              icon: g.icon,
            },
          ],
        })),
      updateGoal: (id, patch) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
      removeGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      addEntry: (entry) => {
        const e: JournalEntry = {
          id: newId(),
          user_id: 'local',
          content: entry.content,
          mood_score: entry.mood_score,
          mood_label: entry.mood_label,
          habits_snapshot: entry.habits_snapshot,
          embedding_id: entry.embedding_id,
          entry_date: todayKey(),
          day_number: get().entries.length + 1,
        };
        set((s) => ({ entries: [...s.entries, e] }));
        return e;
      },

      addReport: (report) => set((s) => ({ reports: [...s.reports, report] })),

      reset: () =>
        set({ habits: [], habitLogs: {}, goals: [], entries: [], reports: [] }),
    }),
    { name: 'trajectory-data' },
  ),
);
