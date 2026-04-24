'use client';

import { motion } from 'framer-motion';
import {
  ListTree,
  AlertTriangle,
  GitFork,
  TrendingUp,
  Clock,
  DollarSign,
  Wrench,
  Users,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreCard } from './ScoreCard';
import { RecommendationCard } from './RecommendationCard';
import { RiskCard } from './RiskCard';
import { PMOutputCard } from './PMOutputCard';
import type { DecydeAnalysis } from '@/lib/types';

interface Props {
  analysis: DecydeAnalysis | null;
  loading: boolean;
}

export function ResultsDashboard({ analysis, loading }: Props) {
  if (loading) return <LoadingState />;
  if (!analysis) return <EmptyState />;

  return (
    <div className="space-y-6">
      <SummaryCard summary={analysis.workflowSummary} />

      <div className="grid gap-6 md:grid-cols-2">
        <ScoreCard score={analysis.aiFitScore} />
        <RecommendationCard recommendation={analysis.recommendation} />
      </div>

      <WorkflowBreakdown
        steps={analysis.workflowSteps}
        bottlenecks={analysis.bottlenecks}
        decisions={analysis.decisionPoints}
      />

      <RiskCard risks={analysis.risks} guardrails={analysis.guardrails} />

      <ROICard roi={analysis.roiEstimate} />

      <PMOutputCard prd={analysis.prd} />
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full min-h-[500px] items-center justify-center"
    >
      <Card className="w-full border-dashed border-white/10 bg-transparent">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-electric-500/30 bg-electric-500/5">
            <Sparkles className="h-6 w-6 text-electric-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              No analysis yet
            </h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Describe a workflow on the left (or try a sample) and hit{' '}
              <span className="text-electric-300">Analyze Workflow</span>. Decyde
              will return a decision-grade report in seconds.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LoadingState() {
  const steps = [
    'Parsing workflow...',
    'Mapping steps & decision points...',
    'Scoring AI fit...',
    'Drafting PM artifacts...',
  ];
  return (
    <Card className="glow-border">
      <CardContent className="space-y-6 py-12">
        <div className="flex items-center justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-electric-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-electric-400" />
            <Loader2 className="h-6 w-6 animate-spin text-electric-400" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white">
            Decyde is thinking...
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Senior-PM-grade analysis in progress. Usually 8-20 seconds.
          </p>
        </div>
        <div className="mx-auto max-w-sm space-y-2">
          {steps.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.35 }}
              className="flex items-center gap-2 text-xs text-slate-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-electric-400 shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
              {s}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryCard({ summary }: { summary: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-electric-400" />
            Workflow Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-slate-200">{summary}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WorkflowBreakdown({
  steps,
  bottlenecks,
  decisions,
}: {
  steps: string[];
  bottlenecks: string[];
  decisions: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTree className="h-5 w-5 text-electric-400" />
            Workflow Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <Column
            title="Steps"
            icon={<ListTree className="h-3.5 w-3.5" />}
            items={steps}
            tone="neutral"
            ordered
          />
          <Column
            title="Bottlenecks"
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            items={bottlenecks}
            tone="warning"
          />
          <Column
            title="Decision Points"
            icon={<GitFork className="h-3.5 w-3.5" />}
            items={decisions}
            tone="info"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Column({
  title,
  icon,
  items,
  tone,
  ordered,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  tone: 'neutral' | 'warning' | 'info';
  ordered?: boolean;
}) {
  const toneClass =
    tone === 'warning'
      ? 'text-amber-300'
      : tone === 'info'
        ? 'text-electric-300'
        : 'text-slate-300';
  const borderClass =
    tone === 'warning'
      ? 'border-amber-500/20 bg-amber-500/5'
      : tone === 'info'
        ? 'border-electric-500/20 bg-electric-500/5'
        : 'border-white/5 bg-white/[0.02]';

  const ListTag = (ordered ? 'ol' : 'ul') as 'ol' | 'ul';

  return (
    <div>
      <div
        className={`mb-3 flex items-center gap-2 text-xs uppercase tracking-wider ${toneClass}`}
      >
        {icon}
        {title}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">None identified.</p>
      ) : (
        <ListTag className="space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className={`rounded-md border px-3 py-2 text-sm text-slate-200 ${borderClass}`}
            >
              {ordered && (
                <span className="mr-2 text-xs font-semibold text-electric-300">
                  {i + 1}.
                </span>
              )}
              {item}
            </li>
          ))}
        </ListTag>
      )}
    </div>
  );
}

function ROICard({
  roi,
}: {
  roi: DecydeAnalysis['roiEstimate'];
}) {
  const items = [
    { label: 'Hours Saved / Month', value: roi.hoursSavedMonthly, icon: Clock },
    { label: 'Cost Reduction', value: roi.costReductionPotential, icon: DollarSign },
    { label: 'Implementation Complexity', value: roi.implementationComplexity, icon: Wrench },
    { label: 'Adoption Risk', value: roi.adoptionRisk, icon: Users },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            ROI Estimate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-4"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-electric-400" />
                  {label}
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  {value || '—'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
