"use client";

import * as React from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import { cn } from "@/lib/utils";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * Révélation au scroll (ou au montage pour les sections au-dessus du pli).
 *
 * **Au montage, c'est du CSS, pas du JavaScript.** La version framer servait
 * le titre de chaque page en `opacity:0` et ne l'affichait qu'après
 * l'hydratation : sur un réseau congolais, le texte principal attendait le
 * bundle (LCP de 11,9 s mesuré en août). L'animation CSS part avec la
 * feuille de style ; même courbe, même durée, même décalage — rien ne change
 * à l'œil.
 *
 * **L'état initial est le même au serveur et au client.** Il dépendait de
 * `useReducedMotion()`, `null` au serveur et `true` chez un visiteur qui
 * réduit les animations : React voyait deux arbres différents et levait une
 * erreur d'hydratation sur chaque page. La préférence ne règle plus que la
 * transition (durée nulle), qui n'est jamais écrite dans le HTML ; au
 * montage, `motion-safe:` la prend en charge en CSS.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  mode = "view",
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  mode?: "view" | "mount";
  once?: boolean;
}) {
  const reduce = useReducedMotion();

  if (mode === "mount") {
    return (
      <div
        data-reveal=""
        className={cn("motion-safe:animate-reveal-up", className)}
        style={
          {
            "--reveal-y": `${y}px`,
            animationDelay: delay ? `${delay}s` : undefined,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    );
  }

  const initial = { opacity: 0, y };
  const visible = { opacity: 1, y: 0 };
  const transition = {
    duration: reduce ? 0 : 0.65,
    delay: reduce ? 0 : delay,
    ease: EASE,
  };

  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={initial}
      whileInView={visible}
      viewport={{ once, margin: "-70px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

/**
 * Conteneur avec révélation en cascade des enfants directs.
 *
 * ⚠️ Liste dynamique : `whileInView` avec `once: true` ne se déclenche
 * qu'une fois. Les enfants montés *après* (filtrage, pagination) héritent de
 * l'état `hidden` et ne reçoivent jamais l'ordre d'apparaître — la place est
 * prise, le contenu est invisible. Passer une `key` qui change avec le
 * filtre pour forcer le remontage, ou renoncer à la cascade.
 */
export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.09,
  mode = "view",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
  /**
   * `mount` pour les cascades situées au-dessus du pli : en `view` elles
   * attendent un défilement qui n'arrive jamais si la section est déjà à
   * l'écran au chargement, et le contenu reste invisible.
   */
  mode?: "view" | "mount";
}) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: reduce
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: gap, delayChildren: delay },
    },
  };

  return (
    <motion.div
      data-reveal=""
      className={className}
      variants={container}
      initial="hidden"
      {...(mode === "mount"
        ? { animate: "visible" }
        : {
            whileInView: "visible",
            viewport: { once: true, margin: "-70px" },
          })}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 26,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();

  const item: Variants = {
    /* Constant au serveur et au client — cf. Reveal. */
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.6, ease: EASE },
    },
  };

  return (
    <motion.div data-reveal="" className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/** Compteur animé au passage dans le viewport. */
export function CountUp({
  value,
  suffix = "",
  className,
  duration = 1.8,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  /*
   * Le rendu serveur porte la valeur finale : sans JavaScript, un compteur
   * qui reste à « 0+ » annonce le contraire de ce qu'il devrait. On ne
   * remet à zéro qu'une fois le script exécuté, avant que l'élément n'entre
   * dans le champ de vision.
   */
  React.useEffect(() => {
    const node = ref.current;
    if (!node || reduce) return;
    node.textContent = `0${suffix}`;
  }, [reduce, suffix]);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduce) {
      node.textContent = `${value}${suffix}`;
      return;
    }
    if (!inView) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = `${Math.round(latest)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration, reduce]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value}
      {suffix}
    </span>
  );
}
