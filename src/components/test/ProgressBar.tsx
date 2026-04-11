'use client';

interface ProgressBarProps {
  total: number;
  answered: number;
}

export default function ProgressBar({ total, answered }: ProgressBarProps) {
  const progress = Math.min(100, Math.max(0, (answered / total) * 100));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 mt-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[11px] tracking-wide text-[var(--text-muted)]">
          进度 {answered}/{total}
        </p>
        <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-0.5 w-full bg-[var(--border-light)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--text-primary)] transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
