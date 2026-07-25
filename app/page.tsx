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

      {/* Séparateur dégradé : transparent → blanc → bleu → ambre → bleu → blanc → transparent */}
      <div
        aria-hidden="true"
        className="h-[2px] w-full bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.8)_14%,rgba(49,48,208,0.85)_34%,rgba(194,65,12,0.8)_50%,rgba(49,48,208,0.85)_66%,rgba(255,255,255,0.8)_86%,transparent_100%)]"
      />

      <Solutions />
      <Engagement />
      <Coverage />
      <FeaturedClients />
      <CtaPanel />
    </>
  );
}
