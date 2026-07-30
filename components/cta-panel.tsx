import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";

/** Panneau d'appel à l'action navy — CTA unique et focalisé. */
export function CtaPanel({
  badge = "Étude gratuite — réponse sous 24 h",
  title = "Un projet d'énergie solaire ou d'infrastructure technique ?",
  lead = "Parlons de votre site, de vos charges et de vos contraintes. Nos ingénieurs vous proposent un dimensionnement précis et un devis transparent — partout en RDC.",
}: {
  badge?: string;
  title?: React.ReactNode;
  lead?: string;
}) {
  return (
    <section className="bg-white pb-20 pt-4 md:pb-28">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy-950 px-6 py-16 shadow-lift sm:px-12 md:px-16 md:py-20">
            <div className="absolute inset-0 bg-grid-navy" aria-hidden="true" />
            <div
              className="absolute -right-24 -top-24 size-[360px] rounded-full bg-solar-500/20 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-32 -left-16 size-[300px] rounded-full bg-navy-500/30 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-solar-500 backdrop-blur">
                {badge}
              </span>
              <h2 className="mt-6 text-[26px] font-bold leading-[1.18] text-white sm:text-3xl sm:leading-[1.15] md:text-4xl">
                {title}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-navy-100/85 sm:text-base md:text-lg">
                {lead}
              </p>

              <div className="mt-9 flex justify-center">
                <Button variant="solar" size="lg" asChild>
                  <Link href="/contact">
                    Demander une étude gratuite
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
