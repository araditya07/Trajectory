-- Trajectory initial schema
-- Run after creating a Supabase project. Includes RLS policies for user isolation.

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  avatar_url text,
  purpose_tags text[] default '{}',
  purpose_freetext text,
  onboarding_completed boolean default false,
  timezone text default 'Asia/Kolkata',
  is_guest boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- GOALS
create type goal_category as enum ('professional', 'personal', 'health', 'learning', 'wellness');
create type goal_cycle as enum ('7-day', '30-day', '90-day', 'annual');
create type goal_status as enum ('active', 'completed', 'paused', 'abandoned');

create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  category goal_category not null,
  cycle goal_cycle not null,
  measurable_signal text,
  target text,
  frequency text default 'daily',
  progress_pct numeric default 0,
  status goal_status default 'active',
  is_preset boolean default false,
  started_at timestamptz default now(),
  target_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- HABITS
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  icon text default '✅',
  goal_id uuid references public.goals(id) on delete set null,
  is_active boolean default true,
  is_preset boolean default false,
  created_at timestamptz default now()
);

create table public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  habit_id uuid references public.habits(id) on delete cascade not null,
  logged_date date not null,
  completed boolean default false,
  created_at timestamptz default now(),
  unique(habit_id, logged_date)
);

-- JOURNAL ENTRIES
create table public.journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  mood_score int check (mood_score between 1 and 5),
  mood_label text,
  habits_snapshot jsonb,
  embedding_id text,
  entry_date date default current_date,
  day_number int,
  created_at timestamptz default now()
);

-- AI FEEDBACK REPORTS
create table public.feedback_reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  report_type text default 'daily',
  summary text not null,
  overall_score numeric,
  goal_breakdowns jsonb,
  decision_architecture jsonb,
  improvement_plan jsonb,
  retrieved_entry_ids uuid[],
  context_tokens_used int,
  report_date date default current_date,
  created_at timestamptz default now()
);

-- CHAT MESSAGES
create type msg_role as enum ('user', 'assistant', 'system');
create type msg_content_type as enum (
  'text', 'habit_checkin', 'mood_select', 'insight',
  'progress', 'weekly_summary', 'goal_prompt',
  'goal_confirm', 'decision_arch'
);

create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role msg_role not null,
  content text not null,
  content_type msg_content_type default 'text',
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- INDEXES
create index idx_journal_user_date on public.journal_entries(user_id, entry_date desc);
create index idx_habit_logs_user_date on public.habit_logs(user_id, logged_date desc);
create index idx_chat_user_created on public.chat_messages(user_id, created_at desc);
create index idx_goals_user_status on public.goals(user_id, status);
create index idx_feedback_user_date on public.feedback_reports(user_id, report_date desc);

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.journal_entries enable row level security;
alter table public.feedback_reports enable row level security;
alter table public.chat_messages enable row level security;

create policy "own_data" on public.profiles for all using (auth.uid() = id);
create policy "own_data" on public.goals for all using (auth.uid() = user_id);
create policy "own_data" on public.habits for all using (auth.uid() = user_id);
create policy "own_data" on public.habit_logs for all using (auth.uid() = user_id);
create policy "own_data" on public.journal_entries for all using (auth.uid() = user_id);
create policy "own_data" on public.feedback_reports for all using (auth.uid() = user_id);
create policy "own_data" on public.chat_messages for all using (auth.uid() = user_id);
