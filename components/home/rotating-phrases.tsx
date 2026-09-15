"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * La chute du titre, pas une seconde phrase.
 *
 * Ces groupes nominaux complètent « Fini les délestages pour… ». La rotation
 * porte donc sur le complément — le lecteur s'y reconnaît — et la phrase
 * reste grammaticalement entière à chaque instant. Les précédentes
 * (« Éliminez les coupures », etc.) formaient une phrase autonome qui
 * répétait la première ; l'orange y décorait au lieu de désigner.
 */
const PHRASES = ["vos maisons", "vos entreprises", "vos sites industriels"] as const;

/** 4,2 s : le temps de lire, sans que l'œil soit rappelé sans cesse vers le haut. */
const INTERVAL_MS = 4200;

/**
 * Rotation de la chute du H1 (fondu + glissement).
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
      /*
        La réserve de hauteur bascule à 360 px et non à `sm` (640 px) : les
        chutes tiennent sur une ligne dès 360 px, et réserver deux lignes
        jusqu'à 640 px creusait un vide fantôme sous le titre sur tous les
        téléphones.
      */
      className="block min-h-[2.2em] text-solar-500 min-[360px]:min-h-[1.15em]"
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
