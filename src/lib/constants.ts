import type { IconName } from '@/types';

export const PRESET_HABITS: ReadonlyArray<{
  id: string;
  name: string;
  icon: IconName;
  category: string;
  recommended?: boolean;
}> = [
  { id: 'h1',  name: 'Morning meditation',     icon: 'spark',   category: 'wellness',  recommended: true },
  { id: 'h2',  name: 'Exercise 30 min',        icon: 'goal',    category: 'health',    recommended: true },
  { id: 'h3',  name: 'Read 20 pages',          icon: 'review',  category: 'learning',  recommended: true },
  { id: 'h4',  name: 'Drink 8 glasses water',  icon: 'cycle',   category: 'health' },
  { id: 'h5',  name: 'Journal before bed',     icon: 'chat',    category: 'wellness',  recommended: true },
  { id: 'h6',  name: 'No phone first hour',    icon: 'bell',    category: 'wellness' },
  { id: 'h7',  name: 'Sleep by 11 PM',         icon: 'today',   category: 'health' },
  { id: 'h8',  name: 'Practice a skill',       icon: 'pattern', category: 'learning' },
  { id: 'h9',  name: 'Cook a meal',            icon: 'habit',   category: 'health' },
  { id: 'h10', name: 'Walk 10,000 steps',      icon: 'goal',    category: 'health' },
];

export const PRESET_GOALS: ReadonlyArray<{
  id: string;
  title: string;
  icon: IconName;
  category: 'professional' | 'personal' | 'health' | 'learning' | 'wellness';
  cycle: '7-day' | '30-day' | '90-day' | 'annual';
  signal: string;
  target: string;
}> = [
  { id: 'g1', title: 'Get physically fit',      icon: 'goal',    category: 'health',       cycle: '90-day', signal: 'Workouts per week', target: '4/week' },
  { id: 'g2', title: 'Build a side project',    icon: 'spark',   category: 'professional', cycle: '90-day', signal: 'Commits pushed',    target: '5/week' },
  { id: 'g3', title: 'Read 2 books/month',      icon: 'review',  category: 'learning',     cycle: '30-day', signal: 'Pages read',        target: '40/day' },
  { id: 'g4', title: 'Learn a new language',    icon: 'chat',    category: 'learning',     cycle: '90-day', signal: 'Lessons completed', target: '1/day' },
  { id: 'g5', title: 'Improve mental clarity',  icon: 'pattern', category: 'wellness',     cycle: '30-day', signal: 'Meditation sessions', target: 'Daily' },
  { id: 'g6', title: 'Save money consistently', icon: 'cycle',   category: 'personal',     cycle: '90-day', signal: 'Amount saved',      target: 'Weekly deposit' },
];

export const GOAL_CATEGORIES = ['professional', 'personal', 'health', 'learning', 'wellness'] as const;
export const GOAL_CYCLES = ['7-day', '30-day', '90-day', 'annual'] as const;
export const CHECK_FREQUENCIES = ['daily', '3x/week', 'weekly'] as const;

export const MOODS = [
  { score: 1, emoji: '😤', label: 'Frustrated' },
  { score: 2, emoji: '😐', label: 'Meh' },
  { score: 3, emoji: '🙂', label: 'Okay' },
  { score: 4, emoji: '😊', label: 'Good' },
  { score: 5, emoji: '🔥', label: 'On fire' },
] as const;

export const QUICK_ACTIONS = [
  'How am I doing?',
  'Check habits',
  'Update goals',
  'Weekly report',
] as const;
