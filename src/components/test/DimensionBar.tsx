'use client';

import { motion } from 'framer-motion';

interface DimensionBarProps {
  label: string;
  labelA: string;
  labelB: string;
  slangA: string;
  slangB: string;
  percentA: number;
  percentB: number;
  description: string;
}

export default function DimensionBar({
  label,
  labelA,
  labelB,
  slangA,
  slangB,
  percentA,
  percentB,
  description,
}: DimensionBarProps) {
  return (
    <div className="glass-card rounded-[1.75rem] px-5 py-5 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-base font-semibold text-slate-900 md:text-lg">{labelA}</span>
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">{slangA}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{slangB}</span>
            <span className="text-base font-semibold text-slate-900 md:text-lg">{labelB}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-full bg-white/80 ring-1 ring-slate-200/80">
        <div className="flex h-3.5 w-full">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${percentA}%` }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
          <motion.div
            className="h-full bg-slate-200"
            initial={{ width: 0 }}
            animate={{ width: `${percentB}%` }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm font-semibold text-slate-600">
        <span>{labelA} {percentA}%</span>
        <span>{labelB} {percentB}%</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
