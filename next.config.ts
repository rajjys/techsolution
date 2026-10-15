import type { NextConfig } from "next";

/* Import relatif : la configuration est compilée hors de l'application, et
   ce fichier de données n'importe que des types. */
import { caseStudyRedirects } from "./lib/data/case-studies";

const nextConfig: NextConfig = {
  /*
   * Anciens slugs des études de cas → slugs « client + intervention + ville »
   * (octobre 2026). Permanentes (308), générées depuis `previousSlugs` : une
   * étude renommée n'a rien d'autre à faire pour garder ses liens.
   */
  async redirects() {
    return caseStudyRedirects;
  },
  images: {
    // En dev, certains antivirus (Avast, Kaspersky…) inspectent le trafic TLS
    // et ralentissent les requêtes sortantes de Node au point de dépasser le
    // délai amont de 7 s de l'optimiseur d'images → 500 sur /_next/image.
    // On laisse donc le navigateur charger les images directement en local.
    // La production conserve l'optimisation complète.
    unoptimized: process.env.NODE_ENV === "development",
    qualities: [60, 75, 85, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
