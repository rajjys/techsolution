import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          /*
           * `text-base` (16 px) sous sm, et non `text-sm` : en deçà de 16 px,
           * Safari iOS zoome à chaque prise de focus et le visiteur doit
           * repincer l'écran entre deux champs. À partir de sm on repasse à
           * 14 px, où le zoom n'existe pas.
           */
          "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-base text-slate-900 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-solar-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500/30 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
          /* Champ en erreur : `ember` reste la couleur d'état du système. */
          "aria-[invalid=true]:border-ember-400 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-ember-200 aria-[invalid=true]:focus-visible:border-ember-500 aria-[invalid=true]:focus-visible:ring-ember-300",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
