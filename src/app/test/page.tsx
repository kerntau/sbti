'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Database, ArrowLeft, Loader2 } from 'lucide-react';
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
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] blueprint-grid">
        <div className="clinical-card px-8 py-6 flex items-center gap-4 bg-white shadow-sm">
          <Loader2 className="w-5 h-5 text-slate-800 animate-spin" />
          <p className="text-xs font-bold font-mono text-slate-600 tracking-widest uppercase">
            [SYSTEM BOOT] Loading Protocol...
          </p>
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
      }, 250); // 结构化 UI 响应更快
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

  function handleDotClick(index: number) {
    if (transitionLocked || index > lastReachableIndex || index === activeSession.currentIndex) return;
    setDirection(index > activeSession.currentIndex ? 1 : -1);
    goTo(index);
    syncIndex(index);
  }

  const answeredIds = new Set(Object.keys(activeSession.answers));

  if (isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] blueprint-grid">
        <div className="clinical-card px-10 py-10 text-center flex flex-col items-center bg-white shadow-sm">
          <Loader2 className="w-8 h-8 text-slate-900 animate-spin mb-6" />
          <p className="text-base font-bold tracking-tight text-slate-900">正在生成体征化分析图谱...</p>
          <p className="mt-2 text-[10px] font-mono tracking-widest text-slate-400 uppercase">Compile Data Grid</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] blueprint-grid relative">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> 终止协议
          </button>
          <div className="text-right flex items-center gap-3">
            <Database className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Assessment Running</p>
              <p className="text-[10px] text-slate-400 tracking-wider mt-0.5 font-mono">STRICT SEQUENCE</p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-5xl px-4 md:px-8 pb-12 pt-8">
        <ProgressBar total={TOTAL} answered={answeredCount} />

        <div className="clinical-card mt-8 p-5 bg-white shadow-sm overflow-visible">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate-900 uppercase">
                检测轴节点溯源
              </p>
              <p className="mt-1 text-[10px] font-mono tracking-wider text-slate-500 max-w-sm leading-relaxed">
                [SYSTEM NOTE] 可以点击刻度覆盖之前的输入点。但禁止跳跃访问。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1 md:gap-1.5">
              {questions.map((question, index) => {
                const answered = answeredIds.has(question.id);
                const current = index === activeSession.currentIndex;

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => handleDotClick(index)}
                    disabled={index > lastReachableIndex}
                    className={`h-[4px] transition-all duration-300 rounded ${
                      current
                        ? 'w-6 bg-slate-900 border border-slate-900 shadow-[0_0_0_1px_#0f172a]'
                        : answered
                          ? 'w-4 bg-slate-400 hover:bg-slate-600'
                          : index <= lastReachableIndex
                            ? 'w-2 bg-slate-200 hover:bg-slate-300'
                            : 'w-2 bg-slate-100'
                    }`}
                    aria-label={`跳转至序列 ${index + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 min-h-[460px]">
          <AnimatePresence mode="wait" custom={direction}>
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={activeSession.currentIndex + 1}
              total={TOTAL}
              axisLabel={axisMeta?.label ?? '界域维界'}
              axisHint={axisMeta ? `${axisMeta.labelA} vs ${axisMeta.labelB}` : '极端决策'}
              selectedKey={selectedKey}
              isLocked={transitionLocked}
              onSelect={handleSelect}
              direction={direction}
            />
          </AnimatePresence>
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            className={`flex items-center gap-2 rounded border px-6 py-2.5 text-xs font-bold transition-all ${
              isFirst
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400 bg-slate-50'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
             <ArrowLeft className="w-3 h-3" /> 回退上一项
          </button>

          <div className="text-[10px] tracking-widest font-mono text-slate-400 uppercase">
             PROBED {answeredCount} / {TOTAL}
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
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] blueprint-grid">
           <div className="clinical-card px-8 py-6 flex items-center gap-4 bg-white shadow-sm">
             <Loader2 className="w-5 h-5 text-slate-800 animate-spin" />
             <p className="text-xs font-bold font-mono text-slate-600 tracking-widest uppercase">
               [CORE] Loading Protocol...
             </p>
           </div>
        </div>
      }
    >
      <TestContent />
    </Suspense>
  );
}
