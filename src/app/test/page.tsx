'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { questions } from '@/data/questions';
import { dimensionPairs } from '@/data/personality-types';
import QuestionCard from '@/components/test/QuestionCard';
import { calculateResult } from '@/lib/scoring';
import { useTestStore } from '@/store/testStore';

const TOTAL = questions.length;

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [direction, setDirection] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [transitionLocked, setTransitionLocked] = useState(false);
  const initializedRef = useRef(false);

  const {
    session,
    startSession,
    setAnswer,
    next,
    prev,
    goTo,
    completeSession,
  } = useTestStore();

  const urlIndex = searchParams.get('q');

  useEffect(() => {
    if (!initializedRef.current) {
      if (!session) {
        startSession({ forceReset: true });
      }
      initializedRef.current = true;
    }
  }, [session, startSession]);

  useEffect(() => {
    if (!session || !urlIndex) return;

    const parsed = Number(urlIndex);
    const answeredCount = Object.keys(session.answers).length;
    const lastReachableIndex = Math.min(answeredCount, TOTAL - 1);

    if (Number.isNaN(parsed) || parsed < 0 || parsed > lastReachableIndex) return;
    if (parsed !== session.currentIndex) goTo(parsed);
  }, [goTo, session, urlIndex]);

  function syncIndex(index: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', String(index));
    router.replace(`/test?${params.toString()}`, { scroll: false });
  }

  if (!session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--bg-paper)]">
        <Loader2 className="w-5 h-5 text-[var(--text-muted)] animate-spin" />
      </div>
    );
  }

  const activeSession = session;
  const currentQuestion = questions[activeSession.currentIndex];
  const axisMeta = dimensionPairs.find((item) => item.axis === currentQuestion.dimension);
  const selectedKey = activeSession.answers[currentQuestion.id] ?? null;
  const answeredCount = Object.keys(activeSession.answers).length;
  const isFirst = activeSession.currentIndex === 0;
  const isLast = activeSession.currentIndex === TOTAL - 1;
  const progress = Math.round((answeredCount / TOTAL) * 100);

  function handleSelect(optionKey: string) {
    if (transitionLocked) return;

    const nextAnswers = {
      ...activeSession.answers,
      [currentQuestion.id]: optionKey,
    };

    setTransitionLocked(true);
    setAnswer(currentQuestion.id, optionKey);

    if (!isLast) {
      window.setTimeout(() => {
        setDirection(1);
        next();
        syncIndex(activeSession.currentIndex + 1);
        setTransitionLocked(false);
      }, 250);
      return;
    }

    window.setTimeout(() => {
      setIsComplete(true);
      const result = calculateResult(nextAnswers);
      completeSession(result);
      router.push('/result');
    }, 300);
  }

  function handlePrev() {
    if (isFirst || transitionLocked) return;
    setDirection(-1);
    prev();
    syncIndex(activeSession.currentIndex - 1);
  }

  if (isComplete) {
    return (
      <div className="flex min-h-dvh items-center justify-center flex-col gap-3 bg-[var(--bg-paper)]">
        <Loader2 className="w-6 h-6 text-[var(--text-primary)] animate-spin" />
        <p className="text-sm text-[var(--text-muted)]">正在生成报告…</p>
      </div>
    );
  }

  return (
    <main className="min-h-dvh bg-[var(--bg-paper)] flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[var(--border-light)]">
        <div className="mx-auto max-w-lg flex items-center justify-between px-5 py-3">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-[var(--text-muted)] tabular-nums">{answeredCount}/{TOTAL}</span>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-[var(--border-light)]">
          <div
            className="h-full bg-[var(--text-primary)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Question area */}
      <div className="flex-1 mx-auto w-full max-w-lg px-5 py-6 flex flex-col justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={activeSession.currentIndex + 1}
            total={TOTAL}
            axisLabel={axisMeta?.label ?? '维度'}
            axisHint={axisMeta ? `${axisMeta.labelA} vs ${axisMeta.labelB}` : ''}
            selectedKey={selectedKey}
            isLocked={transitionLocked}
            onSelect={handleSelect}
            direction={direction}
          />
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      {!isFirst && (
        <div className="mx-auto max-w-lg w-full px-5 pb-6" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> 上一题
          </button>
        </div>
      )}
    </main>
  );
}

export default function TestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[var(--bg-paper)]">
          <Loader2 className="w-5 h-5 text-[var(--text-muted)] animate-spin" />
        </div>
      }
    >
      <TestContent />
    </Suspense>
  );
}
