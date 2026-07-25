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
      <Solutions />
      <Engagement />
      <Coverage />
      <FeaturedClients />
      <CtaPanel />
    </>
  );
}
