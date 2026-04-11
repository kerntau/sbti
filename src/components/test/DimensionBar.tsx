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
  const dominant = percentA >= percentB ? 'A' : 'B';

  return (
    <div className="py-3 border-b border-[var(--border-light)] last:border-b-0">
      <p className="text-[11px] text-[var(--text-muted)] mb-1.5 tracking-wide">{label}</p>

      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className={`text-sm font-semibold ${dominant === 'A' ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
          {labelA} <span className="text-xs font-normal tabular-nums">{percentA}%</span>
        </span>
        <span className={`text-sm font-semibold text-right ${dominant === 'B' ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
          {labelB} <span className="text-xs font-normal tabular-nums">{percentB}%</span>
        </span>
      </div>

      <div className="h-1 w-full bg-[var(--border-light)] rounded-full overflow-hidden flex">
        <motion.div
          className="h-full bg-[var(--text-primary)] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentA}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">{description}</p>
    </div>
  );
}
