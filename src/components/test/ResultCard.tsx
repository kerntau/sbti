'use client';

import Image from 'next/image';
import { TestResult } from '@/types';
import { getProfileDisplayName, getProfileInitial } from '@/lib/profile';
import DimensionBar from './DimensionBar';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface ResultCardProps {
  result: TestResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const confidencePct = Math.round(result.confidence * 100);
  const displayName = getProfileDisplayName(result.profile);
  const hasProfile = Boolean(result.profile?.nickname || result.profile?.qq || result.profile?.avatarUrl);
  const completedDate = new Date(result.completedAt);
  const dateStr = completedDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const durationMin = Math.floor(result.durationMs / 60000);
  const durationSec = Math.round((result.durationMs % 60000) / 1000);

  const radarData = result.axisBreakdown.map((axis) => ({
    subject: axis.label,
    value: Math.max(axis.percentA, axis.percentB),
    fullMark: 100,
  }));

  return (
    <article>
      {/* ─── 报告页眉 ─── */}
      <header className="flex items-center justify-between">
        <span className="text-sm font-bold tracking-tight text-[var(--text-primary)]">SBTI</span>
        <span className="text-xs text-[var(--text-muted)] tabular-nums">{dateStr}</span>
      </header>
      <hr className="border-t-2 border-[var(--text-primary)] mt-3 mb-8" />

      {/* ─── 报告标题 ─── */}
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          SBTI 认知偏好评估报告
        </h1>
      </div>

      {/* ─── 受测者信息 ─── */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs text-[var(--text-secondary)] flex-wrap">
        {hasProfile && (
          <>
            <div className="flex items-center gap-2">
              <div className="relative h-6 w-6 overflow-hidden rounded-full border border-[var(--border-light)] bg-[var(--border-light)] flex-shrink-0">
                {result.profile?.avatarUrl ? (
                  <Image src={result.profile.avatarUrl} alt={displayName} fill sizes="24px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[var(--text-muted)]">
                    {getProfileInitial(result.profile)}
                  </div>
                )}
              </div>
              <span>受测者: <strong className="font-semibold">{displayName}</strong></span>
            </div>
            {result.profile?.qq && (
              <span className="text-[var(--text-muted)]">编号: {result.profile.qq}</span>
            )}
          </>
        )}
        <span className="text-[var(--text-muted)]">置信度: {confidencePct}%</span>
      </div>

      <hr className="report-rule mt-6" />

      {/* ─── §1 总体结论 ─── */}
      <section className="report-section">
        <h2 className="report-section-title">§1　总体结论</h2>
        <hr className="report-rule" />

        <div className="text-center mb-6">
          <p className="text-5xl sm:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-none">
            {result.type}
          </p>
          <p className="mt-3 text-base text-[var(--text-secondary)]">
            {result.personality.name}
            <span className="mx-2 text-[var(--border-rule)]">·</span>
            {result.personality.slang}
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)] italic">
            「{result.personality.tagline}」
          </p>
        </div>

        <p className="text-sm leading-[1.85] text-[var(--text-secondary)]">
          {result.personality.description}
        </p>
      </section>

      {/* ─── §2 维度分析 ─── */}
      <section className="report-section">
        <h2 className="report-section-title">§2　维度分析</h2>
        <hr className="report-rule" />

        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Radar Chart */}
          <div className="w-full md:w-52 h-52 flex-shrink-0 mx-auto md:mx-0 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
                <PolarGrid stroke="#e0e0dc" strokeWidth={0.8} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 11, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Type" dataKey="value" stroke="#1a1a1a" strokeWidth={1.5} fill="#1a1a1a" fillOpacity={0.05} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Dimension Bars */}
          <div className="flex-1 min-w-0">
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
      </section>

      {/* ─── §3 特质评估 ─── */}
      <section className="report-section">
        <h2 className="report-section-title">§3　特质评估</h2>
        <hr className="report-rule" />

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h3 className="text-xs font-semibold text-[var(--success)] mb-3">3.1　核心优势</h3>
            <ol className="space-y-2.5 list-none p-0 m-0">
              {result.personality.strengths.map((item, i) => (
                <li key={item} className="text-sm text-[var(--text-secondary)] leading-relaxed flex gap-2.5">
                  <span className="text-xs text-[var(--text-muted)] mt-0.5 tabular-nums shrink-0 w-4 text-right">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-[var(--danger)] mb-3">3.2　潜在盲区</h3>
            <ol className="space-y-2.5 list-none p-0 m-0">
              {result.personality.weaknesses.map((item, i) => (
                <li key={item} className="text-sm text-[var(--text-secondary)] leading-relaxed flex gap-2.5">
                  <span className="text-xs text-[var(--text-muted)] mt-0.5 tabular-nums shrink-0 w-4 text-right">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ─── §4 沟通建议 ─── */}
      <section className="report-section">
        <h2 className="report-section-title">§4　沟通建议</h2>
        <hr className="report-rule" />
        <p className="text-sm leading-[1.85] text-[var(--text-secondary)]">
          {result.personality.communication}
        </p>
      </section>

      {/* ─── §5 补充说明 ─── */}
      <section className="report-section">
        <h2 className="report-section-title">§5　补充说明</h2>
        <hr className="report-rule" />
        <ul className="space-y-2 list-none p-0 m-0">
          {result.highlights.map((item) => (
            <li key={item} className="text-sm text-[var(--text-secondary)] leading-relaxed flex gap-2">
              <span className="text-[var(--text-muted)] shrink-0">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {result.durationMs > 0 && (
          <p className="mt-4 text-xs text-[var(--text-muted)] tabular-nums">
            测试用时: {durationMin > 0 ? `${durationMin} 分 ` : ''}{durationSec} 秒
          </p>
        )}
      </section>

      {/* ─── 报告页脚 ─── */}
      <footer className="mt-12 pt-4 border-t border-[var(--border-rule)]">
        <p className="text-[11px] text-[var(--text-caption)] text-center leading-relaxed">
          SBTI 认知偏好评估系统 · 数据仅存储于本地浏览器 · 不构成任何专业心理学诊断
        </p>
      </footer>
    </article>
  );
}
