'use client';

import { motion } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Workflow,
  BarChart3,
  Ban,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { recommendationStyle } from '@/lib/utils';
import type { Recommendation, RecommendationType } from '@/lib/types';

const ICONS: Record<RecommendationType, React.ComponentType<{ className?: string }>> = {
  'AI Agent': Bot,
  Copilot: Sparkles,
  'Workflow Automation': Workflow,
  'Analytics Only': BarChart3,
  'Do Not Automate': Ban,
};

interface Props {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: Props) {
  const style = recommendationStyle(recommendation.type);
  const Icon = ICONS[recommendation.type as RecommendationType] ?? CheckCircle2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-electric-400" />
            Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`flex items-center gap-3 rounded-lg border p-4 ${style.bg}`}
          >
            <div className={`rounded-md bg-white/5 p-2 ${style.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`${style.color} border-current bg-transparent`}>
                  {recommendation.type}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                {recommendation.why}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
