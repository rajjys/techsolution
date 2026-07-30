"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";

import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
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

/** Couche de points — rendue une seule fois. */
const MapDots = React.memo(function MapDots() {
  return (
    <>
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={DOT_R} fill="#C7D7EA" />
      ))}
    </>
  );
});

function ReachMap({ activeCity }: { activeCity: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Carte de la RDC — projet mis en avant : ${activeCity}`}
      className="h-auto w-full"
    >
      <MapDots />

      {/* Villes de présence */}
      {presenceCities.map((city) => {
        const [x, y] = project(city.lon, city.lat);
        const isActive = city.name === activeCity;
        if (isActive) return null;
        return (
          <g key={city.name}>
            <circle cx={x} cy={y} r={3.4} fill="#6C95C1" />
            <text
              x={x + city.dx}
              y={y + city.dy}
              textAnchor={city.anchor}
              className="fill-slate-400 font-sans text-[11px] font-medium"
              paintOrder="stroke"
              stroke="#F8FAFC"
              strokeWidth={3}
              strokeLinejoin="round"
            >
              {city.name}
            </text>
          </g>
        );
      })}

      {/* Ville active mise en avant */}
      {presenceCities
        .filter((c) => c.name === activeCity)
        .map((city) => {
          const [x, y] = project(city.lon, city.lat);
          return (
            <g key={city.name}>
              <circle cx={x} cy={y} r={12} fill="#FFB800" opacity={0.3}>
                <animate
                  attributeName="r"
                  values="7;14;7"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.45;0;0.45"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={x}
                cy={y}
                r={6}
                fill="#FFB800"
                stroke="#FFFFFF"
                strokeWidth={2.5}
              />
              <text
                x={x + city.dx}
                y={y + city.dy}
                textAnchor={city.anchor}
                className="fill-navy-950 font-sans text-[14px] font-bold"
                paintOrder="stroke"
                stroke="#FFFFFF"
                strokeWidth={4}
                strokeLinejoin="round"
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
const categoryStyles: Record<string, string> = {
  Solaire: "bg-solar-50 text-solar-800 border-solar-500/30",
  Backup: "bg-navy-50 text-navy-800 border-navy-200",
  Électricité: "bg-amber-50 text-amber-800 border-amber-200",
  Télécoms: "bg-sky-50 text-sky-800 border-sky-200",
  Maintenance: "bg-slate-100 text-slate-700 border-slate-200",
};

export function CaseStudiesReach() {
  const [index, setIndex] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const reduce = useReducedMotion();
  const active = caseStudies[index];

  const go = (next: number) => {
    setDir(next > index || (index === caseStudies.length - 1 && next === 0) ? 1 : -1);
    setIndex((next + caseStudies.length) % caseStudies.length);
  };

  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="container">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold leading-[1.15] text-slate-900 md:text-4xl lg:text-[40px] lg:leading-[1.1]">
            Nos réalisations, d&apos;un bout à l&apos;autre de la RDC.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            Des installations livrées à travers{" "}
            <span className="font-semibold text-slate-800">9 provinces</span>.
            Parcourez nos projets — la carte suit chaque intervention.
          </p>
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Carte — masquée sur mobile */}
          <Reveal className="hidden lg:block">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <ReachMap activeCity={active.city} />
            </div>
          </Reveal>

          {/* Carrousel d'études de cas */}
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.article
                  key={active.slug}
                  custom={dir}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -40 }}
                  transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  <Link href={`/references/${active.slug}`} className="group block">
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={active.image}
                        alt={active.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 52vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        className={cn(
                          "absolute left-4 top-4 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold",
                          categoryStyles[active.category],
                        )}
                      >
                        {active.category}
                      </span>
                    </div>

                    <div className="p-6 lg:p-8">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                        <MapPin className="size-4" />
                        {active.city} — {active.province}
                      </p>
                      <h3 className="mt-2 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-navy-700 lg:text-2xl">
                        {active.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {active.client}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {active.summary}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                        Voir l&apos;étude de cas
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              </AnimatePresence>
            </div>

            {/* Contrôles */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5" aria-label="Projets">
                {caseStudies.map((cs, i) => (
                  <button
                    key={cs.slug}
                    onClick={() => go(i)}
                    aria-label={`Projet à ${cs.city}`}
                    aria-current={i === index ? "true" : undefined}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === index
                        ? "w-6 bg-navy-950"
                        : "w-2 bg-slate-300 hover:bg-slate-400",
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => go(index - 1)}
                  aria-label="Projet précédent"
                  className="flex size-11 items-center justify-center rounded-full border border-slate-300 bg-white text-navy-900 transition-colors hover:border-navy-950 hover:bg-navy-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500"
                >
                  <ArrowLeft className="size-5" />
                </button>
                <button
                  onClick={() => go(index + 1)}
                  aria-label="Projet suivant"
                  className="flex size-11 items-center justify-center rounded-full border border-slate-300 bg-white text-navy-900 transition-colors hover:border-navy-950 hover:bg-navy-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500"
                >
                  <ArrowRight className="size-5" />
                </button>
              </div>
            </div>

            <Button variant="outline" className="mt-8" asChild>
              <Link href="/references">
                Voir tous les projets
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
