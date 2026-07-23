import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** Panneau d'appel à l'action navy — réutilisé sur toutes les pages. */
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
              <h2 className="mt-6 text-3xl font-bold leading-[1.15] text-white md:text-4xl">
                {title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-navy-100/85 md:text-lg">
                {lead}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button variant="solar" size="lg" asChild>
                  <Link href="/contact">
                    Demander une étude gratuite
                    <ArrowRight />
                  </Link>
                </Button>
                <Button variant="whatsapp" size="lg" asChild>
                  <a
                    href={buildWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="size-5" />
                    WhatsApp Business
                  </a>
                </Button>
              </div>

              <a
                href={`tel:${site.phone}`}
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-navy-100 transition-colors hover:text-solar-500"
              >
                <PhoneCall className="size-4 text-solar-500" />
                Ou appelez-nous directement : {site.phoneDisplay}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
