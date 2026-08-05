"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BatteryCharging, Star, SunMedium, Zap } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { kitSegments, kits } from "@/lib/data/kits";
import { buildProductWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Lignes de composition — mêmes pictos que les cartes de l'accueil. */
const SPEC_ROWS = [
  { key: "inverter", icon: Zap, label: "Onduleur" },
  { key: "battery", icon: BatteryCharging, label: "Batterie lithium" },
  { key: "panels", icon: SunMedium, label: "Panneaux" },
] as const;

/** Bornes de chaque segment sur l'échelle, calculées une fois. */
const ZONES = kitSegments.map((segment) => ({
  ...segment,
  count: kits.filter((kit) => kit.segment === segment.id).length,
}));

/**
 * Échelle de puissance — les neuf kits posés sur une même règle, de 650 Va à
 * 30 kVA, avec les trois zones d'usage marquées au-dessus.
 *
 * Le visiteur non technique se situe d'abord (« ma maison » couvre ces
 * quatre crans), puis affine cran par cran. Le modèle tient à vingt kits :
 * on ajoute un cran, on n'ajoute pas une carte à un mur de cartes.
 *
 * Accessibilité : motif `tablist` complet — sélection au clic, aux flèches,
 * et par Origine/Fin ; un seul cran dans l'ordre de tabulation (tabindex
 * mouvant), panneau lié par `aria-labelledby`.
 *
 * L'état est piloté de l'extérieur : le comparatif, plus bas dans la page,
 * renvoie ici en sélectionnant le palier cliqué.
 */
export function PowerLadder({
  index,
  onSelect,
}: {
  index: number;
  onSelect: (index: number) => void;
}) {
  const reduce = useReducedMotion();
  const railRef = React.useRef<HTMLDivElement>(null);
  const stopRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  /* Le premier rendu ne doit pas faire défiler le rail. */
  const mounted = React.useRef(false);

  const active = kits[index];
  const fill = (index / (kits.length - 1)) * 100;

  const select = (next: number, moveFocus = false) => {
    const clamped = Math.min(Math.max(next, 0), kits.length - 1);
    onSelect(clamped);
    if (moveFocus) stopRefs.current[clamped]?.focus({ preventScroll: true });
  };

  /*
   * On fait défiler le rail lui-même, et rien d'autre : `scrollIntoView`
   * remonterait tous les ancêtres scrollables jusqu'au document, ce qui
   * décalait la page entière sur les petits écrans dès qu'on choisissait un
   * palier situé loin à droite.
   */
  React.useEffect(() => {
    const rail = railRef.current;
    const stop = stopRefs.current[index];
    if (!rail || !stop) return;
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    rail.scrollTo({
      left: stop.offsetLeft + stop.offsetWidth / 2 - rail.clientWidth / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [index, reduce]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: kits.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <div>
      {/* ── L'échelle ─────────────────────────────────────────────── */}
      <div
        ref={railRef}
        className="no-scrollbar -mx-5 overflow-x-auto overscroll-x-contain px-5 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0"
      >
        <div className="min-w-[42rem] lg:min-w-0">
          {/* Zones d'usage — on se situe avant de choisir un cran */}
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${kits.length}, minmax(0,1fr))` }}
            aria-hidden="true"
          >
            {ZONES.map((zone) => {
              const isActive = zone.id === active.segment;
              return (
                <div
                  key={zone.id}
                  style={{ gridColumn: `span ${zone.count}` }}
                  className="min-w-0"
                >
                  <p
                    className={cn(
                      "flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] transition-colors",
                      isActive ? "text-brand-700" : "text-slate-400",
                    )}
                  >
                    <zone.icon className="size-3.5 shrink-0" strokeWidth={2.2} />
                    <span className="truncate">{zone.label}</span>
                  </p>
                  <span
                    className={cn(
                      "mt-2 block h-2 rounded-t-md border-x border-t transition-colors",
                      isActive
                        ? "border-brand-300 bg-brand-100/50"
                        : "border-slate-200 bg-slate-100/50",
                    )}
                  />
                </div>
              );
            })}
          </div>

          {/* Rail + crans */}
          <div
            role="tablist"
            aria-label="Puissance du kit solaire"
            aria-orientation="horizontal"
            onKeyDown={onKeyDown}
            className="relative mt-4 grid"
            style={{ gridTemplateColumns: `repeat(${kits.length}, minmax(0,1fr))` }}
          >
            {/* Piste creuse, bornée au centre des crans extrêmes */}
            <div
              className="pointer-events-none absolute top-3 h-[3px] -translate-y-1/2 rounded-full bg-slate-200"
              style={{
                left: `${50 / kits.length}%`,
                right: `${50 / kits.length}%`,
              }}
              aria-hidden="true"
            >
              <motion.div
                className="h-full rounded-full bg-solar-500"
                initial={false}
                animate={{ width: `${fill}%` }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 220, damping: 30 }
                }
              />
            </div>

            {kits.map((kit, i) => {
              const isActive = i === index;
              const isPassed = i < index;
              return (
                <button
                  key={kit.id}
                  ref={(node) => {
                    stopRefs.current[i] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`palier-${kit.id}`}
                  aria-selected={isActive}
                  aria-controls="palier-detail"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => select(i)}
                  className="group flex flex-col items-center gap-2.5 rounded-lg pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  <span className="relative flex h-6 items-center justify-center">
                    {isActive ? (
                      <span
                        className="absolute size-4 animate-pulse-dot rounded-full bg-solar-500/60"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span
                      className={cn(
                        "relative rounded-full transition-all duration-200",
                        isActive
                          ? "size-5 border-[3px] border-solar-500 bg-white"
                          : isPassed
                            ? "size-3 bg-solar-500 group-hover:size-4"
                            : "size-3 bg-slate-300 group-hover:bg-brand-400",
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "whitespace-nowrap font-display text-[13px] font-bold tabular-nums transition-colors",
                      isActive
                        ? "text-slate-900"
                        : "text-slate-500 group-hover:text-brand-700",
                    )}
                  >
                    {kit.power}
                  </span>
                  {kit.featured ? (
                    <Star
                      className={cn(
                        "size-3 transition-colors",
                        isActive ? "text-solar-500" : "text-slate-300",
                      )}
                      fill="currentColor"
                      aria-label="Le plus demandé de son segment"
                    />
                  ) : (
                    <span className="size-3" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Le cran sélectionné ───────────────────────────────────── */}
      <div
        id="palier-detail"
        role="tabpanel"
        aria-labelledby={`palier-${active.id}`}
        tabIndex={0}
        className="relative mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{
              duration: reduce ? 0 : 0.28,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:p-10"
          >
            {/* Identité du palier */}
            <div className="flex min-w-0 flex-col">
              <p className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-100/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">
                  {active.phase} · {active.tier}
                </span>
                {active.featured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-solar-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900">
                    <Star className="size-3" fill="currentColor" aria-hidden="true" />
                    Le plus demandé
                  </span>
                ) : null}
              </p>

              <p className="mt-5 font-display text-[44px] font-bold leading-none text-slate-900 sm:text-[56px]">
                {active.power}
              </p>
              <h3 className="mt-3 text-balance text-lg font-medium leading-relaxed text-slate-600 sm:text-xl">
                {active.outcome}
              </h3>

              {/* Composition — sous la puissance, elle en est la justification */}
              <dl className="mt-7 divide-y divide-slate-100 border-y border-slate-100">
                {SPEC_ROWS.map(({ key, icon: Icon, label }) => (
                  <div
                    key={key}
                    className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:gap-3"
                  >
                    <dt className="inline-flex shrink-0 items-center gap-2 text-[13px] text-slate-500 sm:w-36">
                      <Icon
                        className="size-4 shrink-0 text-solar-600"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      {label}
                    </dt>
                    <dd className="min-w-0 text-[14px] font-semibold text-slate-900">
                      {active[key]}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button variant="card" className="group" asChild>
                  <Link
                    href={`/contact?produit=${encodeURIComponent(active.name)}`}
                  >
                    Demander ce kit
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="neutral" asChild>
                  <a
                    href={buildProductWhatsAppLink(active.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="size-4 text-[#25D366]" />
                    En parler sur WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Ce que ça fait tourner — une liste, pas des étiquettes */}
            <div className="min-w-0 lg:border-l lg:border-slate-200 lg:pl-14">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Ce kit fait tourner
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {active.runs.map((load) => (
                  <li key={load.label} className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-100/60">
                      <load.icon
                        className="size-4 text-brand-700"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="pt-1.5 text-[15px] leading-snug text-slate-700">
                      {load.detail ?? load.label}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-dashed border-slate-200 pt-4 text-[13px] leading-relaxed text-slate-500">
                Simultanément et en continu, réseau coupé. Le détail complet
                du catalogue : {active.usage.toLowerCase()}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
