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
      <div className="flex min-h-screen items-center justify-center star-grid relative bg-[#050508]">
        <div className="tarot-card rounded-sm px-5 py-3 text-xs font-serif text-[var(--text-gold)] tracking-widest uppercase">
          ✧ 占星阵列展开中 ✧
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
      }, 400); // 增加延迟等待完美动画
      return;
    }

    window.setTimeout(() => {
      setIsComplete(true);
      const result = calculateResult(nextAnswers);
      completeSession(result);
      router.push('/result');
    }, 450);
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
      <div className="flex min-h-screen items-center justify-center star-grid relative bg-[#050508]">
        <div className="tarot-card rounded-sm px-10 py-10 text-center flex flex-col items-center">
          <div className="h-10 w-10 border border-[var(--line-gold)] transform rotate-45 flex items-center justify-center mb-6 animate-pulse shadow-[0_0_20px_rgba(206,170,123,0.3)]">
            <span className="text-xl text-[var(--text-gold)] transform -rotate-45 block">✦</span>
          </div>
          <p className="mt-4 text-base font-serif tracking-widest text-[var(--text-main)]">正在铭刻本命印记...</p>
          <p className="mt-2 text-[10px] tracking-[0.3em] text-[var(--text-muted)] uppercase">Destiny awaits</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden star-grid relative">
      <header className="sticky top-0 z-20 border-b border-[var(--line-gold)] border-opacity-20 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="ghost-btn px-4 py-2 text-[10px]"
          >
             返回界外
          </button>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-gold)]">The Tarot Matrix</p>
            <p className="text-[10px] text-[var(--text-muted)] tracking-widest mt-1 opacity-70">随心所引，皆定数</p>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-5xl px-4 md:px-8 pb-12 pt-8">
        <ProgressBar current={activeSession.currentIndex} total={TOTAL} answered={answeredCount} />

        <div className="tarot-card mt-10 p-5 md:p-6 mb-10 overflow-visible">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs tracking-widest text-[var(--text-gold)] font-light flex items-center gap-2">
                <span className="opacity-50 text-[10px]">✧</span> 
                命运之轴无法篡改
                <span className="opacity-50 text-[10px]">✧</span>
              </p>
              <p className="mt-2 text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase opacity-80 leading-relaxed max-w-sm">
                可随此星轨回溯时间线，但前尘往事不得重写。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
              {questions.map((question, index) => {
                const answered = answeredIds.has(question.id);
                const current = index === activeSession.currentIndex;

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => handleDotClick(index)}
                    disabled={index > lastReachableIndex}
                    className={`h-[2px] transition-all duration-300 rounded-none ${
                      current
                        ? 'w-6 bg-[var(--text-gold)] shadow-[0_0_10px_rgba(206,170,123,0.8)]'
                        : answered
                          ? 'w-3 bg-[var(--line-gold)] hover:bg-[var(--line-gold-strong)]'
                          : index <= lastReachableIndex
                            ? 'w-2 bg-[var(--text-muted)] opacity-50 hover:opacity-100'
                            : 'w-2 bg-gray-800 opacity-40'
                    }`}
                    aria-label={`溯回至第 ${index + 1} 刻度`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 min-h-[520px]">
          <AnimatePresence mode="wait" custom={direction}>
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={activeSession.currentIndex + 1}
              total={TOTAL}
              axisLabel={axisMeta?.label ?? '界域维界'}
              axisHint={axisMeta ? `${axisMeta.labelA} vs ${axisMeta.labelB}` : '双界抉择'}
              selectedKey={selectedKey}
              isLocked={transitionLocked}
              onSelect={handleSelect}
              direction={direction}
            />
          </AnimatePresence>
        </div>

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line-gold)] border-opacity-20 pt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            className={`ghost-btn px-6 py-2.5 text-[10px] transition-opacity ${
              isFirst
                ? 'opacity-30 cursor-not-allowed border-gray-800 text-gray-500 hover:border-gray-800 hover:box-shadow-none pointer-events-none'
                : ''
            }`}
          >
             溯回时间
          </button>

          <div className="text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)] font-serif">
            印记 {answeredCount} / {TOTAL}
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
        <div className="flex min-h-screen items-center justify-center star-grid bg-[#050508] relative text-[var(--text-muted)] tracking-widest text-sm uppercase">
          ✧ 凝听星轨的呼唤 ✧
        </div>
      }
    >
      <TestContent />
    </Suspense>
  );
}
