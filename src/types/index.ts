export type TraitCode = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export type AxisCode = 'EI' | 'SN' | 'TF' | 'JP';

export type OptionKey = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Option {
  key: OptionKey;
  label: string;
  scores: Partial<Record<TraitCode, number>>;
}

export interface Question {
  id: string;
  dimension: AxisCode;
  text: string;
  reverseScored: boolean;
  options: Option[];
}

export interface PersonalityType {
  code: string;
  name: string;
  slang: string;
  tagline: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  communication: string;
  color: string;
}

export interface ParticipantProfile {
  nickname: string;
  qq: string;
  avatarUrl: string | null;
}

export interface AxisBreakdown {
  axis: AxisCode;
  label: string;
  traitA: TraitCode;
  traitB: TraitCode;
  labelA: string;
  labelB: string;
  slangA: string;
  slangB: string;
  percentA: number;
  percentB: number;
  dominantTrait: TraitCode;
  dominantLabel: string;
  dominantSlang: string;
  margin: number;
  leaning: 'balanced' | 'moderate' | 'strong';
  description: string;
}

export interface TestResult {
  type: string;
  name: string;
  slang: string;
  scores: Partial<Record<TraitCode, number>>;
  confidence: number;
  personality: PersonalityType;
  completedAt: number;
  durationMs: number;
  percentages: Partial<Record<TraitCode, number>>;
  axisBreakdown: AxisBreakdown[];
  highlights: string[];
  profile: ParticipantProfile | null;
}

export interface TestSession {
  answers: Record<string, string>;
  currentIndex: number;
  startTime: number;
  completed: boolean;
  profile: ParticipantProfile | null;
}

export interface DimensionPair {
  axis: AxisCode;
  label: string;
  traitA: TraitCode;
  traitB: TraitCode;
  labelA: string;
  labelB: string;
  slangA: string;
  slangB: string;
}

export interface SharePayload {
  t: string;
  c: number;
  p: Partial<Record<TraitCode, number>>;
}
