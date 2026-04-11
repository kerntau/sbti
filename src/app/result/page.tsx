'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getProfileDisplayName } from '@/lib/profile';
import ResultCard from '@/components/test/ResultCard';
import ShareCard from '@/components/test/ShareCard';
import { encodeResult } from '@/lib/scoring';
import { useTestStore } from '@/store/testStore';

export default function ResultPage() {
  const router = useRouter();
  const { history, resetSession, startSession } = useTestStore();
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'shared' | 'error'>('idle');
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShouldRedirect(true);
    }, 600);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (shouldRedirect && history.length === 0) {
      router.replace('/');
    }
  }, [history.length, router, shouldRedirect]);

  const result = useMemo(() => history[0] ?? null, [history]);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(100%_100%_at_50%_0%,rgba(219,234,254,0.6)_0%,rgba(248,250,252,1)_100%)]">
        <div className="glass-card rounded-full px-5 py-3 text-sm font-semibold text-slate-700">
          正在整理你的结果页...
        </div>
      </div>
    );
  }

  function buildShareUrl() {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    return `${origin}/result/shared?d=${encodeResult(result)}`;
  }

  async function handleShare() {
    const url = buildShareUrl();
    const displayName = getProfileDisplayName(result.profile);
    const sharePayload = {
      title: `${displayName} 的 SBTI 结果：${result.type} ${result.name}`,
      text: `${displayName} 测出了 ${result.type} ${result.name}「${result.slang}」`,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
        setShareStatus('shared');
        return;
      }

      await navigator.clipboard.writeText(url);
      setShareStatus('copied');
    } catch {
      setShareStatus('error');
    }
  }

  function handleRetest() {
    resetSession();
    startSession({
      forceReset: true,
      profile: result.profile,
    });
    router.push('/test');
  }

  const shareLabel = {
    idle: '分享结果链接',
    copied: '链接已复制',
    shared: '已调起分享',
    error: '分享失败，请重试',
  }[shareStatus];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef5ff_100%)] pb-16">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/86 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Result Ready</p>
            <p className="text-sm text-slate-600">{getProfileDisplayName(result.profile)} 的结果已保存到本机历史记录</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <ResultCard result={result} />
        </motion.div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)] md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">分享与扩散</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">把结果发给朋友看看</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
                  你可以直接分享链接，也可以展开分享卡并保存图片。分享链接会带上你的四维百分比结果，不只是一个类型名。
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {shareLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setShowShareCard((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-10h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {showShareCard ? '收起分享卡' : '展开分享卡'}
                </button>
              </div>
            </div>

            {showShareCard && (
              <div className="mt-8 border-t border-slate-200 pt-8">
                <ShareCard result={result} />
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_24px_64px_rgba(15,23,42,0.08)] md:p-5">
            <Image
              src="/illustrations/personality-grid.svg"
              alt="SBTI 维度说明示意图"
              width={1200}
              height={800}
              sizes="(max-width: 1024px) 100vw, 36vw"
              className="h-auto w-full rounded-[24px]"
            />
            <div className="mt-5 rounded-[24px] bg-slate-50 px-5 py-5 ring-1 ring-slate-100">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">重新测试</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                如果你刚才是边想边选，或者想换个心情再测一次，可以重新开始一轮。历史结果会继续保留，方便你对比。
              </p>
              <button
                type="button"
                onClick={handleRetest}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600"
              >
                再测一次
              </button>
            </div>
          </div>
        </section>

        {history.length > 1 && (
          <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)] md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">最近几次结果</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {history.slice(1).map((item) => (
                <div key={item.completedAt} className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xl font-black text-slate-900">{item.type}</p>
                      <p className="text-sm text-slate-500">{item.name} · 「{item.slang}」</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {new Date(item.completedAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
