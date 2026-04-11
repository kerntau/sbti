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
  return `${minutes} 刻度`;
}

export default function ResultCard({ result }: ResultCardProps) {
  const confidencePct = Math.round(result.confidence * 100);
  const strongestAxis = [...result.axisBreakdown].sort((a, b) => b.margin - a.margin)[0];
  const displayName = getProfileDisplayName(result.profile);
  const hasProfile = Boolean(result.profile?.nickname || result.profile?.qq || result.profile?.avatarUrl);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 relative z-10">
      <section className="tarot-card overflow-hidden p-8 md:p-12 relative flex flex-col items-center justify-center text-center">
        {/* Background rays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(206,170,123,0.06)_0%,transparent_70%)] pointer-events-none" />

        <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-[var(--text-gold)] flex items-center gap-3 opacity-80 z-10">
          <span className="w-8 h-[1px] bg-[var(--text-gold)]"></span>
          命盘宣判
          <span className="w-8 h-[1px] bg-[var(--text-gold)]"></span>
        </p>

        {hasProfile && (
          <div className="mt-8 flex flex-col items-center gap-3 z-10">
            <div className="relative h-16 w-16 overflow-hidden border border-[var(--line-gold)] p-1 shadow-[0_0_20px_rgba(206,170,123,0.2)] bg-[#050508]">
               <div className="absolute inset-0 m-1 border border-[var(--line-gold)] opacity-30"></div>
              {result.profile?.avatarUrl ? (
                <Image src={result.profile.avatarUrl} alt={`${displayName} 头像`} fill sizes="64px" className="object-cover p-2" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-serif text-[var(--text-gold)] font-bold">
                  {getProfileInitial(result.profile)}
                </div>
              )}
            </div>
            <p className="text-xs tracking-[0.3em] font-serif text-[var(--text-gold)]">{displayName}</p>
          </div>
        )}

        <div className="mt-10 relative z-10">
          <h1 className="text-7xl md:text-9xl font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#f7e2c0] via-[#ceaa7b] to-[#8c6b41] drop-shadow-[0_0_30px_rgba(206,170,123,0.4)] px-4">
            {result.type}
          </h1>
        </div>

        <div className="mt-8 relative z-10">
          <p className="text-3xl font-serif text-[var(--text-main)] tracking-widest md:text-4xl">{result.personality.name}</p>
          <p className="mt-4 text-xs font-light tracking-[0.4em] text-[var(--text-gold)] uppercase">「{result.personality.slang}」</p>
        </div>

        <p className="mt-10 max-w-2xl text-sm leading-8 tracking-wider text-[var(--text-muted)] md:text-base font-light z-10">
          {result.personality.description}
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4 z-10">
          <span className="border border-[var(--line-gold)] bg-black/40 px-5 py-2.5 text-[10px] tracking-[0.2em] text-[var(--text-gold)] uppercase">
            星盘契合度 {confidencePct}%
          </span>
          <span className="border border-[var(--line-soft)] bg-black/20 px-5 py-2.5 text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
            回溯用时 {formatDuration(result.durationMs)}
          </span>
          <span className="border border-[var(--line-soft)] bg-black/20 px-5 py-2.5 text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase flex items-center gap-2">
            主导源力 <span className="text-[var(--text-gold)]">{strongestAxis.dominantLabel}</span>
          </span>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="tarot-card p-6 md:p-8">
          <h2 className="text-xl font-serif text-[var(--text-gold)] tracking-[0.2em] flex items-center gap-3">
            <span className="text-2xl font-light">✦</span>
            四维能量拆解
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)] font-light tracking-wide mb-8">
            洞悉每丝能量的流动，超越表象的四维象征。
          </p>

          <div className="space-y-6">
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

        <div className="space-y-6 flex flex-col">
          <section className="tarot-card p-6 md:p-8 flex-1">
            <h3 className="text-[11px] font-serif text-[var(--text-gold)] tracking-[0.3em] uppercase mb-6 flex items-center gap-2 opacity-80">
              <span className="opacity-50 text-[10px]">✧</span> 灵魂辉光 
            </h3>
            <div className="space-y-4">
              {result.personality.strengths.map((item) => (
                <div key={item} className="border-l border-[var(--text-gold)] bg-[linear-gradient(90deg,rgba(206,170,123,0.05),transparent)] pl-4 py-3 text-xs leading-loose tracking-wide text-[var(--text-main)] font-light">
                  {item}
                </div>
              ))}
            </div>
            
            <h3 className="text-[11px] font-serif text-amber-600 tracking-[0.3em] uppercase mt-10 mb-6 flex items-center gap-2 opacity-80">
              <span className="opacity-50 text-[10px]">✧</span> 宿命暗影
            </h3>
            <div className="space-y-4">
              {result.personality.weaknesses.map((item) => (
                <div key={item} className="border-l border-amber-900/50 bg-[linear-gradient(90deg,rgba(180,83,9,0.05),transparent)] pl-4 py-3 text-xs leading-loose tracking-wide text-[var(--text-muted)] font-light">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="tarot-card p-6 md:p-8">
            <p className="text-[10px] font-serif uppercase tracking-[0.3em] text-[var(--text-gold)] mb-4 flex items-center gap-2">
               <span className="opacity-50 text-[10px]">✦</span> 界域沟通法则
            </p>
            <p className="text-[11px] leading-loose text-[var(--text-main)] font-light tracking-widest opacity-90">{result.personality.communication}</p>
          </section>
        </div>
      </section>
    </div>
  );
}
