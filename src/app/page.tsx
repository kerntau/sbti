import Image from 'next/image';
import Link from 'next/link';
import StartTestPanel from '@/components/home/StartTestPanel';

const facts = [
  { value: '28', label: '命运刻度' },
  { value: '16', label: '本命牌阵' },
  { value: '5 m', label: '窥见真知' },
];

const features = [
  '铭刻真名，降下独属星盘',
  '四维星轨解析，触达潜意识深处',
  '获取灵魂本命牌牌阵图表',
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-20 star-grid">
      {/* 极简金色光晕背景 */}
      <div className="pointer-events-none absolute -left-32 top-16 h-96 w-96 rounded-full bg-[rgba(206,170,123,0.06)] blur-[100px]" />
      <div className="pointer-events-none absolute right-0 top-28 h-96 w-96 rounded-full bg-[rgba(206,170,123,0.04)] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <header className="tarot-card flex items-center justify-between px-5 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--line-gold)] bg-black text-lg font-normal text-[var(--text-gold)] shadow-[0_0_15px_rgba(206,170,123,0.2)]">
              ✧
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.3em] text-[var(--text-gold)]">SBTI</p>
              <p className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase mt-0.5">The Tarot Matrix</p>
            </div>
          </div>
          <Link
            href="#start-test"
            className="ghost-btn px-6 py-2.5 text-xs font-bold"
          >
            开启星盘
          </Link>
        </header>

        <section className="flex flex-col items-center pb-10 pt-20 text-center md:pt-32">
          <div className="flex items-center gap-3 px-4 py-2 text-xs tracking-[0.3em] text-[var(--text-gold)] uppercase opacity-80">
            <span>✧</span>
            <span>探寻自我边界的仪式</span>
            <span>✧</span>
          </div>

          <h1 className="text-balance mt-8 max-w-5xl text-5xl font-normal tracking-wider text-white sm:text-6xl lg:text-7xl">
            抽引属于你的
            <span className="mt-4 block bg-gradient-to-r from-[#ceaa7b] via-[#f7e2c0] to-[#ceaa7b] bg-clip-text text-transparent">
              灵魂本命牌
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-loose tracking-wide text-[var(--text-muted)] md:text-lg font-light">
            摒弃单薄的性格标签，通过 28 道灵魂叩问，重新解构你的能量源泉、感知偏离与命运节奏。
          </p>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-8">
            <Link
              href="#start-test"
              className="ghost-btn px-10 py-4 text-sm font-bold shadow-[0_0_30px_rgba(206,170,123,0.15)]"
            >
              准备仪式 ✦
            </Link>
            <div className="text-xs tracking-widest text-[var(--text-muted)] border-l border-[var(--line-gold)] pl-6 py-2">
              无需契约<br/>
              星轨印记自动留存
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center mt-16">
          <div className="grid gap-6">
            <div className="grid gap-6 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="tarot-card p-8 text-center flex flex-col items-center justify-center">
                  <p className="text-4xl text-[var(--text-gold)] font-serif mb-3">✧ {fact.value} ✧</p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                    {fact.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="tarot-card p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)] mb-8 flex items-center gap-4">
                <span className="w-12 h-[1px] bg-[var(--line-gold)] opacity-50"></span>
                星盘解析矩阵
                <span className="w-12 h-[1px] bg-[var(--line-gold)] opacity-50"></span>
              </p>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={feature} className="flex items-center gap-5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border border-[var(--line-gold)] text-xs text-[var(--text-gold)] bg-black/40 shadow-[inset_0_0_10px_rgba(206,170,123,0.1)] font-serif">
                      {['I', 'II', 'III'][index]}
                    </div>
                    <p className="text-sm tracking-widest text-[var(--text-main)] font-light">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="tarot-card p-6 md:p-8 flex items-center justify-center aspect-square relative min-h-[400px]">
             {/* 纯 CSS 塔罗同心圆星轨 */}
             <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
               <div className="w-[85%] h-[85%] rounded-full border border-[var(--line-gold)] opacity-30 animate-[spin_60s_linear_infinite]" />
               <div className="absolute w-[65%] h-[65%] rounded-full border border-[var(--line-gold)] opacity-50 border-dashed animate-[spin_40s_linear_infinite_reverse]" />
               <div className="absolute w-[45%] h-[45%] rounded-full border border-[var(--text-gold)] shadow-[0_0_30px_rgba(206,170,123,0.1_inset)] flex items-center justify-center bg-black/20 backdrop-blur-sm">
                 <div className="w-[80%] h-[80%] border-[0.5px] border-[var(--line-gold)] transform rotate-45 flex items-center justify-center">
                    <span className="text-4xl text-[var(--text-gold)] transform -rotate-45 block opacity-80">✦</span>
                 </div>
               </div>
               
               {/* 装饰线条 */}
               <div className="absolute w-[120%] h-[1px] bg-[var(--line-gold)] opacity-10 transform rotate-45" />
               <div className="absolute w-[120%] h-[1px] bg-[var(--line-gold)] opacity-10 transform -rotate-45" />
               <div className="absolute w-[120%] h-[1px] bg-[var(--line-gold)] opacity-10" />
               <div className="absolute h-[120%] w-[1px] bg-[var(--line-gold)] opacity-10" />
             </div>
          </div>
        </section>

        <div className="mt-20 relative z-10">
          <StartTestPanel />
        </div>

        <footer className="mt-32 pb-12 text-center text-[10px] tracking-widest text-[var(--text-muted)] opacity-50 uppercase">
          ⋆ 仅供灵魂洞察与自我探索 非现代理性诊断 ⋆
        </footer>
      </div>
    </main>
  );
}
