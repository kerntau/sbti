import { questions } from '@/data/questions';
import { dimensionPairs, personalityTypes } from '@/data/personality-types';
import { AxisBreakdown, PersonalityType, SharePayload, TestResult, TraitCode } from '@/types';

const traitCodes: TraitCode[] = ['E', 'I', 'N', 'S', 'T', 'F', 'J', 'P'];
const questionMap = new Map(questions.map((question) => [question.id, question]));

export type ScoringResult = TestResult;

function clampConfidence(value: number) {
  return Math.max(0, Math.min(1, value));
}

function createFallbackPersonality(type: string): PersonalityType {
  return {
    code: type,
    name: type,
    slang: '未命名人格',
    tagline: '这次的结果超出了预设人格字典',
    description: '你的答题结果可以被正常计算，只是当前人格文案字典里还没有对应条目。',
    strengths: ['思路清晰', '有自己的判断'],
    weaknesses: ['结果文案待补充'],
    communication: '先结合四维趋势理解自己，再回到测试重新确认一次结果。',
    color: '#2563EB',
  };
}

function describeAxis(axis: AxisBreakdown) {
  if (axis.margin <= 8) {
    return `你在${axis.label}上很平衡，${axis.labelA}和${axis.labelB}会随着场景切换。`;
  }

  if (axis.margin <= 24) {
    return `你略偏${axis.dominantLabel}，多数时候会自然表现出「${axis.dominantSlang}」的一面。`;
  }

  return `你在${axis.label}上明显偏${axis.dominantLabel}，这种倾向已经成了你的稳定风格。`;
}

function encodeBase64Url(value: string) {
  const base64 = typeof window === 'undefined'
    ? Buffer.from(value, 'utf8').toString('base64')
    : window.btoa(value);

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const decoded = normalized + padding;

  return typeof window === 'undefined'
    ? Buffer.from(decoded, 'base64').toString('utf8')
    : window.atob(decoded);
}

export function calculateResult(answers: Record<string, string>): ScoringResult {
  const rawScores = Object.fromEntries(traitCodes.map((trait) => [trait, 0])) as Record<TraitCode, number>;
  let answeredCount = 0;

  for (const [questionId, optionKey] of Object.entries(answers)) {
    const question = questionMap.get(questionId);
    if (!question) {
      continue;
    }

    const option = question.options.find((item) => item.key === optionKey);
    if (!option) {
      continue;
    }

    answeredCount += 1;

    for (const [trait, score] of Object.entries(option.scores) as [TraitCode, number][]) {
      rawScores[trait] += score;
    }
  }

  const axisBreakdown: AxisBreakdown[] = dimensionPairs.map((pair) => {
    const scoreA = rawScores[pair.traitA] ?? 0;
    const scoreB = rawScores[pair.traitB] ?? 0;
    const total = scoreA + scoreB;
    const ratioA = total > 0 ? scoreA / total : 0.5;
    const percentA = Math.round(ratioA * 100);
    const percentB = 100 - percentA;
    const dominantTrait = percentA >= percentB ? pair.traitA : pair.traitB;
    const dominantLabel = dominantTrait === pair.traitA ? pair.labelA : pair.labelB;
    const dominantSlang = dominantTrait === pair.traitA ? pair.slangA : pair.slangB;
    const margin = Math.abs(percentA - percentB);
    const leaning = margin <= 8 ? 'balanced' : margin <= 24 ? 'moderate' : 'strong';

    const axis: AxisBreakdown = {
      axis: pair.axis,
      label: pair.label,
      traitA: pair.traitA,
      traitB: pair.traitB,
      labelA: pair.labelA,
      labelB: pair.labelB,
      slangA: pair.slangA,
      slangB: pair.slangB,
      percentA,
      percentB,
      dominantTrait,
      dominantLabel,
      dominantSlang,
      margin,
      leaning,
      description: '',
    };

    return {
      ...axis,
      description: describeAxis(axis),
    };
  });

  const type = axisBreakdown.map((item) => item.dominantTrait).join('');
  const personality = personalityTypes[type] ?? createFallbackPersonality(type);
  const avgMargin = axisBreakdown.reduce((sum, item) => sum + item.margin, 0) / axisBreakdown.length;
  const confidence = clampConfidence(avgMargin / 100);
  const strongestAxis = [...axisBreakdown].sort((a, b) => b.margin - a.margin)[0];
  const mostBalancedAxis = [...axisBreakdown].sort((a, b) => a.margin - b.margin)[0];
  const percentages = axisBreakdown.reduce<Partial<Record<TraitCode, number>>>((acc, item) => {
    acc[item.traitA] = item.percentA;
    acc[item.traitB] = item.percentB;
    return acc;
  }, {});

  const highlights = [
    `你最鲜明的特质是${strongestAxis.dominantLabel}，在${strongestAxis.label}上领先 ${strongestAxis.margin}% 。`,
    `你在${mostBalancedAxis.label}上最灵活，说明你会根据环境切换到更合适的节奏。`,
    answeredCount === questions.length
      ? '本次测试题目已全部完成，结果稳定性会比半程退出时更高。'
      : '当前结果基于未完成答题推算，仅适合作为轻量参考。',
  ];

  return {
    type,
    name: personality?.name ?? type,
    slang: personality?.slang ?? '未定义风格',
    scores: percentages,
    confidence,
    personality,
    completedAt: Date.now(),
    durationMs: 0,
    percentages,
    axisBreakdown,
    highlights,
    profile: null,
  };
}

export function buildSharePayload(result: Pick<ScoringResult, 'type' | 'confidence' | 'percentages'>): SharePayload {
  return {
    t: result.type,
    c: Math.round(result.confidence * 100),
    p: result.percentages,
  };
}

export function encodeResult(result: Pick<ScoringResult, 'type' | 'confidence' | 'percentages'>): string {
  return encodeBase64Url(JSON.stringify(buildSharePayload(result)));
}

export function decodeResult(encoded: string): SharePayload | null {
  try {
    const parsed = JSON.parse(decodeBase64Url(encoded)) as SharePayload;

    if (!parsed.t || !personalityTypes[parsed.t]) {
      return null;
    }

    return {
      t: parsed.t,
      c: parsed.c ?? 0,
      p: parsed.p ?? {},
    };
  } catch {
    return null;
  }
}
