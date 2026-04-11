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
    link.download = `SBTI-Tarot-${result.type}.png`;
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
        className="w-full max-w-sm rounded-[2px] shadow-[0_0_30px_rgba(206,170,123,0.15)] border border-[var(--line-gold)] border-opacity-30"
      />
      <button
        type="button"
        onClick={handleDownload}
        className={`ghost-btn px-6 py-3 text-[10px] uppercase font-serif tracking-widest mt-4 ${
          downloaded
            ? 'opacity-50 text-[var(--text-muted)] border-[var(--text-muted)]'
            : ''
        }`}
      >
        {downloaded ? '护身符已被铭刻' : '凝结赛博护身符 ✦'}
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

  // Background
  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, '#0a0c10');
  background.addColorStop(0.5, '#050508');
  background.addColorStop(1, '#020203');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  // Gold Glows
  const glowA = ctx.createRadialGradient(160, 180, 20, 160, 180, 400);
  glowA.addColorStop(0, 'rgba(206,170,123,0.15)');
  glowA.addColorStop(1, 'rgba(206,170,123,0)');
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, width, height);

  const glowB = ctx.createRadialGradient(920, 1120, 50, 920, 1120, 500);
  glowB.addColorStop(0, 'rgba(206,170,123,0.1)');
  glowB.addColorStop(1, 'rgba(206,170,123,0)');
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, width, height);

  // Inner border
  ctx.strokeStyle = 'rgba(206,170,123,0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  // Double border
  ctx.strokeStyle = 'rgba(206,170,123,0.1)';
  ctx.strokeRect(70, 70, width - 140, height - 140);

  // Top header text
  ctx.fillStyle = '#8b92a5';
  ctx.font = '300 22px "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText('✧ THE TAROT MATRIX ✧', width / 2, 120);

  // Draw Avatar
  await drawProfileHeader(ctx, result, displayName, active, width);

  // Type Name
  ctx.textAlign = 'center';
  const typeGradient = ctx.createLinearGradient(0, 260, 0, 400);
  typeGradient.addColorStop(0, '#f7e2c0');
  typeGradient.addColorStop(0.5, '#ceaa7b');
  typeGradient.addColorStop(1, '#8c6b41');
  ctx.fillStyle = typeGradient;
  ctx.font = '600 140px "Times New Roman", serif';
  ctx.fillText(result.type, width / 2, 420);

  // Personality Title
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '400 52px "Times New Roman", serif';
  ctx.fillText(result.personality.name, width / 2, 500);

  // Slang
  ctx.fillStyle = '#ceaa7b';
  ctx.font = '300 32px "Times New Roman", serif';
  ctx.fillText(`「${result.personality.slang}」`, width / 2, 560);

  // Description
  ctx.fillStyle = '#8b92a5';
  ctx.font = '300 28px "Times New Roman", serif';
  wrapTextCenter(ctx, result.personality.tagline, width / 2, 630, width - 200, 40);

  // Axis
  let top = 760;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ceaa7b';
  ctx.font = '400 24px "Times New Roman", serif';
  ctx.fillText('✦ 四维能量阵列 ✦', width / 2, 700);

  result.axisBreakdown.forEach((axis) => {
    drawAxisRowDark(ctx, {
      top,
      width,
      label: axis.label,
      left: `${axis.labelA} ${axis.percentA}%`,
      right: `${axis.labelB} ${axis.percentB}%`,
      percentA: axis.percentA,
    });
    top += 100;
  });

  // Footer summary
  ctx.strokeStyle = 'rgba(206,170,123,0.2)';
  ctx.strokeRect(100, 1180, width - 200, 100);

  ctx.fillStyle = '#ceaa7b';
  ctx.font = '400 22px "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText('✧ 宿命揭示 ✧', width / 2, 1220);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '300 26px "Times New Roman", serif';
  ctx.fillText(result.highlights[0], width / 2, 1260);
}

async function drawProfileHeader(
  ctx: CanvasRenderingContext2D,
  result: TestResult,
  displayName: string,
  active: boolean,
  width: number
) {
  const avatarSize = 80;
  const avatarX = width / 2 - avatarSize / 2;
  const avatarY = 160;

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
    ctx.fillStyle = '#0a0c10';
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    ctx.fillStyle = '#ceaa7b';
    ctx.font = '400 30px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText(getProfileInitial(result.profile), avatarX + avatarSize / 2, avatarY + 48);
  }
  ctx.restore();

  ctx.strokeStyle = '#ceaa7b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#ceaa7b';
  ctx.font = '300 24px "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText(displayName, width / 2, avatarY + avatarSize + 40);
}

function drawAxisRowDark(
  ctx: CanvasRenderingContext2D,
  payload: { top: number; width: number; label: string; left: string; right: string; percentA: number }
) {
  const barWidth = 700;
  const barX = payload.width / 2 - barWidth / 2;

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '300 22px "Times New Roman", serif';
  ctx.textAlign = 'left';
  ctx.fillText(payload.left, barX, payload.top + 20);
  
  ctx.textAlign = 'right';
  ctx.fillStyle = '#8b92a5';
  ctx.fillText(payload.right, barX + barWidth, payload.top + 20);

  ctx.fillStyle = '#ceaa7b';
  ctx.textAlign = 'center';
  ctx.font = '300 18px "Times New Roman", serif';
  ctx.fillText(payload.label, payload.width / 2, payload.top - 10);

  // Empty bar
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fillRect(barX, payload.top + 36, barWidth, 4);

  // Fill bar
  const fillGradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
  fillGradient.addColorStop(0, 'rgba(206,170,123,0.3)');
  fillGradient.addColorStop(1, '#ceaa7b');
  ctx.fillStyle = fillGradient;
  ctx.fillRect(barX, payload.top + 36, (barWidth * payload.percentA) / 100, 4);

  // Glow point
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(barX + (barWidth * payload.percentA) / 100, payload.top + 38, 4, 0, Math.PI * 2);
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
