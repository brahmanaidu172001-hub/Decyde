'use client';

import { useState } from 'react';
import type {
  AnalyzeResponse,
  DecydeAnalysis,
  DecydeInput,
} from '@/lib/types';

const SAMPLES: Record<string, DecydeInput> = {
  'Healthcare Call Center': {
    workflowDescription:
      'Inbound patient calls for appointment scheduling, prescription refills, and insurance questions.',
    industry: 'Healthcare',
    currentProcess:
      '20 agents handle ~4000 calls/week. Average handle time 7 minutes. Scheduling and refills happen in the EHR; insurance questions require manual lookup in payer portals.',
    painPoint:
      'Long queues at peak hours; agents repeatedly answer the same 15 questions; after-hours coverage is expensive.',
    desiredOutcome:
      'Cut average handle time by 30% and deflect routine calls to self-service while preserving HIPAA compliance.',
  },
  'Finance Month-End Close': {
    workflowDescription:
      'Consolidate and reconcile accounts across 6 subsidiaries at month end.',
    industry: 'Finance / FP&A',
    currentProcess:
      '4 accountants pull ledgers from NetSuite, reconcile in Excel, post adjusting journal entries, and produce a consolidated trial balance. Close takes 9 business days.',
    painPoint:
      'Manual reconciliation is error-prone; late adjustments cause rework; auditors flag repeat issues.',
    desiredOutcome:
      'Shorten close to 5 business days with a clear audit trail and fewer manual reconciliations.',
  },
  'Recruiting Workflow': {
    workflowDescription:
      'Screen inbound applicants for engineering roles and route qualified candidates to hiring managers.',
    industry: 'Talent / HR',
    currentProcess:
      'Two recruiters triage ~600 applicants/month. Initial screen is resume keyword match plus a 15-minute phone screen. Qualified candidates route to a Greenhouse pipeline.',
    painPoint:
      'Recruiters spend 60% of time on unqualified resumes; hiring managers complain about slow turnaround; strong candidates drop off.',
    desiredOutcome:
      'Triple the share of recruiter time spent on qualified candidates without increasing false rejects.',
  },
};

const EMPTY: DecydeInput = {
  workflowDescription: '',
  industry: '',
  currentProcess: '',
  painPoint: '',
  desiredOutcome: '',
};

