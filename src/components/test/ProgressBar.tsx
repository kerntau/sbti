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
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            当前进度 {answered}/{total}
          </p>
          <p className="text-sm text-slate-500">
            正在回答第 {current + 1} 题，答题记录会自动保存。
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/70 ring-1 ring-slate-200/70 backdrop-blur-sm">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring' as const, stiffness: 120, damping: 22 }}
        />
      </div>
    </div>
  );
}
