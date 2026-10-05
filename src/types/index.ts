export type Role = 'evaluator' | 'po' | 'planner';

export type NodeKey = 'output' | 'short' | 'midlong' | 'contrib' | 'constraint';

export type NodeStatus = 'pending' | 'not_reviewed' | 'editing' | 'confirmed' | 'needs_support' | 'excluded';

export type DecisionType = 'confirm' | 'edit_confirm' | 'support' | 'exclude';

export type StanceType = 'realized' | 'in_progress' | 'expected';

export type SufficiencyType = 'sufficient' | 'needs_more' | 'insufficient';

export type QuoteMatchStatus = 'verified' | 'partial' | 'unverified';

export type MaskingStatus = 'needs_review' | 'masked' | 'cleared';

export type ErrorType = 
  | '성과 과장' 
  | '근거 불일치' 
  | '진술 성격 오분류' 
  | 'PDM 외 추정' 
  | '상충 근거 누락' 
  | '수치·고유명사 불일치'
  | '기타';

export type QuadrantType = 'policy' | 'lead' | 'explore' | 'platform';

export interface Chunk {
  id: string; // e.g. "O1", "S1"
  chunk: string; // e.g. "doc01-p14-para2"
  doc: string;
  ver: string;
  page: number;
  kind: 'internal' | 'external';
  docType: string;
  speaker: string;
  speakerType: 'implementer' | 'partner' | 'evaluator' | 'pm' | 'external';
  text: string;
  contextBefore?: string;
  contextAfter?: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  year: string;
  yearKey: 'cur' | 'prev';
  region: string;
  country: string;
  ministry: string;
  implementer?: string;
  pm_po?: string;
  reviewer?: string;
  pilot: boolean;
  example: boolean;
  status?: NodeStatus;
}

export interface PdmPlanItem {
  t: string;
  ind: string;
}

export interface PdmPlan {
  activity: PdmPlanItem;
  output: PdmPlanItem;
  short: PdmPlanItem;
  mid: PdmPlanItem;
  long: PdmPlanItem;
  impact: PdmPlanItem;
}

export interface DocumentItem {
  id: string;
  name: string;
  cat: string;
  type: string;
  mask: MaskingStatus;
  detect?: string;
  base?: boolean;
  ver: string;
  chunks?: string[];
  hash?: string | null;
  dup?: boolean;
  ingested?: boolean;
}

export interface Claim {
  cid: string;
  group: 'indicator' | 'extra' | 'internal' | 'external';
  text: string;
  quote: Record<string, string>; // chunkId -> quoted text
  link: string;
  limitations: string[];
  sufficiency: SufficiencyType;
}

export interface NodeAiData {
  indicator: { label: string; met: string; tone: 'ok' | 'warn' | 'bad' } | null;
  claims: Claim[];
  unconfirmed: string[];
  suggest?: string;
  errType?: ErrorType;
  reason?: string;
  evalResult?: string;
  supplement?: string;
  note?: string;
  supportReason?: string;
  external?: Array<{
    source: string;
    published_at: string;
    searched_at: string;
    period_relevance: string;
    tier: string;
  }>;
  project_impact?: 'confirmed' | 'unconfirmed' | 'none';
}

export interface NodeState {
  status: NodeStatus;
  text: string;
  ai: string;
  decision?: DecisionType;
  reason?: string;
  by?: string;
  at?: string;
}

export interface Revision {
  id: string;
  node: NodeKey;
  kind: 'ai_initial' | 'reviewer_edit' | 'confirmed';
  text: string;
  by: string;
  at: string;
  model: string;
  prompt: string;
  hash: string | null;
  docVer: string[];
  reason?: string;
}

export interface ReviewAction {
  id: string;
  node: NodeKey;
  decision: DecisionType;
  reason: string;
  actor: string;
  at: string;
  docVer: string[];
}

export interface ErrorCase {
  id: string;
  node: NodeKey;
  type: ErrorType;
  stage: number; // 0: 분류, 1: 개선안 검토, 2: 재검증, 3: 시스템 반영
  fix: string;
  retest: string;
  at: string;
  ai: string;
  final: string;
}

export interface VerificationWarning {
  lv: 'high' | 'mid' | 'info';
  rule: string;
  msg: string;
}

export interface LessonItem {
  tag: string;
  text: string;
  evi: string[];
  state: 'ok' | 'warn' | 'rec';
}

export interface PackageCheckItem {
  sev: 'h' | 'm' | 'l';
  rule: string;
  where: string;
  issue: string;
  fix: string;
}
