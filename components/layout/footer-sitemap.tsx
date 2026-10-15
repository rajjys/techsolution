"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Le plan du site du pied de page — replié sur téléphone, ouvert dès `lg`.
 *
 * Sur un écran de 390 px, ses trois listes coûtaient 519 px à chaque page,
 * pour des liens que le menu de l'en-tête donne déjà. Replié, il ne prend
 * plus qu'une ligne. Les liens restent **dans le HTML** (masqués en CSS, pas
 * démontés) : Google les suit, et ils s'ouvrent au premier toucher.
 */
export function FooterSitemap({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();

  return (
    <div className="py-6 lg:py-9">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-lg py-2 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 lg:hidden"
      >
        Plan du site
        <ChevronDown
          className={cn("size-4 text-brand-300 transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      <div
        id={id}
        className={cn(
          "grid-cols-2 gap-x-8 gap-y-8 pt-5 lg:grid lg:grid-cols-[1fr_1.4fr_1fr] lg:pt-0",
          open ? "grid" : "hidden",
        )}
      >
        {children}
      </div>
    </div>
  );
}
