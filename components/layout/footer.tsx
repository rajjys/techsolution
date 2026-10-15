import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, ShieldCheck } from "lucide-react";

import { FooterCta, FooterLead } from "@/components/layout/footer-cta";
import { FooterSitemap } from "@/components/layout/footer-sitemap";
import { BoltRule, SocialIcon } from "@/components/icons";
import { Eyebrow } from "@/components/section";
import {
  footerLinks,
  formatOfficeAddress,
  legal,
  offices,
  site,
  socialLinks,
} from "@/lib/site";
import { projects } from "@/lib/data/clients";
import { provinces } from "@/lib/data/drc";
import { zones } from "@/lib/data/locations";
import { services } from "@/lib/data/services";
import { serviceHref, zoneHref } from "@/lib/routes";

/**
 * Masque du filigrane — le glyphe seul, en tracé, sans le wordmark.
 *
 * Fichier dédié : un masque CSS n'utilise que le canal alpha, la couleur est
 * ignorée. Celui-ci ne porte que l'alpha, quantifié sur 16 niveaux : 6 Ko.
 */
const MARK_MASK = {
  maskImage: "url('/assets/logo-mark-mask.png')",
  WebkitMaskImage: "url('/assets/logo-mark-mask.png')",
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
} as const;

/**
 * Intitulé de colonne — reprend l'`Eyebrow` des sections (impulsion solaire,
 * capitales, interlettrage 0.18em) mais en `<h3>` : de vraies têtes de
 * rubrique, pas des étiquettes décoratives.
 */
function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white lg:text-xs">
      <BoltRule className="h-2 w-[28px] shrink-0 text-solar-500" />
      {children}
    </h3>
  );
}

const linkClass =
  "-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1 text-brand-200 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500";

/**
 * Pied de page — point le plus profond de la rampe `brand` (#0B0A33).
 *
 * **Resserré en octobre 2026.** Il mesurait 1 882 px sur un téléphone de
 * 390 px — 2,2 écrans, et plus de la moitié d'une étude de cas. Ce qui
 * pesait : un bloc de marque (le logo, déjà dans l'en-tête, et un slogan qui
 * répétait celui de l'en-tête), deux fiches d'adresse hautes, et l'horaire
 * redit trois fois. Il en reste ce qu'un pied de page doit porter : la
 * conclusion, les bureaux (le NAP, qui sert aussi la recherche locale), le
 * plan du site, et la ligne légale.
 *
 * Les bureaux montent à la place du bloc de marque : ils mènent désormais à
 * la page de leur ville, et l'itinéraire reste à un clic. Le nom les coiffe
 * — un NAP sans nom n'en est pas un : sans lui, l'adresse ne se rattache à
 * rien, ni pour le visiteur ni pour un moteur de recherche.
 */
