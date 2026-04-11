'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ResultCard from '@/components/test/ResultCard';
import { useTestStore } from '@/store/testStore';
import { Loader2, ArrowLeft, Download, RotateCcw } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function ResultPage() {
  const router = useRouter();
  const { history, resetSession, startSession } = useTestStore();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShouldRedirect(true);
    }, 600);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (shouldRedirect && history.length === 0) {
      router.replace('/');
    }
  }, [history.length, router, shouldRedirect]);

  const result = useMemo(() => history[0] ?? null, [history]);

  if (!result) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--bg-page)]">
        <Loader2 className="w-5 h-5 text-[var(--text-muted)] animate-spin" />
      </div>
    );
  }

  async function handleDownload() {
    if (!printRef.current) return;
    setIsDownloading(true);
    try {
      const url = await toPng(printRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        skipAutoScale: true
      });
      const link = document.createElement('a');
      link.download = `IMSB-${result!.finalType.code}.png`;
      link.href = url;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsDownloading(false);
    }
  }

  function handleRetest() {
    resetSession();
    startSession({ forceReset: true, profile: result.profile });
    router.push('/test');
  }

  return (
    <div className="report-page">
      {/* Navigation */}
      <nav className="max-w-[800px] mx-auto flex items-center justify-between px-5 pt-4 pb-3 md:pt-0 md:pb-4 md:px-1">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> 返回首页
        </Link>
        <span className="text-xs text-[var(--text-caption)]">评估报告</span>
      </nav>

      {/* Report Paper */}
      <motion.div
        className="report-paper bg-white"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="report-content" ref={printRef}>
          <ResultCard result={result} />
        </div>
      </motion.div>

      {/* Actions */}
      <div className="max-w-[800px] mx-auto mt-6 px-5 md:px-1 flex gap-2.5">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="btn-primary flex-1"
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isDownloading ? '生成中...' : '下载报告图片'}
        </button>
      </div>

      {/* Retest */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={handleRetest}
          className="btn-ghost"
        >
          <RotateCcw className="w-3 h-3" /> 重新测试
        </button>
      </div>

      {/* History */}
      {history.length > 1 && (
        <section className="max-w-[800px] mx-auto mt-8 px-5 md:px-1">
          <div className="pt-6 border-t border-[var(--border-light)]">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] mb-4">历史记录</h3>
            <div className="space-y-2">
              {history.slice(1).map((item) => (
                <div key={item.completedAt} className="flex items-center justify-between bg-[var(--bg-paper)] border border-[var(--border-light)] rounded-md px-4 py-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[var(--text-primary)]">{item.finalType.code}</span>
                    <span className="text-xs text-[var(--text-muted)]">{item.finalType.cn}</span>
                  </div>
                  <span className="text-[11px] text-[var(--text-caption)] tabular-nums">
                    {new Date(item.completedAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
