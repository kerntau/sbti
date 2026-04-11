import { questions } from '@/data/questions';
import {
  dimensionMeta,
  dimensionOrder,
  dimensionExplanations,
  normalTypes,
  typeLibrary,
} from '@/data/personality-types';
import {
  DimensionCode,
  DimensionResult,
  IMSBLevel,
  SharePayload,
  TestResult,
} from '@/types';

// ── 原始分 → 等级 ──
function sumToLevel(score: number): IMSBLevel {
  if (score <= 3) return 'L';
  if (score === 4) return 'M';
  return 'H';
}

function levelNum(level: string): number {
  return { L: 1, M: 2, H: 3 }[level] ?? 2;
}

function parsePattern(pattern: string): string[] {
  return pattern.replace(/-/g, '').split('');
}

// ── 核心计分 ──
export function calculateResult(answers: Record<string, number>): TestResult {
  // 1. 计算各维度原始分
  const rawScores: Record<string, number> = {};
  for (const dim of Object.keys(dimensionMeta)) {
    rawScores[dim] = 0;
  }

  // 只统计常规题（非 special）
  for (const q of questions) {
    if (q.special) continue;
    const val = answers[q.id];
    if (val !== undefined) {
      rawScores[q.dim] += val;
    }
  }

  // 2. 原始分 → L/M/H
  const levels: Record<string, IMSBLevel> = {};
  for (const [dim, score] of Object.entries(rawScores)) {
    levels[dim] = sumToLevel(score);
  }

  // 3. 构造用户向量并匹配
  const userVector = dimensionOrder.map((dim) => levelNum(levels[dim]));

  const ranked = normalTypes.map((type) => {
    const vector = parsePattern(type.pattern).map(levelNum);
    let distance = 0;
    let exact = 0;
    for (let i = 0; i < vector.length; i++) {
      const diff = Math.abs(userVector[i] - vector[i]);
      distance += diff;
      if (diff === 0) exact += 1;
    }
    const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));
    const lib = typeLibrary[type.code];
    return { ...type, ...lib, distance, exact, similarity };
  }).sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    if (b.exact !== a.exact) return b.exact - a.exact;
    return b.similarity - a.similarity;
  });

  const bestNormal = ranked[0];

  // 4. 检查隐藏人格（酒鬼）
  const drunkTriggered = answers['drink_gate_q2'] === 2;

  let finalType = typeLibrary[bestNormal.code];
  let modeKicker = '你的主类型';
  let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`;
  let sub = '维度命中度较高，当前结果可视为你的第一人格画像。';
  let special = false;
  let secondaryType: typeof ranked[0] | null = null;

  if (drunkTriggered) {
    finalType = typeLibrary.DRUNK;
    secondaryType = bestNormal;
    modeKicker = '隐藏人格已激活';
    badge = '匹配度 100% · 酒精异常因子已接管';
    sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。';
    special = true;
  } else if (bestNormal.similarity < 60) {
    finalType = typeLibrary.HHHH;
    modeKicker = '系统强制兜底';
    badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`;
    sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。';
    special = true;
  }

  // 5. 构造 15 维度结果
  const dimensions: DimensionResult[] = dimensionOrder.map((dim) => {
    const level = levels[dim];
    const meta = dimensionMeta[dim];
    const explanation = dimensionExplanations[dim][level];
    return {
      dim: dim as DimensionCode,
      name: meta.name,
      model: meta.model,
      rawScore: rawScores[dim],
      level,
      explanation,
    };
  });

  return {
    finalType,
    modeKicker,
    badge,
    sub,
    special,
    secondaryType,
    dimensions,
    ranked,
    completedAt: Date.now(),
    durationMs: 0,
    profile: null,
  };
}

// ── 分享编解码 ──
function encodeBase64Url(value: string) {
  const base64 = typeof window === 'undefined'
    ? Buffer.from(value, 'utf8').toString('base64')
    : window.btoa(unescape(encodeURIComponent(value)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const decoded = normalized + padding;
  return typeof window === 'undefined'
    ? Buffer.from(decoded, 'base64').toString('utf8')
    : decodeURIComponent(escape(window.atob(decoded)));
}

export function buildSharePayload(result: TestResult): SharePayload {
  const dimScores: Record<string, number> = {};
  for (const d of result.dimensions) {
    dimScores[d.dim] = d.rawScore;
  }
  return {
    t: result.finalType.code,
    s: result.ranked[0]?.similarity ?? 0,
    d: dimScores,
  };
}

export function encodeResult(result: TestResult): string {
  return encodeBase64Url(JSON.stringify(buildSharePayload(result)));
}

export function decodeResult(encoded: string): SharePayload | null {
  try {
    const parsed = JSON.parse(decodeBase64Url(encoded)) as SharePayload;
    if (!parsed.t || !typeLibrary[parsed.t]) return null;
    return { t: parsed.t, s: parsed.s ?? 0, d: parsed.d ?? {} };
  } catch {
    return null;
  }
}