export function Footer() {
  const year = new Date().getFullYear();
  /* Les villes prouvées qui ont leur page — jamais une ville sans page. */
  const provenZones = zones.filter((zone) => zone.tier === 2);

  return (
    <footer className="relative isolate overflow-hidden bg-brand-950 text-brand-200">
      {/* Horizon — dernier rai de lumière avant la nuit */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(255,184,0,0.55)_35%,rgba(255,184,0,0.55)_65%,transparent)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(70rem_32rem_at_50%_0%,rgba(49,48,208,0.35),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45rem_28rem_at_88%_6%,rgba(255,184,0,0.06),transparent_60%)]" />
      </div>
      {/* Filigrane — le glyphe de la marque, rogné par les bords */}
      <div
        className="pointer-events-none absolute -bottom-14 -right-16 -z-10 aspect-square w-[19rem] bg-gradient-to-b from-white/[0.09] via-white/[0.035] to-transparent sm:-right-20 sm:w-[26rem] lg:-bottom-24 lg:-right-24 lg:w-[36rem]"
        style={MARK_MASK}
        aria-hidden="true"
      />

      <div className="container relative">
        {/* Conclusion + bureaux */}
        <div className="grid gap-10 border-b border-white/10 py-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div>
            <Eyebrow onDark>Parlons de votre projet</Eyebrow>
            <h2 className="mt-5 text-balance text-[26px] font-bold leading-[1.15] text-white sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[40px] lg:leading-[1.08]">
              Le soleil se couche.{" "}
              <span className="text-solar-400">Vos lumières, non.</span>
            </h2>
            <FooterLead />
            <FooterCta />
          </div>

          {/*
            Le NAP — nom, adresses, téléphone — en un seul bloc `<address>`,
            sous le nom exact des fiches Google Business Profile. Les trois
            ensemble, et non dispersés : c'est la forme qu'un moteur de
            recherche rapproche d'une fiche locale.
          */}
          <div>
            <address className="not-italic">
              <p className="flex items-center gap-3">
                <Image
                  src="/assets/logo-mark-nav-solar.png"
                  alt=""
                  width={97}
                  height={96}
                  className="size-8 shrink-0"
                />
                <span className="font-display text-xl font-bold tracking-tight text-white">
                  {site.name}
                </span>
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {offices.map((office) => (
                  <li
                    key={office.city}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <MapPin
                        className={`size-4 shrink-0 ${office.headquarters ? "text-solar-400" : "text-brand-300"}`}
                        aria-hidden="true"
                      />
                      <Link
                        href={zoneHref(office.city.toLowerCase())}
                        className="rounded font-semibold text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500"
                      >
                        {office.city}
                      </Link>
                      <span className="rounded-full border border-white/15 px-1.5 py-px text-[9.5px] font-bold uppercase tracking-[0.12em] text-brand-200">
                        {office.role}
                      </span>
                    </p>
                    <p className="mt-1.5 text-sm leading-snug text-brand-200">{office.street}</p>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-brand-300">
                      <span>{`Lun.–sam., 8 h–17 h, heure de ${office.city}`}</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatOfficeAddress(office))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 font-semibold text-solar-400 hover:text-solar-300"
                      >
                        Itinéraire
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                <a
                  href={`tel:${site.phone}`}
                  className="font-display text-base font-bold tabular-nums tracking-tight text-white transition-colors hover:text-solar-400"
                >
                  {site.phoneDisplay}
                </a>
                <span className="hidden size-1 shrink-0 rounded-full bg-white/25 sm:inline-block" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="text-brand-200 transition-colors hover:text-white">
                  {site.email}
                </a>
              </p>
            </address>
            {/*
              La preuve d'abord, la capacité ensuite — et les villes qui ont
              leur page, liées. Les deux chiffres viennent de la donnée.
            */}
            <p className="mt-4 text-xs leading-relaxed text-brand-300">
              {`${projects.length} installations documentées, ${site.householdsEquipped}+ foyers équipés. Aussi à `}
              {provenZones.map((zone, index) => (
                <React.Fragment key={zone.slug}>
                  {index > 0 ? (index === provenZones.length - 1 ? " et " : ", ") : null}
                  <Link href={zoneHref(zone.slug)} className="font-semibold text-brand-100 underline-offset-2 hover:text-white hover:underline">
                    {zone.name}
                  </Link>
                </React.Fragment>
              ))}
              {` — interventions sur les ${provinces.length} provinces.`}
            </p>
          </div>
        </div>

        {/* Plan du site — replié sur téléphone, en trois colonnes dès lg */}
        <FooterSitemap>
          <nav aria-label="Navigation pied de page">
            <ColumnTitle>Navigation</ColumnTitle>
            <ul className="mt-4 space-y-0.5 text-sm lg:text-[15px]">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Nos expertises">
            <ColumnTitle>Expertises</ColumnTitle>
            <ul className="mt-4 space-y-0.5 text-sm lg:text-[15px]">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={serviceHref(service.slug)} className={linkClass}>
                    <service.icon
                      className="size-4 shrink-0 text-brand-300"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Zones d'intervention" className="col-span-2 lg:col-span-1">
            <ColumnTitle>Zones</ColumnTitle>
            <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-0.5 text-sm lg:grid-cols-1 lg:text-[15px]">
              {zones.map((zone) => (
                <li key={zone.slug}>
                  <Link href={zoneHref(zone.slug)} className={linkClass}>
                    {`Solaire à ${zone.name}`}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/zones" className={linkClass}>
                  Toutes nos zones
                </Link>
              </li>
            </ul>
          </nav>
        </FooterSitemap>

        {/*
          ── Barre légale ──────────────────────────────────────────────
          Elle dégage le coin bas-droit, où le bouton WhatsApp flottant est
          ancré : rembourrage bas quand elle est empilée, marge droite quand
          elle est en ligne.
        */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 pb-20 text-[13px] text-brand-200 md:pb-6 lg:flex-row lg:items-center lg:justify-between lg:pr-20">
          <div className="space-y-2">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>
                © {year}{" "}
                <span className="font-semibold text-white">{site.legalName}</span>
                {` — ${site.domain}.`}
              </span>
              <Link href="/confidentialite" className="underline underline-offset-2 transition-colors hover:text-white">
                Confidentialité
              </Link>
            </p>
            {/*
              Identifiants légaux : en RDC, les trois numéros qu'un acheteur
              institutionnel vérifie avant d'ouvrir un dossier.
            */}
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tabular-nums text-brand-300 lg:text-xs">
              {[`RCCM ${legal.rccm}`, `ID. Nat. ${legal.idnat}`, `NIF ${legal.nif}`].map(
                (entry, index) => (
                  <span key={entry} className="flex items-center gap-3">
                    {index > 0 ? (
                      <span className="size-1 shrink-0 rounded-full bg-white/25" aria-hidden="true" />
                    ) : null}
                    {entry}
                  </span>
                ),
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white">
              <ShieldCheck className="size-4 shrink-0 text-solar-400" aria-hidden="true" />
              {`Certifié & agréé — depuis ${site.foundedYear}`}
            </span>
            {/*
              Comptes officiels — ils alimentent aussi `sameAs`, qui rattache
              le domaine à l'entreprise dans le graphe d'entités de Google.
            */}
            <ul className="flex items-center gap-2">
              {socialLinks.map((account) => (
                <li key={account.label}>
                  <a
                    href={account.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${site.name} sur ${account.label}`}
                    className="grid size-9 place-items-center rounded-xl border border-white/15 bg-white/[0.04] text-brand-200 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950"
                  >
                    <SocialIcon name={account.label} className="size-[17px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
