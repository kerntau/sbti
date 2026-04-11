'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  answered: number;
}

export default function ProgressBar({ current, total, answered }: ProgressBarProps) {
  const progress = Math.min(100, Math.max(0, (answered / total) * 100));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 mt-4">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            命运刻度 {answered}/{total}
          </p>
        </div>
        <span className="font-serif text-[10px] text-[var(--text-gold)] tracking-widest flex items-center justify-center relative">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="relative h-[1px] w-full bg-[var(--line-gold)] opacity-30 shadow-[0_0_5px_rgba(206,170,123,0.1)]">
        <motion.div
          className="absolute left-0 top-0 h-full bg-[var(--text-gold)] shadow-[0_0_10px_rgba(206,170,123,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring' as const, stiffness: 60, damping: 20 }}
        />
        <motion.div
          className="absolute top-1/2 -ml-2.5 -mt-2.5 flex h-5 w-5 items-center justify-center text-[var(--text-gold)]"
          initial={{ left: 0 }}
          animate={{ left: `${progress}%` }}
          transition={{ type: 'spring' as const, stiffness: 60, damping: 20 }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="text-xs filter drop-shadow-[0_0_5px_rgba(206,170,123,0.8)]"
          >
            ✦
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
