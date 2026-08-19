import type { Metadata } from "next";
import Link from "next/link";
import {
  BatteryCharging,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Phone,
  ReceiptText,
  SunMedium,
  Zap,
} from "lucide-react";

import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { ContactFunnel } from "@/components/contact/contact-funnel";
import { Glow } from "@/components/glow";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/motion";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { KIT_NEED, needs, resolveNeed } from "@/lib/data/contact";
import { kits } from "@/lib/data/kits";
import { services } from "@/lib/data/services";
import { pageMetadata } from "@/lib/seo";
import { offices, site } from "@/lib/site";
import { buildProductWhatsAppLink, buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact & Devis gratuit",
  description:
    "Décrivez votre site en quelques clics : un ingénieur vous rappelle sous 24 h ouvrées. Audit sur site et devis gratuits, partout en RDC.",
});

const SPEC_ROWS = [
  { key: "inverter", icon: Zap, label: "Onduleur" },
  { key: "battery", icon: BatteryCharging, label: "Batterie lithium" },
  { key: "panels", icon: SunMedium, label: "Panneaux" },
] as const;

/**
 * Les engagements publics de l'entreprise, repris **au point de décision**.
 *
 * Ils vivaient dans un rail de droite, donc sous l'entonnoir une fois la
 * grille repliée sur mobile : au moment du premier clic, ils étaient hors
 * écran. Ils sont désormais entre le titre et la première question, sur une
 * seule ligne qui se replie — une politique, pas une grille d'arguments.
 *
 * Ce sont mot pour mot ceux de `CostFrame` sur l'accueil. Le délai de retour
 * sur investissement, lui, reste là-bas : décision du propriétaire.
 */
const PROMISES = [
  { icon: ClipboardCheck, label: "Audit gratuit sur site" },
  { icon: Clock, label: "Réponse sous 24 h ouvrées" },
  { icon: ReceiptText, label: "Rien à payer avant le devis" },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ kit?: string; service?: string; need?: string }>;
}) {
  const {
    kit: kitSlug,
    service: serviceSlug,
    need: needSlug,
  } = await searchParams;

  const kit = kits.find((item) => item.slug === kitSlug);
  const service = services.find((item) => item.slug === serviceSlug);

  /*
   * `?need=` complète `?kit=` et `?service=` : il porte une réponse à la
   * première question sans désigner de produit ni de domaine précis. C'est ce
   * qui manquait aux appels posés depuis /produits ou depuis les kits — ils
   * savaient que le visiteur venait pour un kit, et arrivaient pourtant nus,
   * lui reposant une question dont son clic contenait déjà la réponse.
   */
  const needId = resolveNeed(needSlug);
  const need = needs.find((item) => item.id === needId);
  /* `?need=kit` vient de /produits : le catalogue, c'est du solaire. */
  const wantsKit = needSlug === KIT_NEED;
  const initialNeed = service?.slug ?? need?.id;

  /*
   * Deux fiches d'établissement, avec horaires et téléphone. Le balisage
   * `Organization` global ne portait ni les heures d'ouverture ni les
   * implantations comme des lieux — pour une entreprise à deux bases
   * physiques, c'est précisément ce qu'une recherche locale cherche.
   */
  const officesJsonLd = offices.map((office) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/contact#${office.city.toLowerCase()}`,
    name: `${site.legalName} — ${office.city}`,
    parentOrganization: { "@type": "Organization", name: site.legalName },
    url: `${site.url}/contact`,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: office.street,
      addressLocality: office.city,
      addressRegion: office.region,
      addressCountry: "CD",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "17:00",
    },
  }));

  const whatsappLink = kit
    ? buildProductWhatsAppLink(kit.name)
    : buildWhatsAppLink();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(officesJsonLd) }}
      />

      {/*
        L'entonnoir occupe la page — il n'y a pas d'en-tête à traverser avant
        lui. Un `PageHero` posait 570 px de préambule au-dessus de la première
        question : sur un téléphone, l'outil vers lequel converge tout le site
        commençait sous la ligne de flottaison. Le titre, la promesse et le
        formulaire tiennent maintenant dans une seule colonne, et cette colonne
        est la page.

        Colonne unique, et non deux : un rail latéral disparaît sous
        l'entonnoir dès qu'on replie la grille, c'est-à-dire là où il servirait
        le plus. Ce qu'il portait est remonté au-dessus (les engagements) ou
        descendu juste dessous (la sortie de secours).
      */}
      <Section className="relative isolate bg-brand-50 !pt-8 !pb-14 sm:!pt-10 lg:!pt-12 lg:!pb-20">
        <Glow variant="cool" corner="bottom-right" />

        <div className="container relative">
          <div className="mx-auto max-w-[46rem]">
            <BreadcrumbJsonLd
              trail={[
                { label: "Accueil", href: "/" },
                { label: "Contact" },
              ]}
            />
            <nav aria-label="Fil d'Ariane" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-slate-500">
                <li>
                  <Link
                    href="/"
                    className="rounded transition-colors hover:text-brand-700"
                  >
                    Accueil
                  </Link>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight
                    className="size-3.5 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-slate-700">Contact</span>
                </li>
              </ol>
            </nav>

            <h1 className="text-balance font-display text-[30px] font-bold leading-[1.1] tracking-[-0.01em] text-slate-900 sm:text-4xl md:text-[44px]">
              {kit ? (
                <>
                  Votre {kit.power},{" "}
                  <span className="text-brand-600">dimensionné pour vous.</span>
                </>
              ) : service ? (
                <>
                  {service.shortTitle} :{" "}
                  <span className="text-brand-600">parlons de votre site.</span>
                </>
              ) : wantsKit ? (
                <>
                  Le bon kit,{" "}
                  <span className="text-brand-600">
                    c&apos;est celui qui tient vos charges.
                  </span>
                </>
              ) : need ? (
                <>
                  {need.label} :{" "}
                  <span className="text-brand-600">parlons-en.</span>
                </>
              ) : (
                <>
                  Quelques questions,{" "}
                  <span className="text-brand-600">et on vous rappelle.</span>
                </>
              )}
            </h1>

            {/* La promesse, en une ligne qui se replie plutôt qu'en grille. */}
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {PROMISES.map((promise) => (
                <li
                  key={promise.label}
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700 sm:text-sm"
                >
                  <promise.icon
                    className="size-4 shrink-0 text-brand-600"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {promise.label}
                </li>
              ))}
            </ul>

            <div className="mt-7 sm:mt-8">
              <ContactFunnel initialKit={kit?.slug} initialNeed={initialNeed} />
            </div>

            {/*
              La sortie de secours, sous l'entonnoir et non à côté : en RDC
              WhatsApp convertit, mais il ne doit pas concurrencer le
              formulaire au moment où on s'y engage. Il le rattrape.
            */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-5">
              <p className="text-sm font-semibold text-slate-800">
                Vous préférez parler tout de suite&nbsp;?
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 sm:mt-0">
                <Button variant="neutral" size="sm" asChild>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="size-4 text-[#25D366]" />
                    WhatsApp
                  </a>
                </Button>
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 font-display text-[17px] font-bold tracking-tight text-slate-900 transition-colors hover:text-brand-700"
                >
                  <Phone
                    className="size-4 shrink-0 text-solar-600"
                    aria-hidden="true"
                  />
                  {site.phoneDisplay}
                </a>
              </div>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500 sm:justify-start">
              <Clock className="size-3.5 shrink-0" aria-hidden="true" />
              {site.hours}
            </p>
          </div>
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

    </>
  );
}
