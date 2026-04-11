import { ParticipantProfile } from '@/types';

const QQ_PATTERN = /^\d{5,12}$/;

export function sanitizeNickname(value: string) {
  return value.trim().slice(0, 18);
}

export function sanitizeQQ(value: string) {
  return value.replace(/\D/g, '').slice(0, 12);
}

export function isValidQQ(value: string) {
  return QQ_PATTERN.test(value);
}

export function buildQQAvatarUrl(qq: string, size: 140 | 640 = 140) {
  if (!isValidQQ(qq)) {
    return null;
  }

  return `/api/qq-avatar?qq=${qq}&size=${size}`;
}

export function createParticipantProfile(input: {
  nickname?: string;
  qq?: string;
}): ParticipantProfile | null {
  const nickname = sanitizeNickname(input.nickname ?? '');
  const sanitizedQQ = sanitizeQQ(input.qq ?? '');
  const qq = isValidQQ(sanitizedQQ) ? sanitizedQQ : '';
  const avatarUrl = buildQQAvatarUrl(qq, 640);

  if (!nickname && !qq) {
    return null;
  }

  return {
    nickname,
    qq,
    avatarUrl,
  };
}

export function getProfileDisplayName(profile: ParticipantProfile | null | undefined) {
  if (!profile) {
    return '匿名用户';
  }

  if (profile.nickname) {
    return profile.nickname;
  }

  if (profile.qq) {
    return `QQ ${profile.qq}`;
  }

  return '匿名用户';
}

export function getProfileInitial(profile: ParticipantProfile | null | undefined) {
  const name = getProfileDisplayName(profile);
  return name.slice(0, 1).toUpperCase();
}
