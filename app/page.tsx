import type { Metadata } from "next";

import { Authority } from "@/components/home/authority";
import { CtaPanel } from "@/components/cta-panel";
import { FeaturedClients } from "@/components/home/clients";
import { Coverage } from "@/components/home/coverage";
import { Engagement } from "@/components/home/engagement";
import { Hero } from "@/components/home/hero";
import { KitsShowcase } from "@/components/home/kits-showcase";
import { Solutions } from "@/components/home/solutions";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Authority />

      {/* Séparateur dégradé pleine largeur : transparent → ambre → bleu (centre dominant) → ambre → transparent */}
      <div
        aria-hidden="true"
        className="h-[3px] w-screen bg-[linear-gradient(to_right,transparent_0%,rgba(194,65,12,0.7)_16%,rgba(49,48,208,0.9)_34%,rgba(49,48,208,0.95)_50%,rgba(49,48,208,0.9)_66%,rgba(194,65,12,0.7)_84%,transparent_100%)]"
      />

      <Solutions />
      <KitsShowcase />
      <Engagement />
      <Coverage />
      <FeaturedClients />
      <CtaPanel />
    </>
  );
}
