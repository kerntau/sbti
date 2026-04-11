'use client';

import { motion } from 'framer-motion';
import { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  total: number;
  dimLabel: string;
  selectedValue: number | null;
  isLocked?: boolean;
  onSelect: (value: number) => void;
  direction: number;
}

const KEYS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({
  question,
  questionNumber,
  total,
  dimLabel,
  selectedValue,
  isLocked = false,
  onSelect,
  direction,
}: QuestionCardProps) {
  return (
    <motion.section
      key={question.id}
      custom={direction}
      variants={{
        enter: (dir: number) => ({ x: dir > 0 ? 16 : -16, opacity: 0 }),
        center: {
          x: 0,
          opacity: 1,
          transition: { type: 'tween', duration: 0.18, ease: 'easeOut' },
        },
        exit: (dir: number) => ({
          x: dir < 0 ? 16 : -16,
          opacity: 0,
          transition: { duration: 0.1 },
        }),
      }}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full"
    >
      {/* 题号标签 */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--text-primary)] text-white text-[11px] font-bold">
          {questionNumber}
        </span>
        <span>/ {total}</span>
        {!question.special && (
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-page)] border border-[var(--border-light)]">
            {dimLabel}
          </span>
        )}
      </div>

      {/* 题目文本 */}
      <h2 className="text-base sm:text-lg font-bold leading-relaxed text-[var(--text-primary)] mb-5">
        {question.text}
      </h2>

      {/* 选项——更紧凑 */}
      <div className="flex flex-col gap-2">
        {question.options.map((opt, i) => {
          const active = selectedValue === opt.value;
          return (
            <button
              key={`${question.id}-${opt.value}-${i}`}
              type="button"
              disabled={isLocked}
              onClick={() => onSelect(opt.value)}
              className={`q-option ${active ? 'q-option-active' : ''} text-center`}
              aria-pressed={active}
            >
              <span className="flex-1 text-sm sm:text-base py-1 font-medium">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
