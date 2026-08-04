"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Gauge, MapPin } from "lucide-react";

import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/section";
import { DRC_BOUNDS, DRC_OUTLINE } from "@/lib/data/drc";
import { caseStudies, presenceCities } from "@/lib/data/case-studies";
import { cn } from "@/lib/utils";

/* ─── Carte : matrice de points (calculée une fois au chargement du module) ─── */
const W = 560;
const H = 560;
const PAD = 10;
const STEP = 12;
const DOT_R = 3;

function project(lon: number, lat: number): [number, number] {
  const x =
    PAD +
    ((lon - DRC_BOUNDS.west) / (DRC_BOUNDS.east - DRC_BOUNDS.west)) *
      (W - PAD * 2);
  const y =
    PAD +
    ((DRC_BOUNDS.north - lat) / (DRC_BOUNDS.north - DRC_BOUNDS.south)) *
      (H - PAD * 2);
  return [x, y];
}

const OUTLINE = DRC_OUTLINE.map(([lon, lat]) => project(lon, lat));

function pointInPolygon(x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, yi] = OUTLINE[i];
    const [xj, yj] = OUTLINE[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

const DOTS: { x: number; y: number }[] = (() => {
  const out: { x: number; y: number }[] = [];
  for (let x = PAD; x <= W - PAD; x += STEP)
    for (let y = PAD; y <= H - PAD; y += STEP)
      if (pointInPolygon(x, y)) out.push({ x, y });
  return out;
})();

const MapDots = React.memo(function MapDots() {
  return (
    <>
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={DOT_R} className="fill-brand-300" opacity={0.28} />
      ))}
    </>
  );
});

