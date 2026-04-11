import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { questions } from '@/data/questions';
import { ParticipantProfile, TestResult, TestSession } from '@/types';

const MAX_HISTORY = 5;

interface TestStore {
  hasHydrated: boolean;
  session: TestSession | null;
  history: TestResult[];
  startSession: (options?: { forceReset?: boolean; profile?: ParticipantProfile | null }) => void;
  setAnswer: (questionId: string, optionKey: string) => void;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  completeSession: (result: TestResult) => void;
  resetSession: () => void;
  clearHistory: () => void;
}

export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      session: null,
      history: [],

      startSession: (options = {}) => {
        const { forceReset = false, profile = null } = options;
        const current = get().session;

        if (current && !forceReset) {
          return;
        }

        set({
          session: {
            answers: {},
            currentIndex: 0,
            startTime: Date.now(),
            completed: false,
            profile,
          },
        });
      },

      setAnswer: (questionId, optionKey) => {
        const { session } = get();
        if (!session) {
          return;
        }

        set({
          session: {
            ...session,
            answers: {
              ...session.answers,
              [questionId]: optionKey,
            },
          },
        });
      },

      goTo: (index) => {
        const { session } = get();
        if (!session) {
          return;
        }

        const nextIndex = Math.max(0, Math.min(index, questions.length - 1));
        set({
          session: {
            ...session,
            currentIndex: nextIndex,
          },
        });
      },

      next: () => {
        const { session } = get();
        if (!session) {
          return;
        }

        set({
          session: {
            ...session,
            currentIndex: Math.min(session.currentIndex + 1, questions.length - 1),
          },
        });
      },

      prev: () => {
        const { session } = get();
        if (!session) {
          return;
        }

        set({
          session: {
            ...session,
            currentIndex: Math.max(0, session.currentIndex - 1),
          },
        });
      },

      completeSession: (result) => {
        const { history, session } = get();
        const finishedAt = Date.now();
        const finalizedResult: TestResult = {
          ...result,
          completedAt: finishedAt,
          durationMs: session ? Math.max(0, finishedAt - session.startTime) : result.durationMs,
          profile: session?.profile ?? result.profile,
        };

        set({
          session: null,
          history: [finalizedResult, ...history].slice(0, MAX_HISTORY),
        });
      },

      resetSession: () => {
        set({ session: null });
      },

      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: 'sbti-history',
      partialize: (state) => ({
        history: state.history,
      }),
      onRehydrateStorage: () => () => {
        useTestStore.setState({ hasHydrated: true });
      },
    }
  )
);
