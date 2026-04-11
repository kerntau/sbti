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
      <div className="flex min-h-screen items-center justify-center star-grid relative bg-[#050508]">
        <div className="tarot-card rounded-[2rem] px-8 py-7 text-center">
          <p className="mt-4 text-xs font-serif text-[var(--text-gold)] tracking-widest uppercase">星轨解析中...</p>
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
      title: `${displayName} 的本命牌：${result.type} ${result.name}`,
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
    idle: '流传本命星轨 (URL)',
    copied: '星轨印记已复制',
    shared: '已调起星轨流传',
    error: '界域扰动，复制失败',
  }[shareStatus];

  return (
    <main className="min-h-screen star-grid bg-[#050508] pb-24 relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-16 h-96 w-96 rounded-full bg-[rgba(206,170,123,0.06)] blur-[100px]" />
      
      <header className="sticky top-0 z-20 border-b border-[var(--line-gold)] border-opacity-20 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link
            href="/"
            className="ghost-btn px-4 py-2 text-[10px]"
          >
            返回现世
          </Link>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-gold)]">Destiny Revealed</p>
            <p className="text-[10px] text-[var(--text-muted)] tracking-widest mt-1 opacity-70 border-b border-[var(--line-gold)] border-opacity-30 inline-block pb-0.5">
              已将印记烙印于本机界域
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-8 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <ResultCard result={result} />
        </motion.div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr] relative z-20">
          <div className="tarot-card p-6 md:p-10 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-[10px] uppercase font-serif tracking-[0.3em] text-[var(--text-gold)] flex items-center gap-2 opacity-80">
                  <span className="opacity-50 text-[10px]">✧</span> 扩散印记 <span className="opacity-50 text-[10px]">✧</span>
                </p>
                <h2 className="mt-4 text-2xl font-serif text-[var(--text-main)] tracking-widest">让世界见证你的本命牌</h2>
                <p className="mt-3 max-w-xl text-xs leading-relaxed tracking-wider text-[var(--text-muted)] font-light">
                  提取赛博护身符，或通过界域链路邀请他人共赴星盘。分享卡包含深邃的星轨维度。
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  type="button"
                  onClick={handleShare}
                  className="ghost-btn px-6 py-3.5 text-[10px] drop-shadow-[0_0_10px_rgba(206,170,123,0.3)] w-full sm:w-auto"
                >
                  {shareLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setShowShareCard((value) => !value)}
                  className="border border-[var(--text-muted)] border-opacity-30 bg-black/40 text-[var(--text-muted)] px-6 py-3.5 text-[10px] tracking-widest uppercase transition-all hover:border-[var(--line-gold)] hover:text-[var(--text-gold)] w-full sm:w-auto"
                >
                  {showShareCard ? '收起护身符' : '展现护身符 ✦'}
                </button>
              </div>
            </div>

            {showShareCard && (
              <div className="mt-10 border-t border-[var(--line-gold)] border-opacity-30 pt-10">
                <ShareCard result={result} />
              </div>
            )}
          </div>

          <div className="tarot-card p-6 md:p-8 flex flex-col justify-center">
            <p className="text-[10px] font-serif uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 flex items-center gap-2">
               <span className="opacity-50 text-[10px]">✧</span> 重塑命轨
            </p>
            <p className="mt-2 text-xs leading-loose text-[var(--text-main)] font-light tracking-wide opacity-80">
              若这副本命牌未能完全映射你的灵魂，你可以逆转时间沙漏，再次叩问本心。所有历史揭晓的牌面都将被珍藏。
            </p>
            <button
              type="button"
              onClick={handleRetest}
              className="mt-8 ghost-btn px-6 py-3 text-[10px] border-[var(--text-muted)] text-[var(--text-muted)] hover:border-[var(--line-gold)] self-start"
            >
              再次叩问
            </button>
          </div>
        </section>

        {history.length > 1 && (
          <section className="mt-8 tarot-card p-6 md:p-8 relative z-20">
            <p className="text-[10px] font-serif uppercase tracking-[0.3em] text-[var(--text-gold)] mb-6 flex items-center gap-2 opacity-80">
              <span className="opacity-50 text-[10px]">✧</span> 历史印记
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {history.slice(1).map((item) => (
                <div key={item.completedAt} className="border border-[var(--line-gold)] border-opacity-30 bg-black/40 px-5 py-4 transition-all hover:bg-black/60 hover:border-opacity-60">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xl font-serif text-[var(--text-gold)] tracking-widest">{item.type}</p>
                      <p className="text-[10px] tracking-widest text-[var(--text-muted)] mt-1 uppercase">{item.name} · 「{item.slang}」</p>
                    </div>
                    <span className="text-[10px] font-light tracking-widest text-[var(--text-muted)] opacity-60">
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
