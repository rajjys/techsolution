import type { Metadata } from "next";

import { Authority } from "@/components/home/authority";
import { CaseStudiesReach } from "@/components/home/case-studies-reach";
import { CostFrame } from "@/components/home/cost-frame";
import { Hero } from "@/components/home/hero";
import { KitsSelector } from "@/components/home/kits-selector";
import { Maintenance } from "@/components/home/maintenance";
import { Offerings } from "@/components/home/offerings";
import { Solutions } from "@/components/home/solutions";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/",
  /* Pas de `title` : l'accueil garde le titre par défaut du layout. */
  description: site.description,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Authority />
      <Solutions />
      <Offerings />
      <CaseStudiesReach />
      <Maintenance />
      <CostFrame />
      <KitsSelector />
    </>
  );
}
