'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

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
    <div className="bg-slate-50 border border-slate-200 p-5 md:p-6 mb-4 rounded">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            {label}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900 tracking-tight">{labelA}</span>
            <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white tracking-widest uppercase">{slangA}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mt-4 md:mt-0">
            <span className="rounded bg-white border border-slate-300 px-2 py-0.5 text-[10px] font-bold text-slate-500 tracking-widest uppercase">{slangB}</span>
            <span className="text-xl font-bold text-slate-400 tracking-tight">{labelB}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 h-1.5 w-full bg-slate-200 rounded-full relative overflow-hidden flex">
        <motion.div
          className="h-full bg-slate-900 border-r-2 border-white"
          initial={{ width: 0 }}
          animate={{ width: `${percentA}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <motion.div
          className="h-full bg-slate-300 pointer-events-none opacity-50"
          initial={{ width: 0 }}
          animate={{ width: `${percentB}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono font-bold text-slate-900 tracking-widest">
        <span>{percentA}%</span>
        <span className="text-slate-400">{percentB}%</span>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-600 border-t border-slate-200 pt-3">{description}</p>
    </div>
  );
}
