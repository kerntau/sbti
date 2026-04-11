'use client';

import { motion } from 'framer-motion';
import { Question } from '@/types';
import { CheckCircle2, Circle } from 'lucide-react';

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
        enter: (dir: number) => ({ x: dir > 0 ? 20 : -20, opacity: 0 }),
        center: {
          x: 0,
          opacity: 1,
          transition: { type: 'tween', duration: 0.25, ease: 'easeOut' },
        },
        exit: (dir: number) => ({
          x: dir < 0 ? 20 : -20,
          opacity: 0,
          transition: { duration: 0.15 },
        }),
      }}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full"
    >
      <p className="text-xs text-[var(--text-muted)] mb-1">
        <span className="text-[var(--text-primary)] font-semibold">{questionNumber}</span> / {total}
        <span className="ml-3 text-[var(--border-rule)]">·</span>
        <span className="ml-3">{axisLabel}</span>
      </p>

      <h2 className="text-lg sm:text-xl font-bold leading-relaxed text-[var(--text-primary)] mt-4 mb-8">
        {question.text}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((option) => {
          const active = selectedKey === option.key;

          return (
            <button
              key={option.key}
              type="button"
              disabled={isLocked}
              onClick={() => onSelect(option.key)}
              className={`group relative flex w-full items-center gap-3 px-5 py-4 text-left transition-all duration-150 outline-none disabled:cursor-wait rounded-lg border ${
                active
                  ? 'bg-[var(--text-primary)] border-[var(--text-primary)] text-white'
                  : 'bg-[var(--bg-paper)] border-[var(--border-light)] hover:border-[var(--border-rule)] text-[var(--text-secondary)]'
              }`}
              aria-pressed={active}
            >
              <div className={`shrink-0 transition-colors ${active ? 'text-white' : 'text-[var(--border-rule)] group-hover:text-[var(--text-muted)]'}`}>
                {active ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              </div>

              <span className="flex-1 text-sm font-medium">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
