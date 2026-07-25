"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const PHRASES = [
  "Éliminez les délestages",
  "Réduisez vos factures",
  "Gagnez en autonomie",
] as const;

const INTERVAL_MS = 3500;

/**
 * Rotation de la phrase dynamique du H1 (fondu + glissement).
 * Hauteur minimale réservée pour éviter tout décalage de mise en page.
 */
export function RotatingPhrases() {
  const [index, setIndex] = React.useState(0);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % PHRASES.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="block min-h-[2.2em] text-[#C2410C] sm:min-h-[1.15em]"
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: "0.35em" }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: "-0.35em" }}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="block"
        >
          {PHRASES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
