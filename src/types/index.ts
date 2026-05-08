export interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  purpose_tags: string[];
  purpose_freetext: string | null;
  onboarding_completed: boolean;
  timezone: string;
  is_guest: boolean;
}

export type GoalCategory = 'professional' | 'personal' | 'health' | 'learning' | 'wellness';
export type GoalCycle = '7-day' | '30-day' | '90-day' | 'annual';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'abandoned';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  category: GoalCategory;
  cycle: GoalCycle;
  measurable_signal: string | null;
  target: string | null;
  frequency: string;
  progress_pct: number;
  status: GoalStatus;
  is_preset: boolean;
  started_at: string;
  target_date: string | null;
  icon?: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  goal_id: string | null;
  is_active: boolean;
  is_preset: boolean;
  category?: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  logged_date: string;
  completed: boolean;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  mood_score: number | null;
  mood_label: string | null;
  habits_snapshot: Record<string, boolean> | null;
  embedding_id: string | null;
  entry_date: string;
  day_number: number;
}

export interface GoalBreakdown {
  goal_id: string;
  title: string;
  progress_pct: number;
  status: string;
  delta: string;
  comment: string;
}

export interface LensResult {
  name: string;
  weight: number;
  method: string;
  data_source: string;
  verdict: string;
  score: number;
  color: string;
}

export interface ActionItem {
  priority: 'high' | 'medium' | 'low';
  action: string;
  goal_ref: string;
}

export interface FeedbackReport {
  id: string;
  user_id: string;
  report_type: 'daily' | 'weekly' | 'milestone';
  summary: string;
  overall_score: number;
  goal_breakdowns: GoalBreakdown[];
  decision_architecture: LensResult[];
  improvement_plan: ActionItem[];
  report_date: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';
export type ContentType =
  | 'text'
  | 'habit_checkin'
  | 'mood_select'
  | 'insight'
  | 'progress'
  | 'weekly_summary'
  | 'goal_prompt'
  | 'goal_confirm'
  | 'decision_arch';

export interface ChatMessage {
  id: string;
  user_id: string;
  role: MessageRole;
  content: string;
  content_type: ContentType;
  metadata: Record<string, any>;
  created_at: string;
}

export interface RAGContext {
  similar_entries: JournalEntry[];
  goals: Goal[];
  habit_summary: {
    today: Record<string, boolean>;
    week: Record<string, number>;
    consistency_pct: number;
  };
  mood_trend: number[];
  streak: number;
  day_number: number;
  user_purpose: string;
}

export type AppScreen = 'walkthrough' | 'setup_habits' | 'setup_goals' | 'app';
export type AppTab = 'habits' | 'goals' | 'journal' | 'track';

export type IconName =
  | 'goal' | 'habit' | 'chat' | 'today' | 'you' | 'pattern'
  | 'send' | 'check' | 'cycle' | 'bell' | 'review' | 'spark';
