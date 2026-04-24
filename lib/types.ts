/**
 * Decyde — shared types for form input, LLM output, and the analysis contract
 * between the /api/analyze route and the React dashboard.
 *
 * Keep this file the single source of truth for the JSON shape returned by
 * the OpenAI call. The prompt in lib/prompt.ts enforces the same schema.
 */

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type RecommendationType =
  | 'AI Agent'
  | 'Copilot'
  | 'Workflow Automation'
  | 'Analytics Only'
  | 'Do Not Automate';

export interface DecydeInput {
  workflowDescription: string;
  industry: string;
  currentProcess: string;
  painPoint: string;
  monthlyVolume: string;
  riskLevel: RiskLevel;
  currentTools: string;
  desiredOutcome: string;
}

export interface AIFitScore {
  score: number; // 0 - 100
  reason: string;
}

export interface Recommendation {
  type: RecommendationType;
  why: string;
}

export interface ROIEstimate {
  hoursSavedMonthly: string;
  costReductionPotential: string;
  implementationComplexity: string;
  adoptionRisk: string;
}

export interface PRD {
  summary: string;
  userStories: string[];
  successMetrics: string[];
  mvpRoadmap: string[];
  backlogPriorities: string[];
}

export interface DecydeAnalysis {
  workflowSummary: string;
  workflowSteps: string[];
  bottlenecks: string[];
  decisionPoints: string[];
  aiFitScore: AIFitScore;
  recommendation: Recommendation;
  risks: string[];
  guardrails: string[];
  roiEstimate: ROIEstimate;
  prd: PRD;
}

export interface AnalyzeSuccess {
  ok: true;
  analysis: DecydeAnalysis;
  model: string;
  latencyMs: number;
}

export interface AnalyzeError {
  ok: false;
  error: string;
  code:
    | 'MISSING_KEY'
    | 'INVALID_INPUT'
    | 'UPSTREAM_ERROR'
    | 'PARSE_ERROR'
    | 'TIMEOUT'
    | 'UNKNOWN';
}

export type AnalyzeResponse = AnalyzeSuccess | AnalyzeError;

/** Lightweight runtime guard used by the API route to validate model output. */
export function isDecydeAnalysis(value: unknown): value is DecydeAnalysis {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  const requiredStrings = ['workflowSummary'];
  for (const k of requiredStrings) {
    if (typeof v[k] !== 'string') return false;
  }
  const requiredArrays = [
    'workflowSteps',
    'bottlenecks',
    'decisionPoints',
    'risks',
    'guardrails',
  ];
  for (const k of requiredArrays) {
    if (!Array.isArray(v[k])) return false;
  }
  if (!v.aiFitScore || typeof v.aiFitScore !== 'object') return false;
  if (!v.recommendation || typeof v.recommendation !== 'object') return false;
  if (!v.roiEstimate || typeof v.roiEstimate !== 'object') return false;
  if (!v.prd || typeof v.prd !== 'object') return false;
  return true;
}
