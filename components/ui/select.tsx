import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Select natif stylé — robuste, accessible et léger
 * (préféré à un select custom pour un formulaire de contact).
 */
const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-900 shadow-sm transition-colors hover:border-slate-300 focus-visible:border-solar-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500/30 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
});
Select.displayName = "Select";

export { Select };
