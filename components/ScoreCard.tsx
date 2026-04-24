'use client';

import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clamp, scoreColor } from '@/lib/utils';
import type { AIFitScore } from '@/lib/types';

interface Props {
  score: AIFitScore;
}

export function ScoreCard({ score }: Props) {
  const value = clamp(Math.round(score.score));
  const palette = scoreColor(value);
  const circumference = 2 * Math.PI * 54;
  const dash = (value / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`glow-border ${palette.bg}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-electric-400" />
            AI Fit Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
              <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-white/5"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className={palette.text}
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${dash} ${circumference}` }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-4xl font-bold ${palette.text}`}>
                  {value}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  / 100
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${palette.bg} ${palette.text} ${palette.ring}`}
              >
                {palette.label}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {score.reason}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
