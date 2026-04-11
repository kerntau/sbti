'use client';

import { useEffect, useRef, useState } from 'react';
import { getProfileDisplayName, getProfileInitial } from '@/lib/profile';
import { TestResult } from '@/types';

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
      if (!canvasRef.current) {
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      await drawCard(ctx, canvas, result, active);
    }

    render();

    return () => {
      active = false;
    };
  }, [result]);

  function handleDownload() {
    if (!canvasRef.current) {
      return;
    }

    const link = document.createElement('a');
    link.download = `SBTI-${result.type}.png`;
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
        height={1350}
        className="w-full max-w-sm rounded-[28px] shadow-[0_32px_80px_rgba(15,23,42,0.18)]"
      />
      <button
        type="button"
        onClick={handleDownload}
        className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-200 ${
          downloaded
            ? 'bg-emerald-500 text-white'
            : 'bg-slate-950 text-white hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.18)]'
        }`}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {downloaded ? '分享卡已保存' : '保存分享卡'}
      </button>
    </div>
  );
}

async function drawCard(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  result: TestResult,
  active: boolean
) {
  const width = canvas.width;
  const height = canvas.height;
  const accent = result.personality.color.includes('gradient') ? '#3B82F6' : result.personality.color;
  const displayName = getProfileDisplayName(result.profile);

  ctx.clearRect(0, 0, width, height);

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, '#F8FBFF');
  background.addColorStop(0.55, '#F2F7FF');
  background.addColorStop(1, '#EEF2FF');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  const glowA = ctx.createRadialGradient(160, 180, 20, 160, 180, 280);
  glowA.addColorStop(0, 'rgba(59,130,246,0.18)');
  glowA.addColorStop(1, 'rgba(59,130,246,0)');
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, width, height);

  const glowB = ctx.createRadialGradient(920, 1120, 50, 920, 1120, 360);
  glowB.addColorStop(0, 'rgba(129,140,248,0.18)');
  glowB.addColorStop(1, 'rgba(129,140,248,0)');
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, width, height);

  roundRect(ctx, 60, 58, width - 120, height - 116, 42);
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#94A3B8';
  ctx.font = '700 26px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('SBTI PERSONALITY SNAPSHOT', 106, 118);

  await drawProfileHeader(ctx, result, displayName, active);

  ctx.fillStyle = accent;
  ctx.font = '900 138px Arial';
  ctx.fillText(result.type, 104, 340);

  ctx.fillStyle = '#0F172A';
  ctx.font = '700 52px Arial';
  ctx.fillText(result.personality.name, 108, 412);

  ctx.fillStyle = '#475569';
  ctx.font = '700 34px Arial';
  ctx.fillText(`「${result.personality.slang}」`, 108, 460);

  ctx.fillStyle = '#64748B';
  ctx.font = '30px Arial';
  wrapText(ctx, result.personality.tagline, 108, 520, width - 216, 44);

  const metrics = [
    `稳定度 ${Math.round(result.confidence * 100)}%`,
    `时长 ${Math.max(1, Math.round(result.durationMs / 60000))} 分钟`,
  ];

  metrics.forEach((item, index) => {
    roundRect(ctx, 108 + index * 230, 610, 204, 58, 28);
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(226,232,240,1)';
    ctx.stroke();
    ctx.fillStyle = '#334155';
    ctx.font = '700 22px Arial';
    ctx.fillText(item, 132 + index * 230, 648);
  });

  ctx.fillStyle = '#94A3B8';
  ctx.font = '700 22px Arial';
  ctx.fillText('四维趋势', 108, 748);

  let top = 790;
  result.axisBreakdown.forEach((axis) => {
    drawAxisRow(ctx, {
      top,
      label: axis.label,
      left: `${axis.labelA} ${axis.percentA}%`,
      right: `${axis.labelB} ${axis.percentB}%`,
      percentA: axis.percentA,
    });
    top += 112;
  });

  roundRect(ctx, 108, 1190, width - 216, 108, 30);
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(226,232,240,1)';
  ctx.stroke();

  ctx.fillStyle = '#3B82F6';
  ctx.font = '700 22px Arial';
  ctx.fillText('一句总结', 134, 1230);

  ctx.fillStyle = '#0F172A';
  ctx.font = '28px Arial';
  wrapText(ctx, result.highlights[0], 134, 1270, width - 268, 36);
}

async function drawProfileHeader(
  ctx: CanvasRenderingContext2D,
  result: TestResult,
  displayName: string,
  active: boolean
) {
  const avatarX = 108;
  const avatarY = 150;
  const avatarSize = 96;

  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  let drewAvatar = false;
  if (result.profile?.avatarUrl) {
    try {
      const image = await loadImage(result.profile.avatarUrl);
      if (active) {
        ctx.drawImage(image, avatarX, avatarY, avatarSize, avatarSize);
        drewAvatar = true;
      }
    } catch {
      drewAvatar = false;
    }
  }

  if (!drewAvatar) {
    const fallback = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize);
    fallback.addColorStop(0, '#DBEAFE');
    fallback.addColorStop(1, '#E0E7FF');
    ctx.fillStyle = fallback;
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    ctx.fillStyle = '#2563EB';
    ctx.font = '700 34px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(getProfileInitial(result.profile), avatarX + avatarSize / 2, avatarY + 58);
    ctx.textAlign = 'left';
  }
  ctx.restore();

  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.font = '700 30px Arial';
  ctx.fillText(displayName, 224, 192);

  ctx.fillStyle = '#64748B';
  ctx.font = '24px Arial';
  ctx.fillText(result.profile?.qq ? `QQ ${result.profile.qq}` : '匿名分享卡', 224, 228);
}

function drawAxisRow(
  ctx: CanvasRenderingContext2D,
  payload: { top: number; label: string; left: string; right: string; percentA: number }
) {
  ctx.fillStyle = '#64748B';
  ctx.font = '700 20px Arial';
  ctx.fillText(payload.label, 108, payload.top);

  ctx.fillStyle = '#0F172A';
  ctx.font = '700 24px Arial';
  ctx.fillText(payload.left, 108, payload.top + 34);
  ctx.textAlign = 'right';
  ctx.fillText(payload.right, 972, payload.top + 34);
  ctx.textAlign = 'left';

  roundRect(ctx, 108, payload.top + 56, 864, 16, 8);
  ctx.fillStyle = 'rgba(226,232,240,0.9)';
  ctx.fill();

  roundRect(ctx, 108, payload.top + 56, (864 * payload.percentA) / 100, 16, 8);
  ctx.fillStyle = '#3B82F6';
  ctx.fill();
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const characters = [...text];
  let line = '';
  let offsetY = 0;

  characters.forEach((char, index) => {
    const testLine = `${line}${char}`;
    const width = ctx.measureText(testLine).width;

    if (width > maxWidth && line) {
      ctx.fillText(line, x, y + offsetY);
      line = char;
      offsetY += lineHeight;
      return;
    }

    line = testLine;

    if (index === characters.length - 1) {
      ctx.fillText(line, x, y + offsetY);
    }
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
