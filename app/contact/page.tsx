import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { DrcMap } from "@/components/drc-map";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data/services";
import { site } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact & Devis gratuit",
  description:
    "Contactez Tech Solution RDC : étude gratuite, devis sous 24 h, Téléphone +243 821 250 250",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ produit?: string; service?: string }>;
}) {
  const { produit, service } = await searchParams;

  /* `?service=` vient des CTA de /services : l'objet et le message sont
     préremplis pour que le visiteur n'ait plus qu'à décrire son site. */
  const requestedService = services.find((item) => item.slug === service);

  const defaultSubject = produit
    ? "Catalogue produits"
    : requestedService?.contactSubject;

  const defaultMessage = produit
    ? `Bonjour Tech Solution,\n\nJe souhaite obtenir un devis pour « ${produit} ».\n\nSite à équiper (ville/province) : \nBesoins estimés : `
    : requestedService
      ? `Bonjour Tech Solution,\n\nJe souhaite une étude pour un projet — ${requestedService.shortTitle}.\n\nSite à équiper (ville/province) : \nBesoins estimés : `
      : undefined;

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Contact" }]}
        eyebrow="Contact"
        title={
          <>
            Parlons de votre{" "}
            <span className="text-brand-600">
              projet énergétique
            </span>
          </>
        }
        lead="Étude gratuite, dimensionnement précis, devis transparent : notre équipe technique vous répond sous 24 h ouvrées — par email, téléphone ou WhatsApp."
      />

      <Section className="bg-slate-50">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* Coordonnées */}
          <div className="space-y-5">
            <Reveal>
              <a
                href={`tel:${site.phone}`}
                className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-950 transition-colors group-hover:bg-brand-800">
                  <Phone className="size-6 text-solar-500" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Téléphone
                  </span>
                  <span className="mt-1 block font-display text-lg font-bold text-slate-900">
                    {site.phoneDisplay}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.06}>
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-950 transition-colors group-hover:bg-brand-800">
                  <Mail className="size-6 text-solar-500" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email professionnel
                  </span>
                  <span className="mt-1 block truncate font-display text-lg font-bold text-slate-900">
                    {site.email}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="rounded-2xl border border-[#25D366]/30 bg-[#25D366]/5 p-6 shadow-card">
                <div className="flex items-center gap-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#25D366]">
                    <WhatsAppIcon className="size-6 text-white" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      WhatsApp Business
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-slate-900">
                      Réponse la plus rapide
                    </p>
                  </div>
                </div>
                <Button variant="whatsapp" className="mt-5 w-full" asChild>
                  <a
                    href={buildWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="size-4" />
                    Démarrer la conversation
                  </a>
                </Button>
                <p className="mt-3 text-center text-xs text-slate-500">
                  Message pré-rempli — décrivez ensuite votre projet.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <div className="flex items-start gap-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-950">
                    <MapPin className="size-6 text-solar-500" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Base opérationnelle
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-slate-900">
                      {site.base}
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="size-3.5 text-solar-600" />
                      Lun. – Sam., 8h00 – 17h00 (heure de l&apos;Est)
                    </p>
                  </div>
                </div>
                <div className="mt-5 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <DrcMap showLegend={false} />
                  <p className="mt-2 text-center text-[11px] font-medium text-slate-500">
                    Interventions dans les 26 provinces — carte interactive
                    détaillée sur demande
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Formulaire */}
          <Reveal delay={0.08} y={30}>
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Demander une étude gratuite
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Remplissez ce formulaire : un ingénieur vous recontacte pour
                  planifier l&apos;audit de votre site,{" "}
                  <span className="font-semibold text-slate-900">
                    sans engagement
                  </span>
                  .
                </p>
              </div>
              <ContactForm
                defaultSubject={defaultSubject}
                defaultMessage={defaultMessage}
              />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
