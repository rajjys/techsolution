import type { Metadata } from "next";

import { ClientMarquee } from "@/components/client-marquee";
import { CtaPanel } from "@/components/cta-panel";
import { FeaturedClients } from "@/components/home/clients";
import { Coverage } from "@/components/home/coverage";
import { Engagement } from "@/components/home/engagement";
import { Hero } from "@/components/home/hero";
import { Metrics } from "@/components/home/metrics";
import { Solutions } from "@/components/home/solutions";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Bandeau de confiance */}
      <section
        aria-label="Ils nous font confiance"
        className="border-y border-slate-100 bg-white py-10"
      >
        <div className="container">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Ils nous font confiance à travers la RDC
          </p>
          <ClientMarquee className="mt-6" />
        </div>
      </section>

      <Metrics />
      <Solutions />
      <Engagement />
      <Coverage />
      <FeaturedClients />
      <CtaPanel />
    </>
  );
}
