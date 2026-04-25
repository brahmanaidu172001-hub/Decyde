export interface DecydeInput {
  workflowDescription: string;
  industry?: string;
  currentProcess?: string;
  painPoint?: string;
  desiredOutcome?: string;
}

export interface DecydeAnalysis {
  aiFitScore?: number;
  recommendedApproach?: string;
  why?: string;
  keyBottlenecks?: string[];
  risks?: string[];
  guardrails?: string[];
  roiImpact?: string;
  mvpRoadmap?: string[];
}

export interface AnalyzeSuccess {
  ok: true;
  analysis: DecydeAnalysis | null;
  rawText: string;
  warning?: string;
}

export interface AnalyzeFailure {
  ok: false;
  error: string;
}

export type AnalyzeResponse = AnalyzeSuccess | AnalyzeFailure;
