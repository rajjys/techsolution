"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Gauge, MapPin } from "lucide-react";

import { Reveal } from "@/components/motion";
import { DRC_BOUNDS, DRC_OUTLINE } from "@/lib/data/drc";
import { caseStudies, presenceCities } from "@/lib/data/case-studies";
import { cn } from "@/lib/utils";

/* ─── Carte : matrice de points (calculée une fois au chargement du module) ─── */
const W = 560;
const H = 560;
const PAD = 24;
const STEP = 13;
const DOT_R = 2.8;

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
        <circle key={i} cx={d.x} cy={d.y} r={DOT_R} fill="#FFFFFF" opacity={0.14} />
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
            <circle cx={x} cy={y} r={3.6} fill="#93A9C9" />
            <text
              x={x + city.dx}
              y={y + city.dy}
              textAnchor={city.anchor}
              className="fill-[#8FA6C6] font-sans text-[11px] font-medium"
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
              <circle cx={x} cy={y} r={6.5} fill="#FFB800" stroke="#0B192C" strokeWidth={2.5} />
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
const categoryChip: Record<string, string> = {
  Solaire: "bg-solar-500 text-navy-950",
  Backup: "bg-navy-700 text-white",
  Électricité: "bg-amber-500 text-navy-950",
  Télécoms: "bg-sky-600 text-white",
  Maintenance: "bg-slate-600 text-white",
};

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
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-28">
      <div
        className="absolute -right-40 -top-40 size-[480px] rounded-full bg-solar-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container relative">
        {/* En-tête centré */}
        <Reveal className="text-center">
          <h2 className="mx-auto text-3xl font-bold leading-[1.12] text-white md:text-4xl lg:text-[46px] lg:leading-[1.08]">
            Nos réalisations, d&apos;un bout à l&apos;autre de la RDC.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-navy-100/85 md:text-lg">
            Des installations livrées à travers{" "}
            <span className="font-semibold text-white">9 provinces</span> —
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
                  className="group relative block h-full overflow-hidden rounded-3xl ring-1 ring-white/10"
                >
                  <Image
                    src={active.image}
                    alt={active.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/85 via-40% to-navy-950/15"
                    aria-hidden="true"
                  />

                  {/* Badges haut */}
                  <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
                        categoryChip[active.category],
                      )}
                    >
                      {active.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-navy-950/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      <Gauge className="size-3.5 text-solar-400" />
                      {active.spec}
                    </span>
                  </div>

                  {/* Contenu bas */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <h3 className="line-clamp-2 text-2xl font-bold leading-snug text-white lg:text-[28px]">
                      {active.title}
                    </h3>
                    <p className="mt-1.5 text-sm font-semibold text-solar-300">
                      {active.client}
                    </p>
                    <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-navy-100">
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

            {/* Contrôles du carrousel — sous la carte, largeur de la carte */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                {caseStudies.map((cs, i) => (
                  <button
                    key={cs.slug}
                    onClick={() => go(i)}
                    aria-label={`Projet à ${cs.city}`}
                    aria-current={i === index ? "true" : undefined}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === index
                        ? "w-6 bg-solar-500"
                        : "w-2 bg-white/25 hover:bg-white/50",
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => go(index - 1)}
                  aria-label="Projet précédent"
                  className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white hover:text-navy-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500"
                >
                  <ArrowLeft className="size-5" />
                </button>
                <button
                  onClick={() => go(index + 1)}
                  aria-label="Projet suivant"
                  className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white hover:text-navy-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500"
                >
                  <ArrowRight className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Carte — visible aussi sur mobile (avant le carrousel), à droite sur laptop */}
          <div className="order-1 flex h-[320px] items-center justify-center sm:h-[420px] lg:order-2 lg:h-[560px]">
            <ReachMap activeCity={active.city} />
          </div>
        </div>

        {/* CTA de section — fin de section */}
        <div className="mt-10 flex justify-center lg:mt-14">
          <Link
            href="/references"
            className="group inline-flex items-center gap-2 text-base font-semibold text-brand-300 transition-colors hover:text-white"
          >
            Voir tous les projets
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
