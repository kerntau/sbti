'use client';

import { useEffect, useRef, useState } from 'react';
import { getProfileDisplayName, getProfileInitial } from '@/lib/profile';
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
      await drawCard(ctx, canvas, result, active);
    }

    render();

    return () => {
      active = false;
    };
  }, [result]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `SBTI-ClinicalReport-${result.type}.png`;
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
        className="w-full max-w-sm rounded bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-200"
      />
      <button
        type="button"
        onClick={handleDownload}
        className={`flex items-center gap-2 rounded px-6 py-3 text-xs font-bold transition-all mt-4 tracking-widest uppercase ${
          downloaded
            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default'
            : 'bg-slate-900 text-white border border-slate-900 shadow hover:bg-slate-800'
        }`}
      >
        <Download className="w-4 h-4" />
        {downloaded ? '图谱已归档' : '输出并保存系统图谱'}
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
  const displayName = getProfileDisplayName(result.profile);

  ctx.clearRect(0, 0, width, height);

  // Background - Pure White
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Blueprint Graph Paper Layer
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= width; x += 40) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += 40) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // Draw Header Line & Block
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, 12);
  ctx.fillRect(60, 60, width - 120, 2);

  ctx.fillStyle = '#0f172a';
  ctx.font = '800 28px "Inter", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('CLINICAL PROFILE REPORT', 60, 110);
  
  ctx.fillStyle = '#64748b';
  ctx.font = '600 20px "Inter", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`ID: ${result.profile?.qq || 'GUEST'}`, width - 60, 110);
  
  // Outer frame
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 140, width - 120, height - 200);

  // Meta info section (Top inside frame)
  ctx.beginPath();
  ctx.moveTo(60, 280);
  ctx.lineTo(width - 60, 280);
  ctx.stroke();

  // Draw Avatar
  await drawProfileHeader(ctx, result, displayName, active);

  // Big Type
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 160px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(result.type, width / 2, 460);

  // Personality Title
  ctx.fillStyle = '#334155';
  ctx.font = '600 48px "Inter", sans-serif';
  ctx.fillText(result.personality.name, width / 2, 540);

  // Slang
  ctx.fillStyle = '#64748b';
  ctx.font = '500 32px "Inter", sans-serif';
  ctx.fillText(`「${result.personality.slang}」`, width / 2, 600);

  // Description
  ctx.fillStyle = '#475569';
  ctx.font = '400 24px "Inter", sans-serif';
  wrapTextCenter(ctx, result.personality.tagline, width / 2, 680, width - 240, 36);

  // Axis divider
  ctx.beginPath();
  ctx.moveTo(120, 780);
  ctx.lineTo(width - 120, 780);
  ctx.strokeStyle = '#e2e8f0';
  ctx.stroke();

  // Axis Header
  let top = 820;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 20px "Inter", sans-serif';
  ctx.fillText('DATA BREAKDOWN', width / 2, top);

  top += 80;

  result.axisBreakdown.forEach((axis) => {
    drawAxisRowClinical(ctx, {
      top,
      width,
      label: axis.label,
      left: `${axis.labelA} ${axis.percentA}%`,
      right: `${axis.labelB} ${axis.percentB}%`,
      percentA: axis.percentA,
    });
    top += 90;
  });

  // Footer
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(60, height - 60, width - 120, 60);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 20px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('STRICT PROTOCOL REPORTING', width / 2, height - 24);
}

async function drawProfileHeader(
  ctx: CanvasRenderingContext2D,
  result: TestResult,
  displayName: string,
  active: boolean
) {
  const avatarSize = 80;
  const avatarX = 100;
  const avatarY = 170;

  ctx.save();
  ctx.beginPath();
  ctx.rect(avatarX, avatarY, avatarSize, avatarSize);
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
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    ctx.fillStyle = '#0f172a';
    ctx.font = '600 36px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(getProfileInitial(result.profile), avatarX + avatarSize / 2, avatarY + 52);
  }
  ctx.restore();

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.strokeRect(avatarX, avatarY, avatarSize, avatarSize);

  ctx.fillStyle = '#0f172a';
  ctx.font = '800 32px "Inter", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(displayName, avatarX + avatarSize + 40, avatarY + 40);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 22px "Inter", monospace';
  ctx.fillText(`CONFIDENCE: ${Math.round(result.confidence * 100)}%`, avatarX + avatarSize + 40, avatarY + 76);
}

function drawAxisRowClinical(
  ctx: CanvasRenderingContext2D,
  payload: { top: number; width: number; label: string; left: string; right: string; percentA: number }
) {
  const barWidth = 720;
  const barX = payload.width / 2 - barWidth / 2;

  ctx.fillStyle = '#0f172a';
  ctx.font = '700 22px "Inter", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(payload.left, barX, payload.top + 20);
  
  ctx.textAlign = 'right';
  ctx.fillStyle = '#64748b';
  ctx.fillText(payload.right, barX + barWidth, payload.top + 20);

  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.font = '800 18px "Inter", monospace';
  ctx.fillText(payload.label, payload.width / 2, payload.top - 10);

  // Empty bar
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(barX, payload.top + 36, barWidth, 10);

  // Fill bar
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(barX, payload.top + 36, (barWidth * payload.percentA) / 100, 10);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function wrapTextCenter(
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

  ctx.textAlign = 'center';

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
