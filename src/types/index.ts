// ── IMSB 十五维度模型类型定义 ──

export type DimensionCode =
  | 'S1' | 'S2' | 'S3'   // 自我模型
  | 'E1' | 'E2' | 'E3'   // 情感模型
  | 'A1' | 'A2' | 'A3'   // 态度模型
  | 'Ac1' | 'Ac2' | 'Ac3' // 行动驱力模型
  | 'So1' | 'So2' | 'So3'; // 社交模型

export type IMSBLevel = 'L' | 'M' | 'H';

export interface QuestionOption {
  label: string;
  value: number; // 1, 2, 3
}

export interface Question {
  id: string;
  dim: DimensionCode;
  text: string;
  options: QuestionOption[];
  special?: boolean;
  kind?: string;
}

export interface DimensionMeta {
  name: string;
  model: string;
}

export interface IMSBPersonalityType {
  code: string;
  cn: string;
  intro: string;
  desc: string;
}

export interface NormalTypePattern {
  code: string;
  pattern: string; // e.g. "HHH-HMH-MHH-HHH-MHM"
}

export interface DimensionExplanation {
  L: string;
  M: string;
  H: string;
}

export interface DimensionResult {
  dim: DimensionCode;
  name: string;
  model: string;
  rawScore: number;
  level: IMSBLevel;
  explanation: string;
}

export interface ParticipantProfile {
  nickname: string;
  qq: string;
  avatarUrl: string | null;
}

export interface TestResult {
  finalType: IMSBPersonalityType;
  modeKicker: string;
  badge: string;
  sub: string;
  special: boolean;
  secondaryType: (NormalTypePattern & IMSBPersonalityType & { distance: number; exact: number; similarity: number }) | null;
  dimensions: DimensionResult[];
  ranked: (NormalTypePattern & IMSBPersonalityType & { distance: number; exact: number; similarity: number })[];
  completedAt: number;
  durationMs: number;
  profile: ParticipantProfile | null;
}

export interface TestSession {
  answers: Record<string, number>;
  currentIndex: number;
  startTime: number;
  completed: boolean;
  profile: ParticipantProfile | null;
}

export interface SharePayload {
  t: string;   // type code
  s: number;   // similarity
  d: Record<string, number>; // dimension raw scores
}
