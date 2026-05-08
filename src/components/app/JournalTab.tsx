'use client';

import { useEffect, useRef } from 'react';
import { TextBubble, InsightBubble } from '@/components/chat/ChatBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { InputBar } from '@/components/chat/InputBar';
import { colors, fonts } from '@/styles/tokens';
import { useChatStore } from '@/stores/chat-store';
import { useDataStore } from '@/stores/data-store';
import { todayKey } from '@/lib/utils';

async function streamFromApi(message: string, onChunk: (text: string) => void) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
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
  const addEntry = useDataStore((s) => s.addEntry);

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
    if (text.length > 12) {
      const today = todayKey();
      const snap: Record<string, boolean> = {};
      const dayLogs = habitLogs[today] || {};
      habits.forEach((h) => (snap[h.id] = !!dayLogs[h.id]));
      addEntry({
        content: text,
        mood_score: null,
        mood_label: null,
        habits_snapshot: snap,
        embedding_id: null,
      });
    }

    setTyping(true);
    // Placeholder assistant message we'll stream into
    const placeholder = addMessage('assistant', '');
    setStreaming(true);
    let started = false;

    await streamFromApi(text, (chunk) => {
      if (!started) {
        setTyping(false);
        started = true;
      }
      appendToLast(chunk);
    });

    setStreaming(false);
    setTyping(false);

    // Fallback if nothing streamed
    if (!placeholder.content && !started) {
      appendToLast(
        "I'm running in offline mode right now. Add an ANTHROPIC_API_KEY to enable real-time AI responses.",
      );
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
