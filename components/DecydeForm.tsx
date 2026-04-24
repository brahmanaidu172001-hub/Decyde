'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Stethoscope,
  Calculator,
  Users,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DecydeInput, RiskLevel } from '@/lib/types';

const EMPTY: DecydeInput = {
  workflowDescription: '',
  industry: '',
  currentProcess: '',
  painPoint: '',
  monthlyVolume: '',
  riskLevel: 'Medium',
  currentTools: '',
  desiredOutcome: '',
};

const SAMPLES: Record<string, DecydeInput> = {
  'Healthcare Call Center': {
    workflowDescription:
      'Inbound call center for a regional health system. Patients call to schedule appointments, refill prescriptions, and ask clinical questions. Agents handle 40-60 calls/day each.',
    industry: 'Healthcare',
    currentProcess:
      'Calls are routed via IVR to queues. Agents pull up the EHR, verify identity, navigate 3-5 systems, document notes, and either resolve or escalate to a nurse. Average handle time is 7 minutes.',
    painPoint:
      'Long hold times during peak hours, high agent burnout, inconsistent documentation, and patients repeating information across transfers.',
    monthlyVolume: '~60,000 calls/month',
    riskLevel: 'High',
    currentTools: 'Epic EHR, Genesys Cloud IVR, Salesforce Health Cloud, internal KB wiki',
    desiredOutcome:
      'Reduce average handle time 30%, deflect routine scheduling/refill calls, and give agents an in-call assistant that drafts documentation and surfaces the right KB article.',
  },
  'Finance Month-End Close': {
    workflowDescription:
      'Mid-market SaaS finance team closes the books each month. Accountants reconcile GL accounts, chase missing invoices, investigate variances, and prepare the board package.',
    industry: 'Finance / Accounting',
    currentProcess:
      'Accountants export data from NetSuite into Excel, reconcile against bank statements and AP/AR subledgers, flag variances over $5k, email owners for support, and manually roll results into the board deck.',
    painPoint:
      'Close takes 9 business days. 40% of the time is spent chasing supporting documentation and explaining the same variances to leadership.',
    monthlyVolume:
      '~300 GL account reconciliations, ~150 variance investigations, 1 close per month',
    riskLevel: 'High',
    currentTools: 'NetSuite, Excel, Google Workspace, Slack, DocuSign',
    desiredOutcome:
      'Cut close to 5 business days by automating variance explanations, pre-drafting commentary, and routing supporting-doc requests.',
  },
  'Recruiting Workflow': {
    workflowDescription:
      'In-house recruiting team hiring engineers across 12 open roles. Recruiters source, screen, schedule, and move candidates through structured loops.',
    industry: 'HR / Talent Acquisition',
    currentProcess:
      'Recruiters source in LinkedIn, manually paste candidates into Greenhouse, send outreach, run 30-min phone screens, and coordinate 4-round onsites. Hiring managers leave feedback in Greenhouse scorecards.',
    painPoint:
      'Recruiters spend 60%+ of their time on scheduling logistics and sourcing outreach. Response rates are low, and top candidates drop out waiting for interview slots.',
    monthlyVolume:
      '~2,000 sourced profiles, ~400 outreach messages, ~120 phone screens, ~40 onsites, ~8 hires',
    riskLevel: 'Medium',
    currentTools: 'Greenhouse ATS, LinkedIn Recruiter, Gmail, Google Calendar, Gem',
    desiredOutcome:
      'Automate scheduling and reminder comms, personalize sourcing outreach, and let recruiters focus on candidate relationships and closing.',
  },
};

interface Props {
  onSubmit: (data: DecydeInput) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function DecydeForm({ onSubmit, loading, error }: Props) {
  const [data, setData] = useState<DecydeInput>(EMPTY);

  const update = <K extends keyof DecydeInput>(key: K, value: DecydeInput[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSample = (name: keyof typeof SAMPLES) => {
    setData(SAMPLES[name]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    await onSubmit(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-electric-400" />
            Workflow Input
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Describe the workflow you&apos;re considering for AI. Decyde will
            decide whether AI actually belongs here.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="mr-1 text-xs uppercase tracking-wider text-muted-foreground">
              Try:
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSample('Healthcare Call Center')}
              disabled={loading}
            >
              <Stethoscope className="h-3.5 w-3.5" />
              Healthcare Call Center
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSample('Finance Month-End Close')}
              disabled={loading}
            >
              <Calculator className="h-3.5 w-3.5" />
              Finance Month-End Close
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSample('Recruiting Workflow')}
              disabled={loading}
            >
              <Users className="h-3.5 w-3.5" />
              Recruiting Workflow
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Workflow Description" required>
              <Textarea
                rows={3}
                value={data.workflowDescription}
                onChange={(e) => update('workflowDescription', e.target.value)}
                placeholder="e.g., Inbound support for a regional health system; agents handle scheduling, refills, and triage."
                required
              />
            </Field>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Industry">
                <Input
                  value={data.industry}
                  onChange={(e) => update('industry', e.target.value)}
                  placeholder="Healthcare, Finance, Retail..."
                />
              </Field>
              <Field label="Monthly Volume">
                <Input
                  value={data.monthlyVolume}
                  onChange={(e) => update('monthlyVolume', e.target.value)}
                  placeholder="e.g., ~60,000 calls/month"
                />
              </Field>
            </div>

            <Field label="Current Process (How it works today)">
              <Textarea
                rows={3}
                value={data.currentProcess}
                onChange={(e) => update('currentProcess', e.target.value)}
                placeholder="Walk through the actual steps, systems, handoffs, and time spent."
              />
            </Field>

            <Field label="Primary Pain Point">
              <Textarea
                rows={2}
                value={data.painPoint}
                onChange={(e) => update('painPoint', e.target.value)}
                placeholder="What hurts the most? Cost, latency, error rate, burnout, compliance, revenue leak..."
              />
            </Field>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Risk Level">
                <Select
                  value={data.riskLevel}
                  onValueChange={(v) => update('riskLevel', v as RiskLevel)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low — mistakes are cheap</SelectItem>
                    <SelectItem value="Medium">Medium — mistakes cost money</SelectItem>
                    <SelectItem value="High">High — mistakes harm people / regulated</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Current Tools / Systems">
                <Input
                  value={data.currentTools}
                  onChange={(e) => update('currentTools', e.target.value)}
                  placeholder="Salesforce, Epic, NetSuite, Slack..."
                />
              </Field>
            </div>

            <Field label="Desired Outcome">
              <Textarea
                rows={2}
                value={data.desiredOutcome}
                onChange={(e) => update('desiredOutcome', e.target.value)}
                placeholder="What does success look like in 90 days?"
              />
            </Field>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading || data.workflowDescription.trim().length < 20}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing workflow...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Workflow
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="ml-1 text-electric-400">*</span>}
      </Label>
      {children}
    </div>
  );
}
