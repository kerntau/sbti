'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { createParticipantProfile, isValidQQ, sanitizeNickname, sanitizeQQ } from '@/lib/profile';
import { useTestStore } from '@/store/testStore';

export default function StartTestPanel() {
  const router = useRouter();
  const { startSession } = useTestStore();
  const [nickname, setNickname] = useState('');
  const [qq, setQQ] = useState('');

  const cleanNickname = sanitizeNickname(nickname);
  const cleanQQ = sanitizeQQ(qq);
  const showQQHint = cleanQQ.length > 0 && !isValidQQ(cleanQQ);

  function handleStart(skipProfile: boolean) {
    const profile = skipProfile
      ? null
      : createParticipantProfile({ nickname: cleanNickname, qq: cleanQQ });

    startSession({ forceReset: true, profile });
    router.push('/test');
  }

  return (
    <div className="space-y-3">
      <input
        value={nickname}
        onChange={(e) => setNickname(sanitizeNickname(e.target.value))}
        placeholder="昵称（可选）"
        maxLength={18}
        className="input-field"
      />

      <div>
        <input
          value={qq}
          onChange={(e) => setQQ(sanitizeQQ(e.target.value))}
          inputMode="numeric"
          placeholder="QQ 号（可选，用于头像）"
          maxLength={12}
          className="input-field"
        />
        {showQQHint && (
          <p className="mt-1.5 text-xs text-[var(--danger)]">请输入有效的 QQ 号码</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => handleStart(false)}
        className="btn-primary w-full mt-1"
      >
        开始测试 <ArrowRight className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => handleStart(true)}
        className="w-full text-center text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-1"
      >
        跳过，匿名测试
      </button>
    </div>
  );
}
