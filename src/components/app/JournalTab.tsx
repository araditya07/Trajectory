'use client';

import { useEffect, useRef } from 'react';
import { TextBubble, InsightBubble } from '@/components/chat/ChatBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { InputBar } from '@/components/chat/InputBar';
import { colors, fonts } from '@/styles/tokens';
import { useChatStore } from '@/stores/chat-store';
import { useDataStore } from '@/stores/data-store';
import { useAppStore } from '@/stores/app-store';
import { todayKey } from '@/lib/utils';

async function streamFromApi(payload: object, onChunk: (text: string) => void) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok || !res.body) {
      onChunk(`Sorry — I couldn't reach the AI service. (${res.status})`);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value, { stream: true }));
    }
  } catch (err) {
    onChunk(`Sorry — I couldn't reach the AI service.`);
  }
}

async function embedEntry(payload: { userId: string; entryId: string; content: string; metadata?: Record<string, any> }) {
  try {
    await fetch('/api/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silent — embedding is best-effort
  }
}

export function JournalTab() {
  const messages = useChatStore((s) => s.messages);
  const isTyping = useChatStore((s) => s.isTyping);
  const addMessage = useChatStore((s) => s.addMessage);
  const appendToLast = useChatStore((s) => s.appendToLast);
  const setTyping = useChatStore((s) => s.setTyping);
  const setStreaming = useChatStore((s) => s.setStreaming);

  const habits = useDataStore((s) => s.habits);
  const habitLogs = useDataStore((s) => s.habitLogs);
  const goals = useDataStore((s) => s.goals);
  const entries = useDataStore((s) => s.entries);
  const addEntry = useDataStore((s) => s.addEntry);
  const profile = useAppStore((s) => s.profile);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new content
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  // First-visit greeting
  useEffect(() => {
    if (messages.length > 0) return;
    const firstName = goals[0]?.title ? `your goals (${goals[0].title})` : 'your goals';
    const greeting = goals.length
      ? `Welcome to Trajectory. I'm here to help you stay honest about ${firstName}. Tell me — how did today go?`
      : `Welcome to Trajectory. I'm your journal companion. Share what's on your mind and I'll start to learn your patterns.`;
    addMessage('assistant', greeting);
  }, [messages.length, goals, addMessage]);

  const send = async (text: string) => {
    addMessage('user', text);

    // Save substantive entries
    let savedEntryId: string | null = null;
    if (text.length > 12) {
      const today = todayKey();
      const snap: Record<string, boolean> = {};
      const dayLogs = habitLogs[today] || {};
      habits.forEach((h) => (snap[h.id] = !!dayLogs[h.id]));
      const e = addEntry({
        content: text,
        mood_score: null,
        mood_label: null,
        habits_snapshot: snap,
        embedding_id: null,
      });
      savedEntryId = e.id;
    }

    // Build context payload for the API. RAG retrieval happens server-side.
    const userId = profile?.id ?? 'local';
    const payload = {
      message: text,
      userId,
      goals,
      recentEntries: entries.slice(-10),
      habitSummary: { today: {}, week: {}, consistency_pct: 0 },
      moodTrend: entries.slice(-7).map((e) => e.mood_score ?? 0),
      streak: 0,
      dayNumber: entries.length || 1,
      userPurpose: profile?.purpose_freetext ?? '',
      history: useChatStore.getState().messages.slice(-20).map((m) => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: m.content,
      })),
    };

    setTyping(true);
    addMessage('assistant', '');
    setStreaming(true);
    let started = false;

    await streamFromApi(payload, (chunk) => {
      if (!started) {
        setTyping(false);
        started = true;
      }
      appendToLast(chunk);
    });

    setStreaming(false);
    setTyping(false);

    // After the response, embed the entry asynchronously
    if (savedEntryId && text.length > 12) {
      void embedEntry({
        userId,
        entryId: savedEntryId,
        content: text,
        metadata: { entry_date: todayKey(), day_number: entries.length + 1 },
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div
        style={{
          padding: '14px 22px 6px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
      >
        <h1
          style={{
            fontFamily: fonts.display,
            fontSize: 18,
            fontWeight: 400,
            color: colors.text,
            margin: 0,
          }}
        >
          Journal
        </h1>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: colors.textMid,
          }}
        >
          Day {Math.max(1, useDataStore.getState().entries.length || 1)}
        </span>
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px 16px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {messages.map((m) =>
          m.content_type === 'insight' ? (
            <InsightBubble key={m.id} text={m.content} tag={m.metadata?.tag} />
          ) : (
            <TextBubble key={m.id} msg={m} />
          ),
        )}
        {isTyping && <TypingIndicator />}
      </div>

      <InputBar onSend={send} />
    </div>
  );
}
