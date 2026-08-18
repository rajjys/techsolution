import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        /* 16 px sous sm — cf. components/ui/input.tsx, zoom iOS. */
        "flex min-h-[130px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-solar-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500/30 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
        "aria-[invalid=true]:border-ember-400 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-ember-200",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
