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
 * Avec `prefers-reduced-motion`, le même arbre est rendu mais l'animation est
 * neutralisée (état final immédiat) — jamais de contenu invisible.
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

  const initial = reduce ? { opacity: 1, y: 0 } : { opacity: 0, y };
  const visible = { opacity: 1, y: 0 };
  const transition = {
    duration: reduce ? 0 : 0.65,
    delay: reduce ? 0 : delay,
    ease: EASE,
  };

  if (mode === "mount") {
    return (
      <motion.div
        data-reveal=""
        className={className}
        initial={initial}
        animate={visible}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

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

/** Conteneur avec révélation en cascade des enfants directs. */
export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.09,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
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
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
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
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y },
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
      0{suffix}
    </span>
  );
}
