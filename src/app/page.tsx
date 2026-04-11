import StartTestPanel from '@/components/home/StartTestPanel';

export default function HomePage() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-5 py-12 sm:py-16">
      <div className="w-full max-w-[420px]">

        {/* ─── 封面卡片 ─── */}
        <div className="bg-[var(--bg-paper)] border border-[var(--border-light)] sm:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)] px-7 py-10 sm:px-10 sm:py-12">

          {/* 页眉条 */}
          <div className="flex items-center justify-between text-[11px] text-[var(--text-caption)] mb-6">
            <span className="font-medium tracking-wider uppercase">SBTI</span>
            <span className="tabular-nums">{new Date().getFullYear()}</span>
          </div>
          <hr className="border-t-2 border-[var(--text-primary)] mb-8" />

          {/* 标题区 */}
          <header className="text-center mb-10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-4">
              Cognitive Preference Assessment
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-none">
              SBTI
            </h1>
            <div className="mx-auto mt-5 w-10 border-t border-[var(--border-rule)]" />
            <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
              四维认知偏好评估
            </p>
            <p className="mt-1.5 text-xs text-[var(--text-muted)]">
              28 道题 · 约 5 分钟
            </p>
          </header>

          {/* 表单 */}
          <StartTestPanel />

          {/* 页脚 */}
          <hr className="border-t border-[var(--border-rule)] mt-10 mb-4" />
          <div className="flex items-center justify-between text-[10px] text-[var(--text-caption)]">
            <span>数据仅存于本地浏览器</span>
            <span>v0.1</span>
          </div>
        </div>

      </div>
    </main>
  );
}
