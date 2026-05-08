// Parses ```json action blocks from an AI response and dispatches them
// to the data store. Returns the cleaned text + a list of summaries for
// inline confirmation chips in the chat bubble.

import { useDataStore } from '@/stores/data-store';
import type { GoalCategory, GoalCycle, IconName } from '@/types';

const VALID_CATEGORIES: GoalCategory[] = ['professional', 'personal', 'health', 'learning', 'wellness'];
const VALID_CYCLES: GoalCycle[] = ['7-day', '30-day', '90-day', 'annual'];
const VALID_ICONS: IconName[] = [
  'goal', 'habit', 'chat', 'today', 'you', 'pattern',
  'send', 'check', 'cycle', 'bell', 'review', 'spark',
];

export type Action =
  | { action: 'add_goal'; title: string; category?: string; cycle?: string; target?: string }
  | { action: 'modify_goal'; id: string; patch: Record<string, any> }
  | { action: 'remove_goal'; id: string }
  | { action: 'add_habit'; name: string; icon?: string }
  | { action: 'remove_habit'; id: string };

export interface ParseResult {
  cleanedText: string;
  actions: Action[];
}

const FENCE_RE = /```json\s*([\s\S]*?)```/gi;

export function extractActions(text: string): ParseResult {
  const actions: Action[] = [];
  const cleaned = text.replace(FENCE_RE, (_, body: string) => {
    const candidates = splitJsonObjects(body.trim());
    for (const candidate of candidates) {
      try {
        const parsed = JSON.parse(candidate);
        if (parsed && typeof parsed === 'object' && typeof parsed.action === 'string') {
          actions.push(parsed as Action);
        }
      } catch {
        // ignore malformed
      }
    }
    return '';
  }).trim();
  return { cleanedText: cleaned, actions };
}

// Allow multiple JSON objects in one fenced block, separated by blank lines
function splitJsonObjects(text: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = -1;
  let inStr = false;
  let escape = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (escape) escape = false;
      else if (ch === '\\') escape = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        out.push(text.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return out;
}

export function applyActions(actions: Action[]): string[] {
  const summaries: string[] = [];
  const store = useDataStore.getState();

  for (const a of actions) {
    try {
      switch (a.action) {
        case 'add_goal': {
          const category = (VALID_CATEGORIES as string[]).includes(a.category ?? '')
            ? (a.category as GoalCategory)
            : 'personal';
          const cycle = (VALID_CYCLES as string[]).includes(a.cycle ?? '')
            ? (a.cycle as GoalCycle)
            : '30-day';
          if (!a.title) break;
          store.addGoal({
            title: a.title,
            category,
            cycle,
            target: a.target ?? null,
            icon: 'spark',
          });
          summaries.push(`Added goal: ${a.title}`);
          break;
        }
        case 'modify_goal': {
          if (!a.id || !a.patch) break;
          const exists = store.goals.find((g) => g.id === a.id);
          if (!exists) break;
          store.updateGoal(a.id, a.patch);
          summaries.push(`Updated goal: ${exists.title}`);
          break;
        }
        case 'remove_goal': {
          if (!a.id) break;
          const exists = store.goals.find((g) => g.id === a.id);
          if (!exists) break;
          store.removeGoal(a.id);
          summaries.push(`Removed goal: ${exists.title}`);
          break;
        }
        case 'add_habit': {
          if (!a.name) break;
          const icon = (VALID_ICONS as string[]).includes(a.icon ?? '') ? a.icon! : 'spark';
          store.addHabit(a.name, icon, false);
          summaries.push(`Added habit: ${a.name}`);
          break;
        }
        case 'remove_habit': {
          if (!a.id) break;
          const exists = store.habits.find((h) => h.id === a.id);
          if (!exists) break;
          store.removeHabit(a.id);
          summaries.push(`Removed habit: ${exists.name}`);
          break;
        }
      }
    } catch {
      // Skip individual action failures
    }
  }

  return summaries;
}
