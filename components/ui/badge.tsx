import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-950 text-white",
        solar: "border-transparent bg-solar-500 text-slate-900",
        "solar-soft": "border-solar-500/30 bg-solar-50 text-solar-800",
        brand: "border-brand-200 bg-brand-50 text-brand-800",
        ember: "border-ember-200 bg-ember-50 text-ember-800",
        outline: "border-slate-200 bg-white text-slate-700",
        "outline-light": "border-white/25 bg-white/10 text-white backdrop-blur",
        muted: "border-slate-200 bg-slate-100 text-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
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
