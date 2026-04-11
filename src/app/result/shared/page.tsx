import Image from 'next/image';
import Link from 'next/link';
import DimensionBar from '@/components/test/DimensionBar';
import { decodeResult } from '@/lib/scoring';
import { dimensionPairs, personalityTypes } from '@/data/personality-types';

function buildDescription(percentA: number, percentB: number, labelA: string, labelB: string) {
  const margin = Math.abs(percentA - percentB);
  if (margin <= 8) {
    return `这一维比较平衡，你会在 ${labelA} 和 ${labelB} 之间灵活切换。`;
  }

  if (percentA >= percentB) {
    return `你略偏 ${labelA}，平时更容易自然表现出这一面。`;
  }

  return `你略偏 ${labelB}，在熟悉场景里会更明显。`;
}

export default async function SharedResultPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const params = await searchParams;
  const payload = params.d ? decodeResult(params.d) : null;
  const personality = payload ? personalityTypes[payload.t] : null;

  if (!payload || !personality) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-md rounded-[32px] border border-white/10 bg-white/6 p-8 text-center">
          <h1 className="text-2xl font-black">链接无效</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            这个分享链接没有带上有效的结果数据，重新回到首页测一次就可以了。
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900"
          >
            去做测试
          </Link>
        </div>
      </main>
    );
  }

  const confidence = payload.c ?? 0;
  const accent = personality.color.includes('gradient') ? '#2563EB' : personality.color;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef5ff_100%)] pb-14">
      <header className="border-b border-slate-200 bg-white/86 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-sm font-black tracking-[0.3em] text-slate-900">SBTI</p>
            <p className="text-xs text-slate-500">朋友分享给你的结果</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
          >
            我也要测
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-8">
        <section className="overflow-hidden rounded-[36px] bg-slate-950 text-white shadow-[0_40px_100px_rgba(15,23,42,0.24)]">
          <div className="grid gap-0 lg:grid-cols-[1fr_0.92fr]">
            <div className="px-6 py-8 md:px-10 md:py-10">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">你的朋友测出了</p>
              <h1 className="mt-5 text-6xl font-black tracking-tight md:text-8xl" style={{ color: accent }}>
                {personality.code}
              </h1>
              <p className="mt-4 text-3xl font-black">{personality.name}</p>
              <p className="mt-2 text-lg font-semibold text-slate-300">「{personality.slang}」</p>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">{personality.description}</p>
              <div className="mt-6 inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-slate-100">
                结果稳定度 {confidence}%
              </div>
            </div>
            <div className="border-t border-white/10 bg-white/5 p-4 lg:border-l lg:border-t-0 md:p-5">
              <Image
                src="/illustrations/personality-spectrum.svg"
                alt="SBTI 人格维度图示"
                width={1200}
                height={960}
                sizes="(max-width: 1024px) 100vw, 36vw"
                className="h-full w-full rounded-[28px] object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)] md:p-8">
          <h2 className="text-2xl font-black text-slate-900">四维趋势</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
            这是一份可分享的轻量版结果，重点展示四个维度的倾向百分比。
          </p>
          <div className="mt-6 space-y-4">
            {dimensionPairs.map((pair) => {
              const percentA = payload.p[pair.traitA] ?? 50;
              const percentB = payload.p[pair.traitB] ?? 50;

              return (
                <DimensionBar
                  key={pair.axis}
                  label={pair.label}
                  labelA={pair.labelA}
                  labelB={pair.labelB}
                  slangA={pair.slangA}
                  slangB={pair.slangB}
                  percentA={percentA}
                  percentB={percentB}
                  description={buildDescription(percentA, percentB, pair.labelA, pair.labelB)}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
