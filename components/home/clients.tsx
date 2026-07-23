import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Stagger, StaggerItem, Reveal } from "@/components/motion";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clients } from "@/lib/data/clients";

/** Références en vedette — clients réels de la farde. */
export function FeaturedClients() {
  const featured = clients.filter((client) => client.featured);

  return (
    <Section className="bg-slate-50">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Clients & références"
          title="La confiance d'institutions exigeantes"
          lead="ONG internationales, banques, programmes d'État et entreprises nous confient leurs infrastructures critiques."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((client) => (
            <StaggerItem key={client.name}>
              <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-950 font-display text-sm font-bold text-solar-500 shadow-sm">
                    {client.monogram}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-bold text-slate-900">
                      {client.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                      {client.sector}
                    </p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                  {client.services.join(" · ")}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="!size-3 text-solar-600" />
                    {client.city}
                  </Badge>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">
                    Référence vérifiée
                  </span>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15} className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/references">
              Toutes nos références &amp; réalisations
              <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
