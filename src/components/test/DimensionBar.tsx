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
    <div className="tarot-card p-5 md:p-6 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-serif uppercase tracking-[0.2em] text-[var(--text-gold)] opacity-80 flex items-center gap-2">
            <span className="opacity-50 text-[8px]">✦</span>
            {label}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl font-serif text-[var(--text-main)] drop-shadow-[0_0_5px_rgba(206,170,123,0.3)]">{labelA}</span>
            <span className="rounded-[2px] border border-[var(--line-gold)] bg-black/40 px-2 py-0.5 text-[10px] text-[var(--text-gold)]">{slangA}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mt-4 md:mt-0">
            <span className="rounded-[2px] border border-[var(--text-muted)] border-opacity-30 bg-black/20 px-2 py-0.5 text-[10px] text-[var(--text-muted)]">{slangB}</span>
            <span className="text-xl font-serif text-[var(--text-muted)] opacity-60">{labelB}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 h-[2px] w-full bg-black/60 shadow-[0_0_5px_rgba(0,0,0,0.8)_inset] relative">
        <div className="absolute inset-0 flex">
          <motion.div
            className="h-full bg-[linear-gradient(90deg,transparent,rgba(206,170,123,0.8),var(--text-gold))] shadow-[0_0_10px_rgba(206,170,123,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${percentA}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <motion.div
            className="h-full bg-slate-800/40"
            initial={{ width: 0 }}
            animate={{ width: `${percentB}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        {/* 指示符 */}
        <motion.div
          className="absolute top-1/2 -ml-[1px] -mt-[6px] h-3 w-[2px] bg-[var(--text-gold)] shadow-[0_0_8px_rgba(206,170,123,1)]"
          initial={{ left: 0 }}
          animate={{ left: `${percentA}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] font-serif text-[var(--text-gold)] tracking-widest">
        <span>{percentA}%</span>
        <span className="text-[var(--text-muted)]">{percentB}%</span>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed tracking-wider text-[var(--text-muted)] font-light">{description}</p>
    </div>
  );
}
