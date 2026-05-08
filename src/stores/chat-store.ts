'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, ContentType, MessageRole } from '@/types';
import { newId } from '@/lib/utils';

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  isTyping: boolean;
  addMessage: (role: MessageRole, content: string, content_type?: ContentType, metadata?: Record<string, any>) => ChatMessage;
  appendToLast: (chunk: string) => void;
  setMessageContent: (id: string, content: string) => void;
  updateMessageMetadata: (id: string, patch: Record<string, any>) => void;
  setTyping: (v: boolean) => void;
  setStreaming: (v: boolean) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isStreaming: false,
      isTyping: false,
      addMessage: (role, content, content_type = 'text', metadata = {}) => {
        const msg: ChatMessage = {
          id: newId(),
          user_id: 'local',
          role,
          content,
          content_type,
          metadata,
          created_at: new Date().toISOString(),
        };
        set((s) => ({ messages: [...s.messages, msg] }));
        return msg;
      },
      appendToLast: (chunk) =>
        set((s) => {
          if (s.messages.length === 0) return s;
          const next = [...s.messages];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + chunk };
          return { messages: next };
        }),
      setMessageContent: (id, content) =>
        set((s) => ({
          messages: s.messages.map((m) => (m.id === id ? { ...m, content } : m)),
        })),
      updateMessageMetadata: (id, patch) =>
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === id ? { ...m, metadata: { ...m.metadata, ...patch } } : m,
          ),
        })),
      setTyping: (isTyping) => set({ isTyping }),
      setStreaming: (isStreaming) => set({ isStreaming }),
      reset: () => set({ messages: [], isStreaming: false, isTyping: false }),
    }),
    { name: 'trajectory-chat' },
  ),
);
