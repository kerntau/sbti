'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getProfileDisplayName } from '@/lib/profile';
import ResultCard from '@/components/test/ResultCard';
import ShareCard from '@/components/test/ShareCard';
import { encodeResult } from '@/lib/scoring';
import { useTestStore } from '@/store/testStore';
import { Loader2, ArrowLeft, Share2, Eye, EyeOff, RotateCcw, Database } from 'lucide-react';

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
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] blueprint-grid">
        <div className="clinical-card px-8 py-6 flex items-center gap-4 bg-white shadow-sm">
          <Loader2 className="w-5 h-5 text-slate-800 animate-spin" />
          <p className="text-xs font-bold font-mono text-slate-600 tracking-widest uppercase">
            [DATA RENDER] Formatting result...
          </p>
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
      title: `${displayName} 的评估档案：${result.type}`,
      text: `${displayName} 测出了 ${result.type} ${result.personality.name}`,
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
    idle: '导出档案链路 (URL)',
    copied: '链路地址已复制',
    shared: '已调起共享接口',
    error: '接口调用失败',
  }[shareStatus];

  return (
    <main className="min-h-screen bg-[#f8fafc] blueprint-grid pb-24 relative">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> 返回系统总控
          </Link>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900">REPORT GENERATED</p>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest mt-1">
              STATUS: FINALIZED
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-8 md:px-8">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <ResultCard result={result} />
        </motion.div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr] relative z-20">
          <div className="clinical-card bg-white p-6 md:p-10 flex flex-col justify-between">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-2 mb-3">
                  <Share2 className="w-3 h-3" /> EXPORT & SHARE
                </p>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">归档与外部接口调起</h2>
                <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-500 font-medium tracking-wide">
                  可以通过生成标准序列号链接在同行间共享评估结果。或通过视觉渲染引擎输出一张适合归档的快照图谱。
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 rounded bg-slate-900 px-6 py-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors w-full sm:w-auto"
                >
                  <Share2 className="w-4 h-4" /> {shareLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setShowShareCard((value) => !value)}
                  className="flex items-center justify-center gap-2 rounded border border-slate-300 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto"
                >
                  {showShareCard ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showShareCard ? '收起快照渲染' : '调起图谱渲染面板'}
                </button>
              </div>
            </div>

            {showShareCard && (
              <div className="mt-10 border-t border-slate-200 pt-10">
                <ShareCard result={result} />
              </div>
            )}
          </div>

          <div className="clinical-card bg-white p-6 md:p-8 flex flex-col justify-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2 flex items-center gap-2">
               <RotateCcw className="w-3 h-3" /> RETRY PROTOCOL
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 font-medium tracking-wide">
              如检测环境存在干扰或受试者状态异常，你可以请求重启分析流程。历史基线档案依然会被系统无缝留存（基于 LocalStorage 隔离机制）。
            </p>
            <button
              type="button"
              onClick={handleRetest}
              className="mt-6 flex items-center justify-center gap-2 rounded bg-slate-100 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors self-start w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4" /> 销毁并重建档案
            </button>
          </div>
        </section>

        {history.length > 1 && (
          <section className="mt-6 clinical-card bg-white p-6 md:p-8 relative z-20">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Database className="w-3 h-3" /> HISTORICAL ARCHIVE (历史留痕)
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {history.slice(1).map((item) => (
                <div key={item.completedAt} className="border border-slate-200 bg-slate-50 px-5 py-4 transition-all hover:bg-white hover:border-slate-300 rounded">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xl font-bold text-slate-900 tracking-tight">{item.type}</p>
                      <p className="text-xs font-bold tracking-widest text-slate-500 mt-1 uppercase">{item.name} / {item.slang}</p>
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-400">
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
