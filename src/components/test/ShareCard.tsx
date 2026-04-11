'use client';

import { useEffect, useRef, useState } from 'react';
import { getProfileDisplayName } from '@/lib/profile';
import { TestResult } from '@/types';
import { Download } from 'lucide-react';

interface ShareCardProps {
  result: TestResult;
  onDownload?: () => void;
}

export default function ShareCard({ result, onDownload }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function render() {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      drawCard(ctx, canvas, result);
    }

    render();

    return () => {
      active = false;
    };
  }, [result]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `SBTI-Report-${result.type}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    setDownloaded(true);
    onDownload?.();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={1080}
        height={1400}
        className="w-full max-w-sm rounded bg-white shadow-sm border border-[var(--border-light)]"
      />
      <button
        type="button"
        onClick={handleDownload}
        className={`flex items-center gap-2 rounded-md px-6 py-3 text-xs font-semibold transition-all ${
          downloaded
            ? 'bg-[var(--border-light)] text-[var(--text-muted)] cursor-default'
            : 'bg-[var(--text-primary)] text-white hover:opacity-85'
        }`}
      >
        <Download className="w-4 h-4" />
        {downloaded ? '已保存' : '保存报告图片'}
      </button>
    </div>
  );
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  result: TestResult,
) {
  const W = canvas.width;
  const H = canvas.height;
  const displayName = getProfileDisplayName(result.profile);
  const dateStr = new Date(result.completedAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const PAD = 100;

  ctx.clearRect(0, 0, W, H);

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Outer border
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 3;
  ctx.strokeRect(PAD / 2, PAD / 2, W - PAD, H - PAD);

  // ─── Header ───
  let y = 110;
  ctx.fillStyle = '#1a1a1a';
  ctx.font = '700 30px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('SBTI', PAD, y);

  ctx.fillStyle = '#999';
  ctx.font = '400 20px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, W - PAD, y);

  // Header rule
  y += 24;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // ─── Title ───
  y += 72;
  ctx.fillStyle = '#1a1a1a';
  ctx.font = '700 38px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('认知偏好评估报告', W / 2, y);

  // Subject info
  y += 48;
  ctx.fillStyle = '#888';
  ctx.font = '400 22px "Inter", system-ui, sans-serif';
  ctx.fillText(`受测者: ${displayName}　　置信度: ${Math.round(result.confidence * 100)}%`, W / 2, y);

  // Divider
  y += 40;
  drawRule(ctx, PAD, W - PAD, y, '#d0d0cc');

  // ─── Type Block ───
  y += 100;
  ctx.fillStyle = '#1a1a1a';
  ctx.font = '800 140px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(result.type, W / 2, y);

  y += 56;
  ctx.fillStyle = '#555';
  ctx.font = '500 36px "Inter", system-ui, sans-serif';
  ctx.fillText(`${result.personality.name} · ${result.personality.slang}`, W / 2, y);

  y += 48;
  ctx.fillStyle = '#999';
  ctx.font = '400 24px "Inter", system-ui, sans-serif';
  ctx.fillText(`「${result.personality.tagline}」`, W / 2, y);

  // Divider
  y += 56;
  drawRule(ctx, PAD, W - PAD, y, '#d0d0cc');

  // ─── Axis Section ───
  y += 48;
  ctx.fillStyle = '#1a1a1a';
  ctx.font = '700 22px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('§2　维度分析', W / 2, y);

  y += 50;

  const barW = 700;
  const barX = W / 2 - barW / 2;

  result.axisBreakdown.forEach((axis) => {
    // Axis label
    ctx.fillStyle = '#999';
    ctx.font = '500 18px "Inter", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(axis.label, W / 2, y);

    const labelY = y + 32;

    // Left label
    ctx.textAlign = 'left';
    ctx.fillStyle = axis.percentA >= axis.percentB ? '#1a1a1a' : '#999';
    ctx.font = `${axis.percentA >= axis.percentB ? '700' : '400'} 20px "Inter", system-ui, sans-serif`;
    ctx.fillText(`${axis.labelA} ${axis.percentA}%`, barX, labelY);

    // Right label
    ctx.textAlign = 'right';
    ctx.fillStyle = axis.percentB > axis.percentA ? '#1a1a1a' : '#999';
    ctx.font = `${axis.percentB > axis.percentA ? '700' : '400'} 20px "Inter", system-ui, sans-serif`;
    ctx.fillText(`${axis.labelB} ${axis.percentB}%`, barX + barW, labelY);

    // Bar bg
    const barY = labelY + 16;
    ctx.fillStyle = '#e8e6e1';
    ctx.fillRect(barX, barY, barW, 8);

    // Bar fill
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(barX, barY, (barW * axis.percentA) / 100, 8);

    y += 90;
  });

  // ─── Footer ───
  const footerY = H - PAD / 2 - 24;
  drawRule(ctx, PAD, W - PAD, footerY - 30, '#1a1a1a');

  ctx.fillStyle = '#b0b0b0';
  ctx.font = '400 18px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SBTI 认知偏好评估系统 · 数据仅存于本地', W / 2, footerY);
}

function drawRule(
  ctx: CanvasRenderingContext2D,
  x1: number,
  x2: number,
  y: number,
  color: string,
) {
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
}
