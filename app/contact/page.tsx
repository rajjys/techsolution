import type { Metadata } from "next";
import { BatteryCharging, Clock, Mail, MapPin, Phone, SunMedium, Zap } from "lucide-react";

import { ContactFunnel } from "@/components/contact/contact-funnel";
import { Glow } from "@/components/glow";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { kits } from "@/lib/data/kits";
import { services } from "@/lib/data/services";
import { offices, site } from "@/lib/site";
import { buildProductWhatsAppLink, buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact & Devis gratuit",
  description:
    "Décrivez votre site en trois étapes : un ingénieur vous rappelle sous 24 h ouvrées. Audit et devis gratuits, partout en RDC.",
  alternates: { canonical: "/contact" },
};

const SPEC_ROWS = [
  { key: "inverter", icon: Zap, label: "Onduleur" },
  { key: "battery", icon: BatteryCharging, label: "Batterie lithium" },
  { key: "panels", icon: SunMedium, label: "Panneaux" },
] as const;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ kit?: string; service?: string }>;
}) {
  const { kit: kitSlug, service: serviceSlug } = await searchParams;

  const kit = kits.find((item) => item.slug === kitSlug);
  const service = services.find((item) => item.slug === serviceSlug);

  return (
    <>
      <PageHero
        compact
        breadcrumb={[{ label: "Contact" }]}
        eyebrow={kit ? "Demande de devis" : "Contact"}
        title={
          kit ? (
            <>
              Votre {kit.power},{" "}
              <span className="text-brand-600">dimensionné pour vous.</span>
            </>
          ) : (
            <>
              Trois questions,{" "}
              <span className="text-brand-600">et on vous rappelle.</span>
            </>
          )
        }
        lead={
          kit
            ? `Le ${kit.name} est un point de départ : sa composition exacte est arrêtée après l'audit de votre site. Dites-nous où et pour quoi faire.`
            : "Plus vous nous en dites, plus le premier appel est utile. Comptez moins d'une minute — vous ne tapez que vos coordonnées."
        }
      />

      {/* L'entonnoir — le cœur de la page */}
      <Section className="relative isolate bg-surface-cool">
        <Glow variant="cool" corner="bottom-right" />
        <div className="container relative grid items-start gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-12">
          <ContactFunnel initialKit={kit?.slug} initialService={service?.slug} />

          {/* Rail — ce qui rassure, et la porte de sortie immédiate */}
          <Reveal delay={0.1} className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Ce que vous obtenez
              </p>
              <ul className="mt-4 space-y-4">
                {[
                  {
                    title: "Un rappel sous 24 h ouvrées",
                    text: "Par un ingénieur, pas par un standard.",
                  },
                  {
                    title: "Une visite et un audit gratuits",
                    text: "Mesure de vos charges réelles, sans engagement.",
                  },
                  {
                    title: "Un devis chiffré et détaillé",
                    text: "Composants, puissance, autonomie : tout est écrit.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-solar-500"
                      aria-hidden="true"
                    />
                    <span>
                      <span className="block text-sm font-bold text-slate-900">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">
                        {item.text}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="text-sm leading-relaxed text-slate-600">
                  Vous préférez parler tout de suite ?
                </p>
                <div className="mt-4 space-y-3">
                  <Button variant="neutral" block asChild>
                    <a
                      href={
                        kit
                          ? buildProductWhatsAppLink(kit.name)
                          : buildWhatsAppLink()
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsAppIcon className="size-4 text-[#25D366]" />
                      Écrire sur WhatsApp
                    </a>
                  </Button>
                  <a
                    href={`tel:${site.phone}`}
                    className="flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-display text-lg font-bold tracking-tight text-slate-900 transition-colors hover:text-brand-700"
                  >
                    <Phone
                      className="size-4 shrink-0 text-solar-600"
                      aria-hidden="true"
                    />
                    {site.phoneDisplay}
                  </a>
                  <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {site.hours}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/*
        Détail du kit demandé — volontairement APRÈS l'entonnoir : c'est un
        complément pour qui hésite, pas l'interaction principale. Il tient lieu
        de fiche produit, la page /produits faisant déjà le travail de
        présentation.
      */}
      {kit ? (
        <Section className="bg-white">
          <div className="container">
            <SectionHeading
              rule
              eyebrow="Le kit que vous demandez"
              title={kit.name}
              lead={kit.outcome}
            />

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Ce qu&apos;il fait tourner
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {kit.runs.map((load) => (
                    <li key={load.label} className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-100/60">
                        <load.icon
                          className="size-4 text-brand-700"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="pt-1.5 text-[15px] leading-snug text-slate-700">
                        {load.detail ?? load.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-dashed border-slate-200 pt-4 text-[13px] leading-relaxed text-slate-500">
                  Simultanément et en continu, réseau coupé.
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Composition type
                </p>
                <dl className="mt-4 divide-y divide-slate-100 border-y border-slate-100">
                  {SPEC_ROWS.map(({ key, icon: Icon, label }) => (
                    <div
                      key={key}
                      className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:gap-3"
                    >
                      <dt className="inline-flex shrink-0 items-center gap-2 text-[13px] text-slate-500 sm:w-36">
                        <Icon
                          className="size-4 shrink-0 text-solar-600"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        {label}
                      </dt>
                      <dd className="min-w-0 text-[14px] font-semibold text-slate-900">
                        {kit[key]}
                      </dd>
                    </div>
                  ))}
                  <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:gap-3">
                    <dt className="shrink-0 text-[13px] text-slate-500 sm:w-36 sm:pl-6">
                      Puissance
                    </dt>
                    <dd className="text-[14px] font-semibold text-slate-900">
                      {kit.power} · {kit.phase}
                    </dd>
                  </div>
                </dl>
                <p className="mt-5 text-[13px] leading-relaxed text-slate-500">
                  Cette composition est celle du catalogue. Elle est ajustée à
                  vos charges réelles après l&apos;audit — c&apos;est
                  précisément l&apos;objet du rappel.
                </p>
              </Reveal>
            </div>
          </div>
        </Section>
      ) : null}

      {/* Nous joindre autrement */}
      <Section className="relative isolate bg-surface-cool-deep">
        <Glow variant="cool-deep" corner="bottom-left" />
        <div className="container relative">
          <SectionHeading
            align="center"
            eyebrow="Autrement"
            title="Ou joignez-nous directement."
          />

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              {
                icon: Phone,
                label: "Téléphone",
                value: site.phoneDisplay,
                href: `tel:${site.phone}`,
              },
              {
                icon: WhatsAppIcon,
                label: "WhatsApp",
                value: "Réponse la plus rapide",
                href: buildWhatsAppLink(),
                external: true,
              },
              {
                icon: Mail,
                label: "Email",
                value: site.email,
                href: `mailto:${site.email}`,
              },
            ].map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                {...(channel.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft hover:ring-4 hover:ring-brand-100 hover:ring-offset-1"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-100/60">
                  <channel.icon
                    className="size-5 text-brand-700"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {channel.label}
                </span>
                <span className="mt-1 font-display text-[15px] font-bold text-slate-900">
                  {channel.value}
                </span>
              </a>
            ))}
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {offices.map((office) => (
              <div
                key={office.city}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 p-5"
              >
                <MapPin
                  className={`mt-0.5 size-4 shrink-0 ${
                    office.headquarters ? "text-solar-600" : "text-slate-400"
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <p className="flex flex-wrap items-center gap-x-2 text-sm font-bold text-slate-900">
                    {office.city}
                    <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      {office.role}
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {office.street}
                  </p>
                  <p className="text-xs text-slate-500">{office.region}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