function ReachMap({ activeCity }: { activeCity: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Carte de la RDC — projet mis en avant : ${activeCity}`}
      className="h-full w-full"
    >
      <MapDots />

      {presenceCities.map((city) => {
        const [x, y] = project(city.lon, city.lat);
        if (city.name === activeCity) return null;
        return (
          <g key={city.name}>
            <circle cx={x} cy={y} r={3.6} className="fill-brand-200" />
            <text
              x={x + city.dx}
              y={y + city.dy}
              textAnchor={city.anchor}
              className="fill-brand-200/80 font-sans text-[11px] font-medium"
            >
              {city.name}
            </text>
          </g>
        );
      })}

      {presenceCities
        .filter((c) => c.name === activeCity)
        .map((city) => {
          const [x, y] = project(city.lon, city.lat);
          return (
            <g key={city.name}>
              <circle cx={x} cy={y} r={12} fill="#FFB800" opacity={0.35}>
                <animate attributeName="r" values="7;15;7" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r={6.5} fill="#FFB800" stroke="#15135A" strokeWidth={2.5} />
              <text
                x={x + city.dx}
                y={y + city.dy}
                textAnchor={city.anchor}
                className="fill-white font-sans text-[14px] font-bold"
              >
                {city.name}
              </text>
            </g>
          );
        })}
    </svg>
  );
}

/* ─── Section ─── */

export function CaseStudiesReach() {
  const [index, setIndex] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const reduce = useReducedMotion();
  const active = caseStudies[index];

  const go = (next: number) => {
    const n = (next + caseStudies.length) % caseStudies.length;
    setDir(n === index ? 1 : n > index ? 1 : -1);
    setIndex(n);
  };

  return (
    <section className="relative overflow-hidden bg-brand-900 py-14 sm:py-20 lg:py-28">
      <div
        className="absolute -right-40 -top-40 size-[480px] rounded-full bg-solar-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container relative">
        {/* En-tête centré — même grammaire que les autres sections */}
        <Reveal className="text-center">
          <Eyebrow onDark className="justify-center">
            Nos réalisations
          </Eyebrow>
          <h2 className="mx-auto mt-6 text-balance text-[26px] font-bold leading-[1.15] text-white sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[46px] lg:leading-[1.08]">
            Nos réalisations, d&apos;un bout à l&apos;autre de la RDC.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-brand-200 sm:text-base md:text-lg">
            Des installations livrées à travers{" "}
            <span className="font-semibold text-solar-400">9 provinces</span> —
            parcourez nos projets.
          </p>
        </Reveal>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Étude de cas + contrôles du carrousel (gauche) */}
          <div className="order-2 lg:order-1">
            <div className="relative h-[440px] sm:h-[500px] lg:h-[560px]">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={active.slug}
                className="absolute inset-0"
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <Link
                  href={`/references/${active.slug}`}
                  className="group relative block h-full overflow-hidden rounded-3xl transition-all duration-300 
                  hover:ring-4 ring-offset-2 hover:ring-white/45 hover:ring-offset-brand-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-solar-500"
                >
                  <Image
                    src={active.image}
                    alt={active.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    className="object-cover object-center"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/85 via-40% to-brand-950/15"
                    aria-hidden="true"
                  />

                  {/* Badges haut */}
                  <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-brand-950/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-solar-400 backdrop-blur">
                      {active.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-brand-950/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      <Gauge className="size-3.5 text-solar-400" />
                      {active.spec}
                    </span>
                  </div>

                  {/* Contenu bas */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <h3 className="line-clamp-2 text-xl font-bold leading-snug text-white sm:text-2xl lg:text-[28px]">
                      {active.title}
                    </h3>
                    <p className="mt-1.5 text-sm font-semibold text-solar-300">
                      {active.client}
                    </p>
                    <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-brand-100">
                      {active.summary}
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-solar-400">
                        <MapPin className="size-4" />
                        {active.city} — {active.province}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                        Voir le projet
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
            </div>

            {/* Contrôles — rattachés à la carte : progression et navigation
                à gauche, accès au catalogue à droite, sur une seule ligne */}
            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Progression — masquée sous 420 px, faute de place */}
                <div className="hidden items-center gap-1.5 min-[420px]:flex">
                {caseStudies.map((cs, i) => (
                  <button
                    key={cs.slug}
                    onClick={() => go(i)}
                    aria-label={`Projet à ${cs.city}`}
                    aria-current={i === index ? "true" : undefined}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === index
                        ? "w-7 bg-solar-500"
                        : "w-2 bg-white/25 hover:bg-white/50",
                    )}
                  />
                ))}
              </div>

              {/* gap-2.5 : les anneaux de survol (4 px) ne se touchent pas */}
              <div className="flex items-center gap-2.5">
                <CarouselButton
                  label="Projet précédent"
                  onClick={() => go(index - 1)}
                >
                  <ArrowLeft className="size-5" />
                </CarouselButton>
                <CarouselButton
                  label="Projet suivant"
                  onClick={() => go(index + 1)}
                >
                  <ArrowRight className="size-5" />
                </CarouselButton>
              </div>
              </div>

              <Link
                href="/references"
                className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border-2 border-white/25 px-4 text-[15px] font-semibold text-white transition-all duration-200 
                hover:border-white hover:bg-white hover:text-brand-900 hover:ring-4 hover:ring-offset-1 hover:ring-white/30 hover:ring-offset-brand-900 focus-visible:outline-none 
                focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900 sm:px-5"
              >
                Tous les projets
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Carte — masquée sur mobile, à droite sur laptop */}
          <div className="hidden lg:order-2 lg:flex lg:aspect-square lg:w-full lg:items-start lg:justify-center">
            <ReachMap activeCity={active.city} />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Bouton de navigation du carrousel — rectangulaire comme le reste de la
 * page (kits, CTA), avec l'anneau de survol commun.
 */
function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-12 items-center justify-center rounded-xl border-2 border-white/25 text-white transition-all duration-200 
      hover:border-white hover:bg-white hover:text-brand-900 hover:ring-4 hover:ring-offset-1 hover:ring-white/30 hover:ring-offset-brand-900 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900"
    >
      {children}
    </button>
  );
}
