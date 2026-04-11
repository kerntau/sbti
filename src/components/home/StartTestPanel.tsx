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
    <section id="start-test" className="glass-card-strong rounded-[2rem] p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">开始前可选信息</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">先填一个昵称，想的话再带上 QQ 头像</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 md:text-base">
            这些信息不是必填。填了之后会出现在你的本地结果页和分享卡里；不填也可以直接开始测试。
          </p>
        </div>

        <div className="glass-card rounded-[1.75rem] px-4 py-3 text-sm text-slate-600 lg:max-w-[260px]">
          每次开始测试都会开启新的答题，不会继承上一个访客的信息。
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">昵称</span>
            <input
              value={nickname}
              onChange={(event) => setNickname(sanitizeNickname(event.target.value))}
              placeholder="比如：阿浩、Luna、匿名旅人"
              maxLength={18}
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-base text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">QQ 号</span>
            <input
              value={qq}
              onChange={(event) => setQQ(sanitizeQQ(event.target.value))}
              inputMode="numeric"
              placeholder="输入 QQ 号自动获取头像"
              maxLength={12}
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-base text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            />
            {showQQHint ? (
              <p className="mt-2 text-sm text-amber-600">QQ 号通常是 5 到 12 位数字，当前还不足以获取头像。</p>
            ) : (
              <p className="mt-2 text-sm text-slate-500">我们会用 QQ 号自动拉取头像，仅用于本次结果卡和分享卡展示。</p>
            )}
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleStart(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-600/20 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              带着信息开始测试
            </button>
            <button
              type="button"
              onClick={() => handleStart(true)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-7 py-3.5 text-sm font-semibold text-slate-700 hover:-translate-y-0.5 hover:border-slate-300"
            >
              跳过，直接开始
            </button>
          </div>
        </div>

        <div className="glass-card rounded-[1.9rem] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">分享卡预览信息</p>
          <div className="mt-5 flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 ring-1 ring-slate-200">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="QQ 头像预览"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-blue-600">
                  {(cleanNickname || '匿').slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{cleanNickname || '匿名用户'}</p>
              <p className="mt-1 text-sm text-slate-500">
                {cleanQQ ? `QQ ${cleanQQ}` : '未填写 QQ，将使用默认头像样式'}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
            <p className="text-sm leading-7 text-slate-600">
              结果卡会把昵称和头像一起带上，更适合发朋友或发群里认领结果。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
