import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // En dev, certains antivirus (Avast, Kaspersky…) inspectent le trafic TLS
    // et ralentissent les requêtes sortantes de Node au point de dépasser le
    // délai amont de 7 s de l'optimiseur d'images → 500 sur /_next/image.
    // On laisse donc le navigateur charger les images directement en local.
    // La production conserve l'optimisation complète.
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    qualities: [60, 75, 85, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
