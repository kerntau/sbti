'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { questions } from '@/data/questions';
import { dimensionPairs } from '@/data/personality-types';
import QuestionCard from '@/components/test/QuestionCard';
import ProgressBar from '@/components/test/ProgressBar';
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
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(100%_100%_at_50%_0%,rgba(219,234,254,0.6)_0%,rgba(248,250,252,1)_100%)]">
        <div className="glass-card rounded-full px-5 py-3 text-sm font-semibold text-slate-700">
          正在进入测试...
        </div>
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
  const lastReachableIndex = Math.min(answeredCount, TOTAL - 1);

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
      }, 120);
      return;
    }

    window.setTimeout(() => {
      setIsComplete(true);
      const result = calculateResult(nextAnswers);
      completeSession(result);
      router.push('/result');
    }, 180);
  }

  function handlePrev() {
    if (isFirst || transitionLocked) return;
    setDirection(-1);
    prev();
    syncIndex(activeSession.currentIndex - 1);
  }

  function handleDotClick(index: number) {
    if (transitionLocked || index > lastReachableIndex || index === activeSession.currentIndex) return;
    setDirection(index > activeSession.currentIndex ? 1 : -1);
    goTo(index);
    syncIndex(index);
  }

  const answeredIds = new Set(Object.keys(activeSession.answers));

  if (isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(100%_100%_at_50%_0%,rgba(219,234,254,0.6)_0%,rgba(248,250,252,1)_100%)]">
        <div className="glass-card rounded-[2rem] px-8 py-7 text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-blue-500/20" />
          <p className="mt-4 text-lg font-semibold text-slate-800">正在整理你的结果...</p>
          <p className="mt-1 text-sm text-slate-500">马上就好</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(100%_100%_at_50%_0%,rgba(219,234,254,0.7)_0%,rgba(248,250,252,1)_55%)]">
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-40" />
      <header className="sticky top-0 z-20 border-b border-white/50 bg-white/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </button>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">SBTI Test</p>
            <p className="text-sm text-slate-600">按第一反应作答，结果会更接近你</p>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-8">
        <ProgressBar current={activeSession.currentIndex} total={TOTAL} answered={answeredCount} />

        <div className="glass-card mt-6 rounded-[1.75rem] px-5 py-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">每次进入都会开启新的测试</p>
              <p className="mt-1 text-sm text-slate-500">可以回看已答题，也可以继续下一题，但不会继承上一次访客的答题进度。</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {questions.map((question, index) => {
                const answered = answeredIds.has(question.id);
                const current = index === activeSession.currentIndex;

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => handleDotClick(index)}
                    disabled={index > lastReachableIndex}
                    className={`h-2.5 rounded-full transition-all duration-200 ${
                      current
                        ? 'w-8 bg-blue-600'
                        : answered
                          ? 'w-2.5 bg-blue-200 hover:bg-blue-300'
                          : index <= lastReachableIndex
                            ? 'w-2.5 bg-slate-300 hover:bg-slate-400'
                            : 'w-2.5 bg-slate-200 opacity-50'
                    }`}
                    aria-label={`跳转到第 ${index + 1} 题`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 min-h-[520px]">
          <AnimatePresence mode="wait" custom={direction}>
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={activeSession.currentIndex + 1}
              total={TOTAL}
              axisLabel={axisMeta?.label ?? '人格维度'}
              axisHint={axisMeta ? `${axisMeta.labelA} vs ${axisMeta.labelB}` : '双向选择'}
              selectedKey={selectedKey}
              isLocked={transitionLocked}
              onSelect={handleSelect}
              direction={direction}
            />
          </AnimatePresence>
        </div>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
              isFirst
                ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                : 'glass-card text-slate-700 hover:-translate-y-0.5'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            上一题
          </button>

          <div className="glass-card rounded-full px-5 py-3 text-sm font-semibold text-slate-600">
            已完成 {answeredCount} / {TOTAL}
          </div>
        </footer>
      </div>
    </main>
  );
}

export default function TestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(100%_100%_at_50%_0%,rgba(219,234,254,0.6)_0%,rgba(248,250,252,1)_100%)] text-slate-600">
          加载中...
        </div>
      }
    >
      <TestContent />
    </Suspense>
  );
}