export default function Page() {
  const [input, setInput] = useState<DecydeInput>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DecydeAnalysis | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  function update(k: keyof DecydeInput, v: string) {
    setInput((prev) => ({ ...prev, [k]: v }));
  }

  async function analyze() {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setRawText(null);
    setWarning(null);

    // Client-side timeout must be longer than the 30s server timeout.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35_000);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal: controller.signal,
      });
      const data = (await res.json().catch(() => null)) as
        | AnalyzeResponse
        | null;

      if (!data) {
        setError(
          `Server returned a non-JSON response (HTTP ${res.status}).`,
        );
        return;
      }
      if (!data.ok) {
        setError(data.error || 'Unknown error.');
        return;
      }
      setAnalysis(data.analysis);
      setRawText(data.rawText);
      if (data.warning) setWarning(data.warning);
    } catch (e) {
      const err = e as Error;
      if (err?.name === 'AbortError') {
        setError('Request timed out. Try a shorter workflow or test again.');
      } else {
        setError(err?.message ?? 'Network error while contacting /api/analyze.');
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-lg font-semibold tracking-tight text-white">
              Decyde
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-400/80">
              AI Deployment Intelligence System
            </div>
          </div>
          <div className="hidden text-xs text-slate-400 sm:block">
            Decide if AI should exist before you build it.
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Decide if{' '}
            <span className="text-cyan-400">AI should exist</span> before you
            build it.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            Describe a real-world workflow. Decyde evaluates whether it should
            become an AI Agent, a Copilot, plain workflow automation, an
            analytics view — or nothing at all.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <InputPanel
            input={input}
            update={update}
            onAnalyze={analyze}
            loading={loading}
            loadSample={(name) => setInput(SAMPLES[name])}
            reset={() => setInput(EMPTY)}
          />
          <ResultsPanel
            loading={loading}
            error={error}
            analysis={analysis}
            rawText={rawText}
            warning={warning}
          />
        </div>
      </section>

      <footer className="border-t border-white/5 py-6">
        <div className="mx-auto max-w-7xl px-6 text-xs text-slate-500">
          Built with Next.js, TypeScript, Tailwind, and Anthropic Claude.
        </div>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Input panel
// ─────────────────────────────────────────────────────────────────────────────

function InputPanel(props: {
  input: DecydeInput;
  update: (k: keyof DecydeInput, v: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  loadSample: (name: string) => void;
  reset: () => void;
}) {
  const { input, update, onAnalyze, loading, loadSample, reset } = props;
  const sampleNames = Object.keys(SAMPLES);
  const disabled = loading || !input.workflowDescription.trim();

  return (
    <div className="rounded-xl border border-white/5 bg-panel/60 p-5">
      <div className="mb-4">
        <div className="text-sm font-medium text-white">Workflow input</div>
        <div className="mt-1 text-xs text-slate-500">
          Start with a sample or enter your own.
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {sampleNames.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => loadSample(n)}
            className="rounded-md border border-cyan-500/25 bg-cyan-500/5 px-3 py-1.5 text-xs text-cyan-300 transition hover:bg-cyan-500/10"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5"
        >
          Clear
        </button>
      </div>

      <div className="space-y-3">
        <Field label="Workflow description *">
          <textarea
            value={input.workflowDescription}
            onChange={(e) => update('workflowDescription', e.target.value)}
            rows={3}
            placeholder="Describe the workflow you are considering for AI."
            className={textareaCls}
          />
        </Field>
        <Field label="Industry">
          <input
            value={input.industry ?? ''}
            onChange={(e) => update('industry', e.target.value)}
            placeholder="Healthcare, Finance, Talent/HR…"
            className={inputCls}
          />
        </Field>
        <Field label="Current process">
          <textarea
            value={input.currentProcess ?? ''}
            onChange={(e) => update('currentProcess', e.target.value)}
            rows={3}
            placeholder="How is this work done today? Volume, tools, owners."
            className={textareaCls}
          />
        </Field>
        <Field label="Primary pain point">
          <textarea
            value={input.painPoint ?? ''}
            onChange={(e) => update('painPoint', e.target.value)}
            rows={2}
            placeholder="What is actually broken right now?"
            className={textareaCls}
          />
        </Field>
        <Field label="Desired outcome">
          <textarea
            value={input.desiredOutcome ?? ''}
            onChange={(e) => update('desiredOutcome', e.target.value)}
            rows={2}
            placeholder="What does success look like in 90 days?"
            className={textareaCls}
          />
        </Field>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onAnalyze}
        className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Analyzing…' : 'Analyze Workflow'}
      </button>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/30';
const textareaCls = inputCls + ' resize-y';

// ─────────────────────────────────────────────────────────────────────────────
// Results panel
// ─────────────────────────────────────────────────────────────────────────────

function ResultsPanel(props: {
  loading: boolean;
  error: string | null;
  analysis: DecydeAnalysis | null;
  rawText: string | null;
  warning: string | null;
}) {
  const { loading, error, analysis, rawText, warning } = props;

  return (
    <div className="min-h-[480px] rounded-xl border border-white/5 bg-panel/60 p-5">
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorView error={error} />
      ) : analysis ? (
        <Analysis analysis={analysis} warning={warning} />
      ) : rawText ? (
        <RawFallback rawText={rawText} warning={warning} />
      ) : (
        <Empty />
      )}
    </div>
  );
}

function Empty() {
  return (
    <div className="grid h-full place-items-center text-center">
      <div>
        <div className="text-sm font-medium text-slate-300">
          No analysis yet
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Load a sample or describe a workflow, then click Analyze Workflow.
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="grid h-full place-items-center text-center">
      <div>
        <div className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
        <div className="mt-3 text-sm text-slate-300">
          Evaluating workflow with Claude…
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Typically returns in under 10 seconds.
        </div>
      </div>
    </div>
  );
}

function ErrorView({ error }: { error: string }) {
  return (
    <div>
      <div className="inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-red-300">
        Error
      </div>
      <div className="mt-3 text-sm text-red-200">{error}</div>
      <div className="mt-2 text-xs text-slate-500">
        Check the server logs for details. Request IDs are printed as
        [Decyde:xxxxx].
      </div>
    </div>
  );
}

function RawFallback({
  rawText,
  warning,
}: {
  rawText: string;
  warning: string | null;
}) {
  return (
    <div>
      <div className="inline-flex rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-yellow-300">
        Raw response
      </div>
      {warning && (
        <div className="mt-3 text-sm text-yellow-200">{warning}</div>
      )}
      <pre className="mt-3 max-h-[460px] overflow-auto whitespace-pre-wrap rounded-md border border-white/5 bg-black/40 p-3 text-xs text-slate-300">
        {rawText}
      </pre>
    </div>
  );
}

function Analysis({
  analysis,
  warning,
}: {
  analysis: DecydeAnalysis;
  warning: string | null;
}) {
  const score = typeof analysis.aiFitScore === 'number' ? analysis.aiFitScore : null;
  const approach = analysis.recommendedApproach || '—';
  const why = analysis.why || '';
  const bottlenecks = analysis.keyBottlenecks ?? [];
  const risks = analysis.risks ?? [];
  const guardrails = analysis.guardrails ?? [];
  const roi = analysis.roiImpact || '';
  const roadmap = analysis.mvpRoadmap ?? [];

  return (
    <div className="space-y-5">
      {warning && (
        <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-200">
          {warning}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
        <ScoreCard score={score} />
        <ApproachCard approach={approach} why={why} />
      </div>

      <ListCard title="Key Bottlenecks" items={bottlenecks} />
      <TwoColCard
        leftTitle="Risks"
        leftItems={risks}
        rightTitle="Guardrails"
        rightItems={guardrails}
      />
      <TextCard title="ROI / Impact" text={roi} />
      <ListCard title="MVP Roadmap" items={roadmap} ordered />
    </div>
  );
}

function ScoreCard({ score }: { score: number | null }) {
  const pct = Math.max(0, Math.min(100, score ?? 0));
  const hue =
    pct >= 70
      ? 'text-emerald-300'
      : pct >= 50
        ? 'text-cyan-300'
        : pct >= 30
          ? 'text-yellow-300'
          : 'text-red-300';
  return (
    <div className="rounded-lg border border-white/5 bg-black/30 p-4">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">
        AI Fit Score
      </div>
      <div className={`mt-1 text-4xl font-semibold ${hue}`}>
        {score ?? '—'}
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-cyan-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ApproachCard({
  approach,
  why,
}: {
  approach: string;
  why: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-black/30 p-4">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">
        Recommended Approach
      </div>
      <div className="mt-1 text-xl font-semibold text-white">{approach}</div>
      {why && <div className="mt-2 text-sm text-slate-300">{why}</div>}
    </div>
  );
}

function ListCard({
  title,
  items,
  ordered = false,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="rounded-lg border border-white/5 bg-black/30 p-4">
      <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">
        {title}
      </div>
      {ordered ? (
        <ol className="list-decimal space-y-1.5 pl-5">
          {items.map((it, i) => (
            <li key={i} className="text-sm text-slate-200">
              {it}
            </li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc space-y-1.5 pl-5">
          {items.map((it, i) => (
            <li key={i} className="text-sm text-slate-200">
              {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TwoColCard(props: {
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
}) {
  const { leftTitle, leftItems, rightTitle, rightItems } = props;
  if (
    (!leftItems || leftItems.length === 0) &&
    (!rightItems || rightItems.length === 0)
  ) {
    return null;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ListCard title={leftTitle} items={leftItems} />
      <ListCard title={rightTitle} items={rightItems} />
    </div>
  );
}

function TextCard({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <div className="rounded-lg border border-white/5 bg-black/30 p-4">
      <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">
        {title}
      </div>
      <div className="text-sm text-slate-200">{text}</div>
    </div>
  );
}
