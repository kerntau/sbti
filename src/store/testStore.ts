import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { questions, specialQuestions } from '@/data/questions';
import { ParticipantProfile, Question, TestResult, TestSession } from '@/types';

const MAX_HISTORY = 5;

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface TestStore {
  hasHydrated: boolean;
  session: TestSession | null;
  history: TestResult[];
  shuffledQuestions: Question[];
  startSession: (options?: { forceReset?: boolean; profile?: ParticipantProfile | null }) => void;
  setAnswer: (questionId: string, value: number) => void;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  completeSession: (result: TestResult) => void;
  resetSession: () => void;
  clearHistory: () => void;
  getVisibleQuestions: () => Question[];
}

function buildShuffledQuestions(): Question[] {
  const shuffledRegular = shuffle(questions);
  const insertIndex = Math.floor(Math.random() * shuffledRegular.length) + 1;
  return [
    ...shuffledRegular.slice(0, insertIndex),
    specialQuestions[0], // drink_gate_q1
    ...shuffledRegular.slice(insertIndex),
  ];
}

export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      session: null,
      history: [],
      shuffledQuestions: [],

      startSession: (options = {}) => {
        const { forceReset = false, profile = null } = options;
        const current = get().session;

        if (current && !forceReset) return;

        set({
          shuffledQuestions: buildShuffledQuestions(),
          session: {
            answers: {},
            currentIndex: 0,
            startTime: Date.now(),
            completed: false,
            profile,
          },
        });
      },

      setAnswer: (questionId, value) => {
        const { session } = get();
        if (!session) return;

        const newAnswers: Record<string, number> = { ...session.answers, [questionId]: value };

        // 如果选了饮酒门控题但不是"饮酒"，清除触发题的答案
        if (questionId === 'drink_gate_q1' && value !== 3) {
          delete newAnswers['drink_gate_q2'];
        }

        set({
          session: {
            ...session,
            answers: newAnswers,
          },
        });
      },

      getVisibleQuestions: () => {
        const { shuffledQuestions, session } = get();
        if (!session) return shuffledQuestions;

        const visible = [...shuffledQuestions];
        const gateIndex = visible.findIndex((q) => q.id === 'drink_gate_q1');
        if (gateIndex !== -1 && session.answers['drink_gate_q1'] === 3) {
          // 在饮酒门控题后插入触发题
          visible.splice(gateIndex + 1, 0, specialQuestions[1]);
        }
        return visible;
      },

      goTo: (index) => {
        const { session } = get();
        if (!session) return;

        const visibleQuestions = get().getVisibleQuestions();
        const nextIndex = Math.max(0, Math.min(index, visibleQuestions.length - 1));
        set({
          session: {
            ...session,
            currentIndex: nextIndex,
          },
        });
      },

      next: () => {
        const { session } = get();
        if (!session) return;

        const visibleQuestions = get().getVisibleQuestions();
        set({
          session: {
            ...session,
            currentIndex: Math.min(session.currentIndex + 1, visibleQuestions.length - 1),
          },
        });
      },

      prev: () => {
        const { session } = get();
        if (!session) return;

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
        set({ session: null, shuffledQuestions: [] });
      },

      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: 'imsb-history',
      partialize: (state) => ({
        history: state.history,
      }),
      onRehydrateStorage: () => () => {
        useTestStore.setState({ hasHydrated: true });
      },
    }
  )
);
