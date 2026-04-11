'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildQQAvatarUrl, createParticipantProfile, isValidQQ, sanitizeNickname, sanitizeQQ } from '@/lib/profile';
import { useTestStore } from '@/store/testStore';

export default function StartTestPanel() {
  const router = useRouter();
  const { startSession } = useTestStore();
  const [nickname, setNickname] = useState('');
  const [qq, setQQ] = useState('');

  const cleanNickname = sanitizeNickname(nickname);
  const cleanQQ = sanitizeQQ(qq);
  const avatarPreview = useMemo(() => buildQQAvatarUrl(cleanQQ, 140), [cleanQQ]);
  const showQQHint = cleanQQ.length > 0 && !isValidQQ(cleanQQ);

  function handleStart(skipProfile: boolean) {
    const profile = skipProfile
      ? null
      : createParticipantProfile({ nickname: cleanNickname, qq: cleanQQ });

    startSession({
      forceReset: true,
      profile,
    });

    router.push('/test');
  }

  return (
    <section id="start-test" className="tarot-card p-8 md:p-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-gold)] flex items-center gap-2 opacity-80">
            <span className="w-4 h-[1px] bg-[var(--text-gold)]"></span>
            缔结灵魂印记
          </p>
          <h2 className="mt-4 text-3xl font-serif text-[var(--text-main)] md:text-4xl tracking-wide">
            铭刻真名，或以神秘客之姿降临
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)] tracking-wide font-light">
            所留印记将显现于最终的本命牌阵之上。若心存顾虑，亦可抹去痕迹，直接步入星轨。
          </p>
        </div>

        <div className="border border-[var(--line-gold)] bg-black/40 px-5 py-4 text-xs text-[var(--text-gold)] lg:max-w-[260px] tracking-widest leading-loose">
          每次启程皆为崭新羁绊<br/>前尘往事将被虚空吞噬
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <label className="block">
            <span className="mb-3 block text-xs tracking-[0.2em] text-[var(--text-muted)] font-light">灵魂尊号 (昵称)</span>
            <input
              value={nickname}
              onChange={(event) => setNickname(sanitizeNickname(event.target.value))}
              placeholder="如：寻访者、Luna"
              maxLength={18}
              className="w-full bg-[rgba(10,12,20,0.6)] border border-[var(--line-gold)] px-5 py-4 text-sm text-[var(--text-gold)] outline-none transition-all placeholder:text-[rgba(139,146,165,0.4)] focus:border-[var(--line-gold-strong)] focus:shadow-[0_0_20px_rgba(206,170,123,0.15)] focus:bg-[rgba(15,17,26,0.8)]"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-xs tracking-[0.2em] text-[var(--text-muted)] font-light">界域连接 (QQ号提取幻象)</span>
            <input
              value={qq}
              onChange={(event) => setQQ(sanitizeQQ(event.target.value))}
              inputMode="numeric"
              placeholder="在此注入数字界标"
              maxLength={12}
              className="w-full bg-[rgba(10,12,20,0.6)] border border-[var(--line-gold)] px-5 py-4 text-sm text-[var(--text-gold)] outline-none transition-all placeholder:text-[rgba(139,146,165,0.4)] focus:border-[var(--line-gold-strong)] focus:shadow-[0_0_20px_rgba(206,170,123,0.15)] focus:bg-[rgba(15,17,26,0.8)]"
            />
            {showQQHint ? (
              <p className="mt-3 text-xs tracking-wider text-red-400">界域波动：数字刻度不足以形成稳定连接。</p>
            ) : (
              <p className="mt-3 text-xs tracking-wider text-[var(--text-muted)] font-light opacity-60">仅作最终卡面幻象显影之用，绝不窥探凡尘隐私。</p>
            )}
          </label>

          <div className="flex flex-wrap gap-5 pt-4">
            <button
              type="button"
              onClick={() => handleStart(false)}
              className="ghost-btn px-8 py-3.5 text-xs drop-shadow-[0_0_10px_rgba(206,170,123,0.2)]"
            >
              携印记入局 ✦
            </button>
            <button
              type="button"
              onClick={() => handleStart(true)}
              className="border border-[var(--text-muted)] text-[var(--text-muted)] px-8 py-3.5 text-xs tracking-widest uppercase transition-all hover:border-[var(--text-main)] hover:text-[var(--text-main)] rounded-[2px]"
            >
              隐逸前行
            </button>
          </div>
        </div>

        <div className="border border-[var(--line-soft)] bg-black/20 p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
          {/* 背景暗纹 */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(206,170,123,0.03)_50%,transparent_55%)] bg-[length:10px_10px]" />
          
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] text-center mb-8">
              卡面预现幻象
            </p>
            <div className="flex flex-col items-center gap-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-[2px] border border-[var(--line-gold)] bg-[#050508] shadow-[0_0_20px_rgba(206,170,123,0.1)] p-1">
                <div className="absolute inset-0 m-1 border border-[var(--line-gold)] opacity-30"></div>
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar"
                    fill
                    sizes="96px"
                    className="object-cover p-2"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-serif text-3xl text-[var(--text-gold)]">
                    {(cleanNickname || '匿').slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="font-serif text-xl tracking-widest text-[var(--text-gold)]">{cleanNickname || '无名流浪者'}</p>
                <p className="mt-2 text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
                  {cleanQQ ? `LINK: ${cleanQQ}` : '未连接界域'}
                </p>
              </div>
            </div>

            <div className="mt-8 text-center px-4 py-4 border-t border-[var(--line-gold)] border-opacity-30">
              <p className="text-xs leading-relaxed tracking-wider text-[var(--text-muted)] font-light opacity-80">
                当命运判决落下，你的名字将在此显现。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
