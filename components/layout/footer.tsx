import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, ShieldCheck } from "lucide-react";

import { FooterCta, FooterLead } from "@/components/layout/footer-cta";
import { Logo } from "@/components/logo";
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
import { services } from "@/lib/data/services";

/**
 * Masque du filigrane — le glyphe seul, en tracé, sans le wordmark.
 *
 * Fichier dédié : un masque CSS n'utilise que le canal alpha, la couleur est
 * ignorée. `logo-mark-blue.png` pesait 40 Ko de RVB inutile — deuxième
 * ressource la plus lourde du site — pour un filigrane rendu à 9 % d'opacité.
 * Celui-ci ne porte que l'alpha, quantifié sur 16 niveaux : 6 Ko, sans
 * différence visible sous le dégradé qui le remplit.
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
 * capitales, interlettrage 0.18em) mais en `<h3>` : la rangée du bas porte
 * de vraies têtes de rubrique, pas des étiquettes décoratives.
 */
function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white lg:text-xs">
      <BoltRule className="h-2 w-[28px] shrink-0 text-solar-500" />
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
        <div className="grid gap-10 border-b border-white/10 py-12 lg:grid-cols-[1.55fr_1fr] lg:gap-0 lg:py-14">
          <div className="lg:pr-14 xl:pr-20">
            <Eyebrow onDark>Parlons de votre projet</Eyebrow>
            <h2 className="mt-5 text-balance text-[26px] font-bold leading-[1.15] text-white sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[42px] lg:leading-[1.08]">
              Le soleil se couche.{" "}
              <span className="text-solar-400">Vos lumières, non.</span>
            </h2>
            <FooterLead />
            <FooterCta />

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

            {/*
              Comptes officiels. Ils n'existaient nulle part sur le site : ni
              pour le visiteur, ni pour `sameAs`, qui est ce qui rattache le
              domaine à l'entreprise dans le graphe d'entités de Google.
            */}
            <ul className="mt-6 flex items-center gap-2.5">
              {socialLinks.map((account) => (
                <li key={account.label}>
                  <a
                    href={account.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${site.name} sur ${account.label}`}
                    className="grid size-10 place-items-center rounded-xl border border-white/15 bg-white/[0.04] text-brand-200 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950"
                  >
                    <SocialIcon name={account.label} className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/*
          Utilitaire — deux colonnes jusqu'à lg (les listes sont courtes, elles
          tiennent côte à côte dès 360 px), trois colonnes séparées par des
          filets ensuite : même dispositif que la section « Ce que nous
          offrons », qui divise déjà ses quatre engagements.
        */}
        {/*
          Colonnes inégales, parce que leur contenu l'est : deux listes de
          liens courts n'ont pas besoin du même tiers qu'un bloc de deux
          fiches d'adresse.
        */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-12 lg:grid-cols-[0.8fr_1fr_1.75fr] lg:gap-0 lg:divide-x lg:divide-white/10 lg:py-12">
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
            {/*
              Côte à côte, y compris sur desktop. Empilées (`lg:grid-cols-1`),
              les deux fiches faisaient 262 px et fixaient à elles seules la
              hauteur des trois colonnes : Navigation se retrouvait avec 151 px
              de vide en pied. Côte à côte, elles font 131 px, et c'est
              Expertises — la plus longue des trois listes — qui donne la
              hauteur. La colonne reçoit la largeur qu'il faut ci-dessus.
            */}
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {offices.map((office) => (
                <li key={office.city}>
                  {/*
                    Ouvrable dans une carte. « près du Rond-Point Zéro » est
                    exactement ce qu'on cherche à pointer depuis un téléphone,
                    et l'adresse restait un texte mort sur toutes les pages.
                    C'est une recherche, pas une épingle inventée.
                  */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      formatOfficeAddress(office),
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500"
                  >
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <MapPin
                        className={`size-4 shrink-0 ${
                          office.headquarters
                            ? "text-solar-400"
                            : "text-brand-300"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="font-semibold text-white lg:text-[15px]">
                        {office.city}
                      </span>
                      <span className="rounded-full border border-white/15 px-1.5 py-px text-[9.5px] font-bold uppercase tracking-[0.12em] text-brand-200">
                        {office.role}
                      </span>
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-brand-200">
                      {office.street}
                    </span>
                    <span className="mt-0.5 block text-xs text-brand-300">
                      {office.region}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-solar-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      Ouvrir dans Maps
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {/*
              La preuve d'abord, la capacité ensuite. « Interventions dans les
              26 provinces » figurait seul, sur les treize pages, et Google le
              reprenait tel quel en extrait : une promesse de couverture met en
              concurrence avec tout le pays, là où une livraison prouvée
              distingue. Les deux chiffres viennent de la donnée.
            */}
            <p className="mt-4 text-xs text-brand-300">
              {`${projects.length} installations livrées dans ${site.provincesDelivered} provinces — interventions sur les ${provinces.length}.`}
            </p>
          </div>
        </div>

        {/*
          ── Barre légale ──────────────────────────────────────────────

          Elle dégage le coin bas-droit, où le bouton WhatsApp flottant est
          ancré. Il est `fixed` : arrivé en bas de page, il se pose sur le
          dernier bloc de cette barre et en tronquait la fin. Sous `md` la
          barre est empilée, donc c'est un rembourrage bas qu'il lui faut ;
          au-delà elle est en ligne, et c'est la marge droite du dernier bloc.
        */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 pb-24 text-center text-[13px] text-brand-200 sm:text-sm md:flex-row md:pb-7 md:text-left lg:py-8 lg:pb-8">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 md:justify-start">
            <span>
              © {year}{" "}
              <span className="font-semibold text-white">
                {site.legalName}
              </span>{" "}
              — {site.domain}.
            </span>
            <Link
              href="/confidentialite"
              className="underline underline-offset-2 transition-colors hover:text-white"
            >
              Confidentialité
            </Link>
          </p>

          {/*
            Identifiants légaux : en RDC ce sont les trois numéros qu'un
            acheteur institutionnel vérifie avant d'ouvrir un dossier. Le pied
            de page affichait « Certifié & agréé » sans rien pour l'étayer.
            En `tabular-nums`, et sur une ligne qui se replie.
          */}
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] tabular-nums text-brand-300 md:justify-start lg:text-xs">
            {/*
              Séparateur visible à toutes les largeurs — `Dot` s'efface sous
              `sm`, et trois numéros longs collés ne se relisent plus. C'est
              précisément la ligne qu'on recopie dans un dossier.
            */}
            {[
              `RCCM ${legal.rccm}`,
              `ID. Nat. ${legal.idnat}`,
              `NIF ${legal.nif}`,
            ].map((entry, index) => (
              <span key={entry} className="flex items-center gap-3">
                {index > 0 ? (
                  <span
                    className="size-1 shrink-0 rounded-full bg-white/25"
                    aria-hidden="true"
                  />
                ) : null}
                {entry}
              </span>
            ))}
          </p>
          <p className="flex items-center gap-2.5 md:pr-16 lg:pr-20">
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
