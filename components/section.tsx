import * as React from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion";

/**
 * Rythme vertical standard d'une section. Les sections qui ouvrent ou
 * ferment une page (hero, conclusion) prennent un padding plus large.
 */
export function Section({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("py-14 sm:py-20 lg:py-28", className)} {...props}>
      {children}
    </section>
  );
}

/**
 * Surtitre de section — filet solaire puis capitales espacées.
 * C'est le seul endroit où le solaire sert de repère structurel.
 */
export function Eyebrow({
  children,
  onDark = false,
  className,
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em]",
        onDark ? "text-solar-500" : "text-solar-700",
        className,
      )}
    >
      <span
        className="h-[3px] w-8 shrink-0 rounded-full bg-solar-500"
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

/**
 * En-tête de section — les deux seules grammaires du site.
 *
 * `align="left"`   : surtitre prolongé par un filet pointillé qui remplit la
 *                    largeur restante, titre, chapô. C'est la grammaire des
 *                    sections en deux colonnes (Solutions, Kits).
 * `align="center"` : surtitre centré, titre équilibré, chapô borné à 2xl.
 *                    Grammaire des sections pleine largeur (Offerings,
 *                    Réalisations).
 *
 * L'échelle typographique est celle de la page d'accueil :
 * 26px → 42px pour le titre, 15px → 18px pour le chapô.
 *
 * @see docs/design-system.md — « Titres de section »
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  onDark = false,
  /**
   * `section` : titre de section. `block` : titre d'un bloc répété à
   * l'intérieur d'une section (une expertise parmi six, par exemple) — il
   * doit rester sous le niveau du titre de section qui le domine.
   */
  size = "section",
  /** Filet pointillé prolongeant le surtitre — grammaire alignée à gauche. */
  rule = false,
  id,
  className,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  size?: "section" | "block";
  rule?: boolean;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const centered = align === "center";

  return (
    <Reveal
      className={cn(
        centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow ? (
        <div
          className={cn(
            "flex items-center gap-4",
            centered && "justify-center",
          )}
        >
          <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>
          {rule && !centered ? (
            <span
              className={cn(
                "h-px flex-1 border-t border-dashed",
                onDark ? "border-white/20" : "border-slate-300",
              )}
              aria-hidden="true"
            />
          ) : null}
        </div>
      ) : null}

      <h2
        id={id}
        className={cn(
          "text-balance font-bold",
          size === "section"
            ? "text-[26px] leading-[1.18] sm:text-3xl sm:leading-[1.15] md:text-4xl lg:text-[42px] lg:leading-[1.1]"
            : "text-[22px] leading-[1.2] sm:text-2xl md:text-[28px] lg:text-[32px] lg:leading-[1.15]",
          eyebrow ? "mt-6" : "",
          onDark ? "text-white" : "text-slate-900",
        )}
      >
        {title}
      </h2>

      {lead ? (
        <p
          className={cn(
            "mt-5 text-[15px] leading-relaxed sm:text-base md:text-lg",
            centered && "mx-auto max-w-2xl",
            onDark ? "text-brand-200" : "text-slate-600",
          )}
        >
          {lead}
        </p>
      ) : null}

      {children}
    </Reveal>
  );
}
