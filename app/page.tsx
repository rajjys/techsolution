import type { Metadata } from "next";

import { Authority } from "@/components/home/authority";
import { CtaPanel } from "@/components/cta-panel";
import { FeaturedClients } from "@/components/home/clients";
import { Coverage } from "@/components/home/coverage";
import { Engagement } from "@/components/home/engagement";
import { Hero } from "@/components/home/hero";
import { Solutions } from "@/components/home/solutions";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Authority />

      {/* Séparateur dégradé pleine largeur : transparent → blanc → bleu → ambre → bleu → blanc → transparent */}
      <div
        aria-hidden="true"
        className="h-[3px] w-screen bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.9)_6%,rgba(49,48,208,0.9)_26%,rgba(194,65,12,0.85)_50%,rgba(49,48,208,0.9)_74%,rgba(255,255,255,0.9)_94%,transparent_100%)]"
      />

      <Solutions />
      <Engagement />
      <Coverage />
      <FeaturedClients />
      <CtaPanel />
    </>
  );
}
