import Link from 'next/link';
import { decodeResult } from '@/lib/scoring';
import { typeLibrary, dimensionMeta, dimensionExplanations, dimensionOrder } from '@/data/personality-types';
import { DimensionCode, IMSBLevel } from '@/types';

function sumToLevel(score: number): IMSBLevel {
  if (score <= 3) return 'L';
  if (score === 4) return 'M';
  return 'H';
}

export default async function SharedResultPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const params = await searchParams;
  const payload = params.d ? decodeResult(params.d) : null;
  const personality = payload ? typeLibrary[payload.t] : null;

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

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef5ff_100%)] pb-14">
      <header className="border-b border-slate-200 bg-white/86 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-sm font-black tracking-[0.3em] text-slate-900">IMSB</p>
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
        {/* 人格类型卡 */}
        <section className="overflow-hidden rounded-[36px] bg-slate-950 text-white shadow-[0_40px_100px_rgba(15,23,42,0.24)]">
          <div className="px-6 py-8 md:px-10 md:py-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">你的朋友测出了</p>
            <h1 className="mt-5 text-6xl font-black tracking-tight md:text-8xl">
              {personality.code}
            </h1>
            <p className="mt-4 text-3xl font-black">{personality.cn}</p>
            <p className="mt-2 text-lg font-semibold text-slate-300">「{personality.intro}」</p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">{personality.desc}</p>
            <div className="mt-6 inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-slate-100">
              匹配度 {payload.s}%
            </div>
          </div>
        </section>

        {/* 维度展示 */}
        {payload.d && Object.keys(payload.d).length > 0 && (
          <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)] md:p-8">
            <h2 className="text-2xl font-black text-slate-900">十五维度概览</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
              这是一份轻量版分享结果，展示各维度的方向等级。
            </p>
            <div className="mt-6 space-y-3">
              {dimensionOrder.map((dim) => {
                const rawScore = payload.d[dim] ?? 0;
                const level = sumToLevel(rawScore);
                const meta = dimensionMeta[dim as DimensionCode];
                const explanation = dimensionExplanations[dim as DimensionCode]?.[level] ?? '';
                const barLevel = { L: 1, M: 2, H: 3 }[level];

                return (
                  <div key={dim} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-slate-900">{meta?.name ?? dim}</span>
                      <span className="text-xs font-bold text-slate-700 tabular-nums">{level} / {rawScore}分</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className="h-1.5 flex-1 rounded-full"
                          style={{ backgroundColor: n <= barLevel ? '#1e293b' : '#e2e8f0' }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{explanation}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
