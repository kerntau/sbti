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
        enter: (value: number) => ({ scale: 0.95, opacity: 0, filter: 'blur(10px)' }),
        center: {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          transition: { type: 'spring' as const, stiffness: 200, damping: 25 },
        },
        exit: (value: number) => ({
          scale: 1.05,
          opacity: 0,
          filter: 'blur(10px)',
          transition: { duration: 0.2 },
        }),
      }}
      initial="enter"
      animate="center"
      exit="exit"
      className="mx-auto w-full max-w-3xl px-4 flex justify-center perspective-1000"
    >
      <div className="tarot-card w-full p-2 md:p-3 relative group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(206,170,123,0.02)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-[var(--line-gold)] border-opacity-30 pb-4 mb-8 pt-4 px-6 md:px-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center gap-2 text-[10px] tracking-[0.3em] font-serif text-[var(--text-gold)] uppercase">
              <span className="opacity-50 text-[8px]">✧</span>
              {axisLabel}
              <span className="opacity-50 text-[8px]">✧</span>
            </span>
            <span className="text-[10px] uppercase font-light tracking-widest text-[var(--text-muted)] opacity-60 hidden md:inline-block">
              {axisHint}
            </span>
          </div>
          <span className="text-[10px] font-serif text-[var(--text-muted)] tracking-[0.2em]">
            <span className="text-[var(--text-gold)]">{questionNumber}</span> / {total}
          </span>
        </div>

        <div className="px-6 pb-10 md:px-10 md:pb-14 relative z-10">
          <h2 className="text-xl md:text-2xl font-serif leading-relaxed text-[var(--text-main)] tracking-wide min-h-[4rem]">
            {question.text}
          </h2>

          <div className="mt-12 flex flex-col gap-6">
            {question.options.map((option) => {
              const active = selectedKey === option.key;

              return (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  key={option.key}
                  type="button"
                  disabled={isLocked}
                  onClick={() => onSelect(option.key)}
                  className={`group relative flex w-full items-center gap-5 p-5 text-left transition-all duration-500 focus-visible:outline-none disabled:cursor-wait overflow-hidden ${
                    active
                      ? 'bg-black/60 shadow-[inset_0_0_15px_rgba(206,170,123,0.15)] border-y border-[var(--line-gold-strong)]'
                      : 'bg-black/20 border-y border-transparent hover:bg-black/40 hover:border-[var(--line-gold)] hover:border-opacity-30'
                  }`}
                  aria-pressed={active}
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 transform rotate-45 items-center justify-center border transition-all duration-500 ${
                      active ? 'border-[var(--text-gold)] bg-[var(--text-gold)] shadow-[0_0_10px_rgba(206,170,123,0.5)]' : 'border-[var(--line-gold)] opacity-50 group-hover:opacity-100 group-hover:border-[var(--text-gold)]'
                    }`}
                  >
                    {active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-1 w-1 bg-black"
                      />
                    )}
                  </div>

                  <span
                    className={`flex-1 text-sm tracking-wide md:text-base font-light transition-colors duration-500 ${
                      active ? 'text-[var(--text-main)] drop-shadow-[0_0_5px_rgba(206,170,123,0.5)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'
                    }`}
                  >
                    {option.label}
                  </span>

                  {active && (
                    <motion.div 
                      layoutId="activeGlow"
                      className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(206,170,123,0.05),transparent)] z-[-1]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
