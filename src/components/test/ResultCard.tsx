'use client';

import Image from 'next/image';
import { TestResult } from '@/types';
import { getProfileDisplayName, getProfileInitial } from '@/lib/profile';
import DimensionBar from './DimensionBar';

interface ResultCardProps {
  result: TestResult;
}

function formatDuration(durationMs: number) {
  const minutes = Math.max(1, Math.round(durationMs / 60000));
  return `${minutes} 分钟`;
}

function getAccent(color: string) {
  return color.includes('gradient') ? '#2563EB' : color;
}

export default function ResultCard({ result }: ResultCardProps) {
  const accent = getAccent(result.personality.color);
  const confidencePct = Math.round(result.confidence * 100);
  const strongestAxis = [...result.axisBreakdown].sort((a, b) => b.margin - a.margin)[0];
  const displayName = getProfileDisplayName(result.profile);
  const hasProfile = Boolean(result.profile?.nickname || result.profile?.qq || result.profile?.avatarUrl);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4">
      <section className="glass-card-strong overflow-hidden rounded-[2rem] p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">SBTI Result</p>

            {hasProfile && (
              <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-white/75 px-3 py-2 ring-1 ring-slate-200/80">
                <div className="relative h-11 w-11 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                  {result.profile?.avatarUrl ? (
                    <Image src={result.profile.avatarUrl} alt={`${displayName} 的头像`} fill sizes="44px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-base font-bold text-blue-600">
                      {getProfileInitial(result.profile)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                  <p className="text-xs text-slate-500">这次的分享卡会带上你的头像与昵称</p>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-end gap-4">
              <h1 className="text-6xl font-black tracking-tight md:text-8xl" style={{ color: accent }}>
                {result.type}
              </h1>
              <div className="pb-2">
                <p className="text-2xl font-bold text-slate-900 md:text-3xl">{result.personality.name}</p>
                <p className="mt-1 text-base font-semibold text-slate-500">「{result.personality.slang}」</p>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              {result.personality.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
                结果稳定度 {confidencePct}%
              </span>
              <span className="rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                用时 {formatDuration(result.durationMs)}
              </span>
              <span className="rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                最明显维度 {strongestAxis.dominantLabel}
              </span>
            </div>
          </div>

          <div className="glass-card rounded-[1.75rem] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">结果速览</p>
            <div className="mt-4 space-y-3">
              {result.highlights.map((item) => (
                <div key={item} className="rounded-[1.4rem] bg-white/80 px-4 py-4 ring-1 ring-slate-100">
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card-strong rounded-[2rem] p-6 md:p-8">
          <h2 className="text-2xl font-black text-slate-900">四维人格拆解</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
            不只是给你一个四字母标签，我们也把每个维度的倾向强弱拆开给你看。
          </p>

          <div className="mt-6 space-y-4">
            {result.axisBreakdown.map((axis) => (
              <DimensionBar
                key={axis.axis}
                label={axis.label}
                labelA={axis.labelA}
                labelB={axis.labelB}
                slangA={axis.slangA}
                slangB={axis.slangB}
                percentA={axis.percentA}
                percentB={axis.percentB}
                description={axis.description}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="glass-card-strong rounded-[2rem] p-6 md:p-8">
            <h3 className="text-xl font-black text-slate-900">你的优势</h3>
            <div className="mt-4 space-y-3">
              {result.personality.strengths.map((item) => (
                <div key={item} className="rounded-[1.4rem] bg-emerald-50 px-4 py-3 text-sm font-medium leading-6 text-emerald-900 ring-1 ring-emerald-100">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card-strong rounded-[2rem] p-6 md:p-8">
            <h3 className="text-xl font-black text-slate-900">容易踩的坑</h3>
            <div className="mt-4 space-y-3">
              {result.personality.weaknesses.map((item) => (
                <div key={item} className="rounded-[1.4rem] bg-rose-50 px-4 py-3 text-sm font-medium leading-6 text-rose-900 ring-1 ring-rose-100">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-[1.6rem] bg-slate-900 px-5 py-5 text-sm leading-6 text-slate-200">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">沟通建议</p>
              <p className="mt-2">{result.personality.communication}</p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
