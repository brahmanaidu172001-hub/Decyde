import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-electric-500/40 bg-electric-500/10 text-electric-300',
        secondary:
          'border-white/10 bg-white/5 text-slate-300',
        destructive:
          'border-rose-500/40 bg-rose-500/10 text-rose-300',
        success:
          'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
        warning:
          'border-amber-500/40 bg-amber-500/10 text-amber-300',
        outline: 'border-white/10 text-slate-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
