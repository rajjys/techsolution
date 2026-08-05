import { DRC_BOUNDS, DRC_OUTLINE, mapCities } from "@/lib/data/drc";
import { cn } from "@/lib/utils";

/**
 * Carte de la RDC en matrice de points (SVG, rendu serveur).
 * Les points proches des sites d'intervention sont teintés « solaire »
 * pour matérialiser le rayonnement des équipes sur le terrain.
 */
const W = 640;
const H = 640;
const PAD = 26;
const STEP = 12.5;
const DOT_R = 3.1;

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

const outline = DRC_OUTLINE.map(([lon, lat]) => project(lon, lat));

function pointInPolygon(x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
    const [xi, yi] = outline[i];
    const [xj, yj] = outline[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

const activeCities = mapCities
  .filter((c) => c.active)
  .map((c) => project(c.lon, c.lat));

type Dot = { x: number; y: number; tone: "base" | "near" | "hot" };

function computeDots(): Dot[] {
  const dots: Dot[] = [];
  for (let x = PAD; x <= W - PAD; x += STEP) {
    for (let y = PAD; y <= H - PAD; y += STEP) {
      if (!pointInPolygon(x, y)) continue;
      let min = Infinity;
      for (const [cx, cy] of activeCities) {
        const d = Math.hypot(x - cx, y - cy);
        if (d < min) min = d;
      }
      dots.push({ x, y, tone: min < 30 ? "hot" : min < 58 ? "near" : "base" });
    }
  }
  return dots;
}

const DOTS = computeDots();

const TONE_FILL: Record<Dot["tone"], string> = {
  base: "#C7D7EA", // brand-200
  near: "#FFD34D", // solar-300
  hot: "#FFB800", // solar-500
};

export function DrcMap({
  className,
  showLegend = true,
}: {
  className?: string;
  showLegend?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Carte de la République Démocratique du Congo montrant les sites d'intervention de Tech Solution : Bunia, Mahagi, Aveba, Butembo, Goma et Numbi"
        className="h-auto w-full"
      >
        {/* Matrice de points du territoire */}
        {DOTS.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={dot.tone === "base" ? DOT_R : DOT_R + 0.5}
            fill={TONE_FILL[dot.tone]}
            opacity={dot.tone === "base" ? 0.9 : 1}
          />
        ))}

        {/* Villes repères (contexte géographique) */}
        {mapCities
          .filter((c) => !c.active)
          .map((city) => {
            const [x, y] = project(city.lon, city.lat);
            return (
              <g key={city.name}>
                <circle
                  cx={x}
                  cy={y}
                  r={4}
                  fill="#FFFFFF"
                  stroke="#6C95C1"
                  strokeWidth={1.6}
                />
                <text
                  x={x + city.labelDx}
                  y={y + city.labelDy}
                  textAnchor={city.labelAnchor}
                  className="fill-slate-500 font-sans text-[12px] font-medium"
                  paintOrder="stroke"
                  stroke="#F8FAFC"
                  strokeWidth={4}
                  strokeLinejoin="round"
                >
                  {city.name}
                </text>
              </g>
            );
          })}

        {/* Sites d'intervention Tech Solution */}
        {mapCities
          .filter((c) => c.active)
          .map((city) => {
            const [x, y] = project(city.lon, city.lat);
            return (
              <g key={city.name}>
                <circle
                  cx={x}
                  cy={y}
                  r={9}
                  fill="#FFB800"
                  opacity={0.35}
                  className="map-pulse animate-pulse-dot"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={5.5}
                  fill="#FFB800"
                  stroke="#FFFFFF"
                  strokeWidth={2.2}
                />
                <text
                  x={x + city.labelDx}
                  y={y + city.labelDy}
                  textAnchor={city.labelAnchor}
                  className="fill-brand-950 font-sans text-[13px] font-bold"
                  paintOrder="stroke"
                  stroke="#FFFFFF"
                  strokeWidth={4.5}
                  strokeLinejoin="round"
                >
                  {city.name}
                </text>
              </g>
            );
          })}
      </svg>

      {showLegend ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block size-3 rounded-full border-2 border-white bg-solar-500 shadow-sm" />
            Sites d&apos;intervention livrés
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block size-3 rounded-full border-2 border-brand-400 bg-white" />
            Villes repères
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block size-3 rounded-full bg-brand-200" />
            Zone d&apos;intervention — 26 provinces
          </span>
        </div>
      ) : null}
    </div>
  );
}
