'use client';

import { useEffect, useState } from 'react';
import { TestResult } from '@/types';
import { Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareCardProps {
  result: TestResult;
  onDownload?: () => void;
}

export default function ShareCard({ result, onDownload }: ShareCardProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 延迟以确保 ResultCard 和 Recharts 都已经完全渲染并进行动画
    const timer = setTimeout(() => {
      const node = document.getElementById('result-report-card');
      if (node) {
        html2canvas(node, {
          scale: 2, // 视网膜高清度
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#e8e6e1', // matched with bg-page
        })
          .then((canvas) => {
            setDataUrl(canvas.toDataURL('image/png'));
            setLoading(false);
          })
          .catch((err) => {
            console.error('Failed to generate image:', err);
            setLoading(false);
          });
      }
    }, 800); // 放宽时间以包含 Recharts 的初始进场动画时长 (0.5-0.8s)

    return () => clearTimeout(timer);
  }, [result]);

  function handleDownload() {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `IMSB-${result.finalType.code}.png`;
    link.href = dataUrl;
    link.click();
    onDownload?.();
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {loading ? (
        <div className="w-full aspect-[1/1.4] bg-gray-100 flex flex-col items-center justify-center text-gray-500 rounded-md border border-gray-200 shadow-sm gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm">正在生成高清报表...</span>
        </div>
      ) : (
        <div className="w-full flex justify-center">
          {dataUrl && (
            <img 
              src={dataUrl} 
              alt="Test Result Report" 
              className="max-w-full rounded-md shadow max-h-[85vh] object-contain border border-gray-200"
            />
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 rounded-md px-8 py-3 text-sm font-bold transition-all disabled:opacity-50 bg-black text-white hover:bg-gray-800"
      >
        <Download className="w-4 h-4" />
        保存到相册 / 本地
      </button>
      <p className="text-xs text-gray-400 mt-[-10px]">移动端可直接长按上方图片保存</p>
    </div>
  );
}

function drawRule(ctx: CanvasRenderingContext2D, x1: number, x2: number, y: number, color: string) {
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
}
