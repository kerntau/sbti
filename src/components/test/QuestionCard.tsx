'use client';

import { motion } from 'framer-motion';
import { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  total: number;
  axisLabel: string;
  axisHint: string;
  selectedKey: string | null;
  isLocked?: boolean;
  onSelect: (key: string) => void;
  direction: number;
}

export default function QuestionCard({
  question,
  questionNumber,
  total,
  axisLabel,
  axisHint,
  selectedKey,
  isLocked = false,
  onSelect,
  direction,
}: QuestionCardProps) {
  return (
    <motion.section
      key={question.id}
      custom={direction}
      variants={{
        enter: (value: number) => ({ x: value > 0 ? 40 : -40, opacity: 0 }),
        center: {
          x: 0,
          opacity: 1,
          transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
        },
        exit: (value: number) => ({
          x: value < 0 ? 40 : -40,
          opacity: 0,
          transition: { duration: 0.2 },
        }),
      }}
      initial="enter"
      animate="center"
      exit="exit"
      className="mx-auto w-full max-w-3xl px-4"
    >
      <div className="glass-card-strong overflow-hidden rounded-[2rem]">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100/70 bg-slate-50/55 px-6 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {axisLabel}
            </span>
            <span className="text-sm font-medium text-slate-500">{axisHint}</span>
          </div>
          <span className="text-sm font-bold text-slate-400">
            {questionNumber} <span className="font-medium text-slate-300">/ {total}</span>
          </span>
        </div>

        <div className="px-6 py-10 md:px-10 md:py-12">
          <h2 className="text-2xl font-bold leading-snug text-slate-900 md:text-3xl">
            {question.text}
          </h2>

          <div className="mt-8 flex flex-col gap-4">
            {question.options.map((option) => {
              const active = selectedKey === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  disabled={isLocked}
                  onClick={() => onSelect(option.key)}
                  className={`group relative flex w-full items-center gap-5 rounded-2xl p-5 text-left transition-all duration-300 focus-visible:outline-none disabled:cursor-wait ${
                    active
                      ? 'bg-blue-50/80 shadow-[0_0_0_1px_#3b82f6,0_16px_40px_-22px_rgba(59,130,246,0.45)]'
                      : 'border border-white/80 bg-white/80 hover:border-blue-200 hover:bg-slate-50 hover:shadow-sm'
                  }`}
                  aria-pressed={active}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                      active ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-blue-400'
                    }`}
                  >
                    {active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-2 w-2 rounded-full bg-white"
                      />
                    )}
                  </div>

                  <span
                    className={`flex-1 text-base font-medium md:text-lg ${
                      active ? 'text-blue-900' : 'text-slate-700 group-hover:text-slate-900'
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
