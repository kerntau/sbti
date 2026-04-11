import Image from 'next/image';
import Link from 'next/link';
import StartTestPanel from '@/components/home/StartTestPanel';

const facts = [
  { value: '28', label: '核心问题' },
  { value: '16', label: '人格画像' },
  { value: '5 min', label: '极速解析' },
];

const features = [
  '开始前可选填写昵称与 QQ，自动生成头像',
  '四维百分比与解释文案同时呈现',
  '结果支持分享链接与分享图片',
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-60" />
      <div className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-28 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <header className="glass-card flex items-center justify-between rounded-full px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-sm font-black text-white shadow-lg shadow-blue-500/20">
              S
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.2em] text-slate-900">SBTI</p>
              <p className="text-xs text-slate-500">Modern Personality Test</p>
            </div>
          </div>
          <Link
            href="#start-test"
            className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
          >
            填写后开始
          </Link>
        </header>

        <section className="flex flex-col items-center pb-10 pt-16 text-center md:pt-24">
          <div className="glass-card rounded-full px-4 py-2 text-sm font-medium text-blue-600">
            全新的自我探索体验
          </div>

          <h1 className="text-balance mt-8 max-w-5xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            重新认识你的
            <span className="mt-2 block bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">
              内在节奏与潜能
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
            摒弃单薄的四字母标签，通过 28 道场景题更细致地拆解你的能量来源、感知偏好、决策逻辑与行动节奏。
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#start-test"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-600/20 hover:-translate-y-1 hover:bg-blue-700"
            >
              先填写资料
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <div className="glass-card rounded-full px-5 py-4 text-sm font-medium text-slate-600">
              无需注册，结果自动保存在当前设备
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
          <div className="grid gap-6">
            <div className="grid gap-6 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="glass-card rounded-[2rem] p-8 text-center">
                  <p className="text-5xl font-black text-slate-900">{fact.value}</p>
                  <p className="mt-3 text-sm font-semibold tracking-wider text-slate-500">
                    {fact.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-[2rem] p-7 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">为什么更好看也更好用</p>
              <div className="mt-5 space-y-4">
                {features.map((feature, index) => (
                  <div key={feature} className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      {index + 1}
                    </div>
                    <p className="text-base font-medium leading-7 text-slate-700">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card-strong rounded-[2.25rem] p-4 md:p-5">
            <Image
              src="/illustrations/personality-spectrum.svg"
              alt="SBTI 人格维度插画"
              width={1200}
              height={960}
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="h-auto w-full rounded-[1.75rem]"
            />
          </div>
        </section>

        <div className="mt-10">
          <StartTestPanel />
        </div>

        <footer className="mt-24 text-center text-sm font-medium text-slate-400">
          仅供自我洞察与探索，不作为专业医学或心理学诊断建议。
        </footer>
      </div>
    </main>
  );
}
