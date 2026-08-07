import * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/logo";
import { WhatsAppIcon } from "@/components/icons";
import { Eyebrow } from "@/components/section";
import { footerLinks, offices, site } from "@/lib/site";
import { services } from "@/lib/data/services";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** Masque du filigrane — le glyphe seul, en tracé, sans le wordmark. */
const MARK_MASK = {
  maskImage: "url('/assets/logo-mark-blue.png')",
  WebkitMaskImage: "url('/assets/logo-mark-blue.png')",
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
} as const;

/**
 * Intitulé de colonne — reprend l'`Eyebrow` des sections (filet solaire,
 * capitales, interlettrage 0.18em) mais en `<h3>` : la rangée du bas porte
 * de vraies têtes de rubrique, pas des étiquettes décoratives.
 */
function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white lg:text-xs">
      <span
        className="h-[3px] w-6 shrink-0 rounded-full bg-solar-500"
        aria-hidden="true"
      />
      {children}
    </h3>
  );
}

/** Séparateur des coordonnées — remplace un retour à la ligne. */
function Dot() {
  return (
    <span
      className="hidden size-1 shrink-0 rounded-full bg-white/25 sm:inline-block"
      aria-hidden="true"
    />
  );
}

/**
 * Pied de page — point le plus profond de la rampe `brand` (#0B0A33).
 *
 * La page descend de brand-50 (hero) à brand-950 (ici) : c'est la nuit qui
 * tombe après la « course du jour » du bandeau solaire, et donc le moment
 * exact où la promesse produit se referme. Le filet dégradé du haut joue
 * l'horizon, le glyphe de la marque sert de sceau en filigrane, et le
 * solaire reste un accent rare — jamais une couleur de corps de texte.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-brand-950 text-brand-200">
      {/* Horizon — dernier rai de lumière avant la nuit */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(255,184,0,0.55)_35%,rgba(255,184,0,0.55)_65%,transparent)]"
        aria-hidden="true"
      />

      {/* Halos radiaux — même grammaire que Solutions et Kits */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(70rem_32rem_at_50%_0%,rgba(49,48,208,0.35),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45rem_28rem_at_88%_6%,rgba(255,184,0,0.06),transparent_60%)]" />
      </div>

      {/*
        Filigrane — le glyphe de la marque, rogné par les bords du pied de
        page. Le PNG ne sert que de masque : le tracé est rempli par un
        dégradé qui capte un reste de lumière en haut et se dissout dans la
        nuit en bas. Décoratif, donc invisible pour les lecteurs d'écran.
      */}
      <div
        className="pointer-events-none absolute -bottom-14 -right-16 -z-10 aspect-square w-[19rem] bg-gradient-to-b from-white/[0.09] via-white/[0.035] to-transparent sm:-right-20 sm:w-[26rem] lg:-bottom-24 lg:-right-24 lg:w-[36rem]"
        style={MARK_MASK}
        aria-hidden="true"
      />

      <div className="container relative">
        {/*
          Bandeau haut — la conclusion de la landing (titre, promesse, appels
          à l'action, coordonnées) reste un bloc solide ; la marque lui sert
          de contrepoids à droite, séparée par un filet plutôt que par un
          alignement à droite qui déchirerait le texte.
        */}
        <div className="grid gap-10 border-b border-white/10 py-12 lg:grid-cols-[1.55fr_1fr] lg:gap-0 lg:py-20">
          <div className="lg:pr-14 xl:pr-20">
            <Eyebrow onDark>Parlons de votre projet</Eyebrow>
            <h2 className="mt-5 text-balance text-[26px] font-bold leading-[1.15] text-white sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[42px] lg:leading-[1.08]">
              Le soleil se couche.{" "}
              <span className="text-solar-400">Vos lumières, non.</span>
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-brand-200 sm:text-base">
              Audit, dimensionnement et devis gratuits — réponse sous 24 h
              ouvrées, partout en RDC.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/contact"
                className="group inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-ember-600 px-7 py-3.5 text-base font-semibold text-white
                transition-all duration-200 hover:scale-105 hover:ring-4 hover:ring-ember-500/40 hover:ring-offset-1 hover:ring-offset-brand-950
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 sm:w-auto"
              >
                Demander une étude gratuite
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/25 px-6 py-[0.8rem] text-base font-semibold text-white transition-all duration-200
                hover:border-white hover:bg-white hover:text-brand-950 hover:ring-4 hover:ring-white/25 hover:ring-offset-1 hover:ring-offset-brand-950
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 sm:w-auto"
              >
                <WhatsAppIcon className="size-5" />
                WhatsApp
              </a>
            </div>

            {/* Coordonnées sur une seule ligne — se replie proprement */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
              <a
                href={`tel:${site.phone}`}
                className="font-display text-base font-bold tabular-nums tracking-tight text-white transition-colors hover:text-solar-400"
              >
                {site.phoneDisplay}
              </a>
              <Dot />
              <a
                href={`mailto:${site.email}`}
                className="text-brand-200 transition-colors hover:text-white"
              >
                {site.email}
              </a>
              <Dot />
              <span className="text-brand-300">{site.hours}</span>
            </div>
          </div>

          {/* Marque — contrepoids du bandeau */}
          <div className="flex flex-col justify-center border-t border-white/10 pt-9 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0 xl:pl-20">
            <Link
              href="/"
              aria-label={`${site.name} — Accueil`}
              className="inline-block self-start rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-4 focus-visible:ring-offset-brand-950"
            >
              <Logo onDark variant="full" className="h-16 w-auto lg:h-20" />
            </Link>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-brand-200">
              Énergie solaire, backup et infrastructures techniques — partout en
              République Démocratique du Congo.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white">
              <ShieldCheck className="size-4 shrink-0 text-solar-400" />
              Certifié &amp; agréé — depuis {site.foundedYear}
            </p>
          </div>
        </div>

        {/*
          Utilitaire — deux colonnes jusqu'à lg (les listes sont courtes, elles
          tiennent côte à côte dès 360 px), trois colonnes séparées par des
          filets ensuite : même dispositif que la section « Ce que nous
          offrons », qui divise déjà ses quatre engagements.
        */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-12 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-white/10 lg:py-16">
          {/* Navigation */}
          <nav aria-label="Navigation pied de page" className="lg:pr-12">
            <ColumnTitle>Navigation</ColumnTitle>
            <ul className="mt-5 space-y-1 text-sm lg:text-[15px]">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group -mx-2 flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-brand-200 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500"
                  >
                    {link.label}
                    <ArrowUpRight className="size-4 shrink-0 text-solar-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Expertises — les pictos reprennent ceux des cartes Solutions */}
          <nav aria-label="Nos expertises" className="lg:px-12">
            <ColumnTitle>Expertises</ColumnTitle>
            <ul className="mt-5 space-y-1 text-sm lg:text-[15px]">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services#${service.slug}`}
                    className="group -mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-brand-200 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500"
                  >
                    <service.icon
                      className="size-4 shrink-0 text-brand-300 transition-colors group-hover:text-solar-400"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Implantations — deux fiches, le siège marqué en solaire */}
          <div className="col-span-2 lg:col-span-1 lg:pl-12">
            <ColumnTitle>Nos bureaux</ColumnTitle>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {offices.map((office) => (
                <li
                  key={office.city}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.055]"
                >
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <MapPin
                      className={`size-4 shrink-0 ${
                        office.headquarters ? "text-solar-400" : "text-brand-300"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="font-semibold text-white lg:text-[15px]">
                      {office.city}
                    </span>
                    <span className="rounded-full border border-white/15 px-1.5 py-px text-[9.5px] font-bold uppercase tracking-[0.12em] text-brand-200">
                      {office.role}
                    </span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-200">
                    {office.street}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-300">
                    {office.region}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-brand-300">
              Interventions dans les 26 provinces de la RDC.
            </p>
          </div>
        </div>

        {/* ── Barre légale ────────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 text-center text-[13px] text-brand-200 sm:text-sm md:flex-row md:text-left lg:py-8">
          <p>
            © {year}{" "}
            <span className="font-semibold text-white">{site.legalName}</span> —{" "}
            {site.domain}. Tous droits réservés.
          </p>
          <p className="flex items-center gap-2.5">
            <span
              className="inline-block size-2 shrink-0 rounded-full bg-solar-500"
              aria-hidden="true"
            />
            <span>
              {site.tagline} — avec une démarche{" "}
              <span className="font-semibold text-white">{site.approach}</span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
