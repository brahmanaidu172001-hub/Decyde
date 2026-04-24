'use client';

import { motion } from 'framer-motion';
import { FileText, Target, Map, ListOrdered, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PRD } from '@/lib/types';

interface Props {
  prd: PRD;
}

export function PMOutputCard({ prd }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-electric-400" />
            PM-Ready PRD
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Paste-ready artifacts for your next product review.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Section title="Summary" icon={FileText}>
            <p className="text-sm leading-relaxed text-slate-200">{prd.summary}</p>
          </Section>

          <Section title="User Stories" icon={Users}>
            <ul className="space-y-2">
              {prd.userStories.map((s, i) => (
                <li
                  key={i}
                  className="rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-slate-200"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Success Metrics" icon={Target}>
            <div className="grid gap-2 md:grid-cols-2">
              {prd.successMetrics.map((m, i) => (
                <div
                  key={i}
                  className="rounded-md border border-electric-500/20 bg-electric-500/5 px-3 py-2 text-sm text-electric-100"
                >
                  {m}
                </div>
              ))}
            </div>
          </Section>

          <Section title="MVP Roadmap" icon={Map}>
            <ol className="space-y-2">
              {prd.mvpRoadmap.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-md border border-white/5 bg-white/[0.02] p-3 text-sm text-slate-200"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-electric-500/15 text-xs font-bold text-electric-300">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Backlog Priorities" icon={ListOrdered}>
            <ul className="space-y-1.5">
              {prd.backlogPriorities.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-200"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-electric-400" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Section>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-300">
        <Icon className="h-3.5 w-3.5 text-electric-400" />
        {title}
      </div>
      {children}
    </div>
  );
}
