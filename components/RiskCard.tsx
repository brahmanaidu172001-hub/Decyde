'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  risks: string[];
  guardrails: string[];
}

export function RiskCard({ risks, guardrails }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" />
            Risks &amp; Guardrails
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-rose-300">
              <ShieldAlert className="h-3.5 w-3.5" />
              Risks
            </div>
            {risks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No major risks identified.</p>
            ) : (
              <ul className="space-y-2">
                {risks.map((r, i) => (
                  <li
                    key={i}
                    className="rounded-md border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-sm text-slate-200"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Guardrails
            </div>
            {guardrails.length === 0 ? (
              <p className="text-sm text-muted-foreground">No guardrails specified.</p>
            ) : (
              <ul className="space-y-2">
                {guardrails.map((g, i) => (
                  <li
                    key={i}
                    className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-slate-200"
                  >
                    {g}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
