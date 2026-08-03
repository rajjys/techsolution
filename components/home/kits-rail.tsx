"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Rail à défilement horizontal — scroll-snap natif, flèches sur desktop.
 * Les cartes restent des composants serveur : elles arrivent en `children`.
 */
export function KitsRail({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);

  const sync = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
  }, []);

  React.useEffect(() => {
    // rAF plutôt qu'un appel direct : évite un setState synchrone dans l'effet.
    const raf = requestAnimationFrame(sync);
    window.addEventListener("resize", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const step = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const distance = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={sync}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
      >
        {children}
      </div>

      {/* Fondu de droite — signale qu'il reste une carte */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 hidden w-20 bg-gradient-to-l from-[#F4F7FE] via-[#F4F7FE]/70 to-transparent transition-opacity duration-300 lg:block",
          atEnd && "opacity-0",
        )}
      />

      {/* Flèches — desktop uniquement, le tactile utilise le scroll natif */}
      <div className="mt-6 hidden justify-end gap-3 lg:flex">
        <RailButton
          direction="left"
          disabled={atStart}
          onClick={() => step(-1)}
        />
        <RailButton direction="right" disabled={atEnd} onClick={() => step(1)} />
      </div>
    </div>
  );
}

function RailButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Kits précédents" : "Kits suivants"}
      className="flex size-11 items-center justify-center rounded-full border border-slate-300 bg-white text-navy-950 shadow-sm transition-all hover:border-navy-950 hover:bg-navy-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-35"
    >
      <Icon className="size-5" strokeWidth={2.2} />
    </button>
  );
}
