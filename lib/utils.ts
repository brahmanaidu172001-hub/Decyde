import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with conditional logic. shadcn/ui canonical helper. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a number to a [min, max] range — used for the fit score. */
export function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

/** Color ramp for the AI Fit Score: red -> amber -> electric blue -> green. */
export function scoreColor(score: number): {
  bg: string;
  text: string;
  ring: string;
  label: string;
} {
  const s = clamp(score);
  if (s >= 80)
    return {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      ring: 'ring-emerald-500/40',
      label: 'Strong fit',
    };
  if (s >= 60)
    return {
      bg: 'bg-electric-500/10',
      text: 'text-electric-400',
      ring: 'ring-electric-500/40',
      label: 'Promising fit',
    };
  if (s >= 40)
    return {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      ring: 'ring-amber-500/40',
      label: 'Mixed fit',
    };
  return {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    ring: 'ring-rose-500/40',
    label: 'Poor fit',
  };
}

/** Style tokens per recommendation type. */
export function recommendationStyle(type: string) {
  switch (type) {
    case 'AI Agent':
      return { color: 'text-electric-400', bg: 'bg-electric-500/10 border-electric-500/30' };
    case 'Copilot':
      return { color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/30' };
    case 'Workflow Automation':
      return { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    case 'Analytics Only':
      return { color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' };
    case 'Do Not Automate':
      return { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
    default:
      return { color: 'text-slate-300', bg: 'bg-slate-500/10 border-slate-500/30' };
  }
}
