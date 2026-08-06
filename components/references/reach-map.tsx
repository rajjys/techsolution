import * as React from "react";

import { DRC_BOUNDS, DRC_OUTLINE } from "@/lib/data/drc";
import { presenceCities } from "@/lib/data/case-studies";

/* ─── Matrice de points, calculée une fois au chargement du module ─── */
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
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={DOT_R}
          className="fill-brand-300"
          opacity={0.28}
        />
      ))}
    </>
  );
});

/**
 * Carte de la RDC en matrice de points — pensée pour les fonds sombres
 * (`brand-900` / `brand-950`), d'où les teintes claires.
 *
 * `activeCity` : une ville est mise en avant, halo pulsé, les autres restent
 * en retrait — c'est le mode du carrousel de l'accueil, qui suit le projet
 * affiché. Sans `activeCity`, toutes les villes livrées sont marquées de la
 * même façon : la carte dit alors la couverture, pas un projet.
 */
export function ReachMap({
  activeCity,
  className,
}: {
  activeCity?: string;
  className?: string;
}) {
  const label = activeCity
    ? `Carte de la RDC — projet mis en avant : ${activeCity}`
    : `Carte de la RDC — nos ${presenceCities.length} villes d'intervention`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={label}
      className={className ?? "h-full w-full"}
    >
      <MapDots />

      {presenceCities.map((city) => {
        const [x, y] = project(city.lon, city.lat);
        const highlighted = activeCity ? city.name === activeCity : true;

        if (activeCity && highlighted) return null; // rendue en dernier, au-dessus

        return (
          <g key={city.name}>
            <circle
              cx={x}
              cy={y}
              r={highlighted ? 5.5 : 3.6}
              className={highlighted ? "fill-solar-500" : "fill-brand-200"}
              stroke={highlighted ? "#15135A" : undefined}
              strokeWidth={highlighted ? 2 : undefined}
            />
            <text
              x={x + city.dx}
              y={y + city.dy}
              textAnchor={city.anchor}
              className={
                highlighted
                  ? "fill-white font-sans text-[12px] font-bold"
                  : "fill-brand-200/80 font-sans text-[11px] font-medium"
              }
            >
              {city.name}
            </text>
          </g>
        );
      })}

      {/* Ville active — halo pulsé, au-dessus du reste */}
      {activeCity
        ? presenceCities
            .filter((c) => c.name === activeCity)
            .map((city) => {
              const [x, y] = project(city.lon, city.lat);
              return (
                <g key={city.name}>
                  <circle cx={x} cy={y} r={12} fill="#FFB800" opacity={0.35}>
                    <animate
                      attributeName="r"
                      values="7;15;7"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.5;0;0.5"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={x}
                    cy={y}
                    r={6.5}
                    fill="#FFB800"
                    stroke="#15135A"
                    strokeWidth={2.5}
                  />
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
            })
        : null}
    </svg>
  );
}
