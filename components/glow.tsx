import { cn } from "@/lib/utils";

/**
 * Halos radiaux de section — la signature lumineuse du site.
 *
 * Toute surface teintée (`surface-cool`, `surface-cool-deep`) et toute
 * surface sombre en porte une paire : le bleu de marque en haut, une trace
 * solaire au coin opposé. C'est ce qui empêche les grands aplats de paraître
 * plats. Purement décoratif : la section parente doit être `relative isolate`.
 *
 * @see docs/design-system.md — « Rythme des fonds »
 */
export type GlowVariant = "cool" | "cool-deep" | "dark" | "warm";

const BRAND = "49,48,208";
const SOLAR = "255,184,0";

/** Coin d'ancrage de la trace solaire, en positions CSS. */
const SOLAR_CORNER = {
  "bottom-right": "100% 100%",
  "bottom-left": "0% 100%",
  "top-right": "88% 6%",
} as const;

const VARIANTS: Record<
  GlowVariant,
  { brand: string; solar: (corner: string) => string }
> = {
  cool: {
    brand: `radial-gradient(75rem 38rem at 50% 6%, rgba(${BRAND},0.13), transparent 62%)`,
    solar: (c) =>
      `radial-gradient(55rem 35rem at ${c}, rgba(${SOLAR},0.08), transparent 60%)`,
  },
  "cool-deep": {
    brand: `radial-gradient(75rem 38rem at 50% 0%, rgba(${BRAND},0.16), transparent 62%)`,
    solar: (c) =>
      `radial-gradient(55rem 35rem at ${c}, rgba(${SOLAR},0.10), transparent 60%)`,
  },
  dark: {
    brand: `radial-gradient(70rem 32rem at 50% 0%, rgba(${BRAND},0.35), transparent 65%)`,
    solar: (c) =>
      `radial-gradient(45rem 28rem at ${c}, rgba(${SOLAR},0.06), transparent 60%)`,
  },
  /* Course du jour — or du matin à gauche, crépuscule à droite. */
  warm: {
    brand: `radial-gradient(60rem 40rem at 18% -8%, rgba(214,160,66,0.20), transparent 62%)`,
    solar: () =>
      `radial-gradient(55rem 38rem at 88% 112%, rgba(150,88,120,0.13), transparent 62%)`,
  },
};

export function Glow({
  variant = "cool",
  corner = "bottom-right",
  className,
}: {
  variant?: GlowVariant;
  /** Coin de la trace solaire — on l'alterne d'une section à l'autre. */
  corner?: keyof typeof SOLAR_CORNER;
  className?: string;
}) {
  const spec = VARIANTS[variant];

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ background: spec.brand }} />
      <div
        className="absolute inset-0"
        style={{ background: spec.solar(SOLAR_CORNER[corner]) }}
      />
    </div>
  );
}
