"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardCheck,
  Star,
} from "lucide-react";

import { BoltRule } from "@/components/icons";
import { KitLink } from "@/components/products/kit-link";
import { projects } from "@/lib/data/clients";
import { kitSegments, kits, kitsForSegment } from "@/lib/data/kits";
import { productCategories } from "@/lib/data/products";
import { services } from "@/lib/data/services";
import {
  contactHref,
  kitHref,
  productCategoryHref,
  serviceHref,
} from "@/lib/routes";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Navigation principale — méga-menus pour Services et Produits.
 *
 * Ce que le motif doit tenir, et pourquoi :
 *
 * - **Des liens dans le HTML servi.** Les panneaux fermés sont `hidden`, pas
 *   démontés : les six services et les neuf kits restent des liens que Google
 *   découvre depuis chaque page du site. C'est le maillage le plus large du
 *   site, et il ne coûte rien.
 * - **Rien à télécharger tant que rien n'est ouvert.** Un panneau `hidden`
 *   n'a pas de boîte : ses photos, en `loading="lazy"`, ne partent qu'à la
 *   première ouverture. Une barre de navigation présente sur toutes les pages
 *   ne doit pas alourdir toutes les pages.
 * - **L'intitulé mène au hub, le chevron ouvre le panneau.** Cliquer
 *   « Services » ouvre /services, comme partout ailleurs sur le web ; le
 *   panneau vient au survol. Mais le survol n'existe ni au doigt ni au
 *   clavier : le chevron est donc un vrai bouton, seul moyen d'ouvrir le
 *   panneau sur une tablette en paysage (≥ lg) — le motif « navigation de
 *   divulgation avec liens de premier niveau » du guide ARIA du W3C.
 * - **Un motif de divulgation, pas un `menu` ARIA.** Le rôle `menu` promet
 *   les flèches d'une barre d'application ; ici ce sont des liens. Bouton
 *   `aria-expanded` + panneau `aria-controls`, et la touche Tab fait le reste,
 *   parce que chaque panneau suit son déclencheur dans le DOM. ↓ sur
 *   l'intitulé ou le chevron ouvre le panneau et y entre.
 * - **L'intention au survol.** Ouverture après 90 ms (on ne déclenche pas un
 *   panneau en traversant la barre), fermeture après 160 ms (on a le temps de
 *   descendre jusqu'au panneau). Le `<li>` occupe toute la hauteur de la
 *   barre et le panneau commence par un pont transparent : il n'y a aucun
 *   interstice où la souris quitterait le menu en chemin.
 */

export type MenuId = "services" | "produits";

const MENU_FOR: Record<string, MenuId> = {
  "/services": "services",
  "/produits": "produits",
};

const OPEN_DELAY = 90;
const CLOSE_DELAY = 160;

/** Intitulé de colonne — la grammaire de l'`Eyebrow`, à l'échelle d'un panneau. */
function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-900">
      <BoltRule className="h-2 w-[26px] shrink-0 text-solar-500" />
      {children}
    </p>
  );
}

/** Renvoi en bas ou en tête de panneau — texte, jamais un bouton. */
function PanelLink({
  href,
  onNavigate,
  children,
  className,
}: {
  href: string;
  onNavigate?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group/pl inline-flex items-center gap-1.5 rounded text-sm font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/pl:translate-x-0.5" />
    </Link>
  );
}

/**
 * L'encart de droite des deux panneaux — une photo nette, un titre, une
 * phrase, un renvoi. Masqué sous xl : à cette largeur, la liste a besoin de
 * toute la place.
 */
function PanelAside({
  image,
  title,
  text,
  link,
  onNavigate,
}: {
  image: { src: string; alt: string };
  title: string;
  text: string;
  link: { href: string; label: string };
  onNavigate: () => void;
}) {
  return (
    <aside className="hidden flex-col bg-brand-50 p-6 xl:flex xl:p-8">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-brand-100">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="216px"
          loading="lazy"
          className="object-cover"
        />
      </div>
      <p className="mt-5 text-[15px] font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{text}</p>
      <PanelLink
        href={link.href}
        onNavigate={onNavigate}
        className="mt-4 self-start"
      >
        {link.label}
      </PanelLink>
    </aside>
  );
}

function ServicesPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <div className="grid xl:grid-cols-[1fr_17.5rem]">
        <div className="p-6 xl:p-8">
          <PanelTitle>Nos expertises</PanelTitle>
          <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-1">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={serviceHref(service.slug)}
                  onClick={onNavigate}
                  className="group/svc flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-inset ring-brand-100 transition-colors group-hover/svc:bg-white">
                    <service.icon
                      className="size-5 text-brand-600"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold leading-tight text-slate-900">
                      {service.shortTitle}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-[13px] leading-snug text-slate-500">
                      {service.outcome}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Même encart que le panneau Produits : la photo, puis le texte. */}
        <PanelAside
          image={{
            src: "/photos/pose-onduleur-duo.webp",
            alt: "Deux techniciens Tech Solution RDC au travail sur un onduleur mural",
          }}
          title={`${projects.length} installations documentées`}
          text={`ONG, banques, hôtellerie, radios — et ${site.householdsEquipped}+ foyers équipés.`}
          link={{ href: "/references", label: "Voir nos réalisations" }}
          onNavigate={onNavigate}
        />
      </div>

      <div className="flex items-center justify-between gap-6 border-t border-dashed border-slate-200 bg-slate-50/70 px-6 py-3.5 xl:px-8">
        <p className="inline-flex items-center gap-2 text-[13px] text-slate-600">
          <ClipboardCheck
            className="size-4 shrink-0 text-brand-600"
            aria-hidden="true"
          />
          Audit sur site gratuit — réponse sous 24 h ouvrées.
        </p>
        <PanelLink href="/services" onNavigate={onNavigate}>
          Tous nos services
        </PanelLink>
      </div>
    </>
  );
}

const PRODUCT_PROMISES = [
  "Dimensionnement inclus",
  "Pose par nos techniciens",
  "Garantie d'un an renouvelable",
];

function ProductsPanel({ onNavigate }: { onNavigate: () => void }) {
  const kitsCategory = productCategories[0];
  const largest = kits[kits.length - 1];

  return (
    <>
      <div className="grid xl:grid-cols-[1fr_17.5rem]">
        <div className="p-6 xl:p-8">
          <div className="flex items-center justify-between gap-4">
            <PanelTitle>{kitsCategory.name}</PanelTitle>
            <PanelLink
              href={productCategoryHref(kitsCategory.slug)}
              onNavigate={onNavigate}
            >
              {`Comparer les ${kits.length} kits`}
            </PanelLink>
          </div>

          {/* Par usage, le foyer d'abord — on sait ce qu'on veut alimenter
              avant de savoir combien de kVA il faut. */}
          <div className="mt-5 grid grid-cols-3 gap-5">
            {kitSegments.map((segment) => (
              <div key={segment.id} className="min-w-0">
                <p className="flex items-center gap-2 px-2.5 text-[13px] font-bold text-slate-900">
                  <segment.icon
                    className="size-4 shrink-0 text-brand-600"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {segment.label}
                </p>
                <p className="mt-0.5 px-2.5 text-xs text-slate-500">
                  {segment.detail}
                </p>
                <ul className="mt-3 space-y-0.5">
                  {kitsForSegment(segment.id).map((kit) => (
                    <li key={kit.slug}>
                      <KitLink kit={kit} onNavigate={onNavigate} compact />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <PanelAside
          image={{
            src: "/photos/produits-onduleur-batterie.webp",
            alt: "Onduleur hybride et batterie lithium avant installation",
          }}
          title={`Au-delà de ${largest.power}`}
          text="Hôtels, sites industriels, bâtiments publics : le système se dimensionne sur votre site, après audit."
          link={{
            href: contactHref({ service: "energie-solaire" }),
            label: "Demander une étude",
          }}
          onNavigate={onNavigate}
        />
      </div>

      <div className="flex items-center justify-between gap-6 border-t border-dashed border-slate-200 bg-slate-50/70 px-6 py-3.5 xl:px-8">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-slate-600">
          {PRODUCT_PROMISES.map((promise) => (
            <li key={promise} className="inline-flex items-center gap-1.5">
              <Check
                className="size-3.5 shrink-0 text-brand-600"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              {promise}
            </li>
          ))}
        </ul>
        <div className="flex shrink-0 items-center gap-5">
          <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-500">
            <Star
              className="size-3.5 fill-brand-600 text-brand-600"
              aria-hidden="true"
            />
            Le plus demandé
          </span>
          <PanelLink href="/produits" onNavigate={onNavigate}>
            Tout le catalogue
          </PanelLink>
        </div>
      </div>
    </>
  );
}

const PANELS: Record<
  MenuId,
  (props: { onNavigate: () => void }) => React.ReactElement
> = {
  services: ServicesPanel,
  produits: ProductsPanel,
};

/**
 * Barre de navigation desktop. L'état d'ouverture appartient à l'en-tête :
 * c'est lui qui doit quitter l'état « fondu dans le hero » quand un panneau
 * blanc s'ouvre, et refermer le panneau quand on défile.
 */
export function DesktopNav({
  onHero,
  openMenu,
  onOpenMenuChange,
  isActive,
}: {
  onHero: boolean;
  openMenu: MenuId | null;
  onOpenMenuChange: (menu: MenuId | null) => void;
  isActive: (href: string) => boolean;
}) {
  const openTimer = React.useRef<number | undefined>(undefined);
  const closeTimer = React.useRef<number | undefined>(undefined);
  /* Un clic juste après une ouverture au survol ne doit pas refermer. */
  const openedAt = React.useRef(0);
  const navRef = React.useRef<HTMLElement>(null);

  const clearTimers = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  };

  const open = React.useCallback(
    (menu: MenuId) => {
      openedAt.current = Date.now();
      onOpenMenuChange(menu);
    },
    [onOpenMenuChange],
  );
  const close = React.useCallback(() => {
    clearTimers();
    onOpenMenuChange(null);
  }, [onOpenMenuChange]);

  /* Échap referme et rend le focus au déclencheur ; un clic hors de
     l'en-tête referme. Abonnements tant qu'un panneau est ouvert. */
  React.useEffect(() => {
    if (!openMenu) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      document.getElementById(`${openMenu}-trigger`)?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      const header = navRef.current?.closest("header");
      if (header && !header.contains(event.target as Node)) close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openMenu, close]);

  React.useEffect(() => clearTimers, []);

  const linkTone = (active: boolean) =>
    onHero
      ? active
        ? "text-white"
        : "text-brand-200 hover:bg-white/10 hover:text-white"
      : active
        ? "text-slate-900"
        : "text-slate-600 hover:bg-brand-50 hover:text-slate-900";

  /* Texte des deux cibles d'un méga-menu — le fond est porté par la pastille. */
  const itemTone = (strong: boolean) =>
    onHero
      ? strong
        ? "text-white"
        : "text-brand-200 group-hover/item:text-white"
      : strong
        ? "text-slate-900"
        : "text-slate-600 group-hover/item:text-slate-900";

  /* ↓ depuis l'intitulé ou le chevron : ouvre et entre dans le panneau. */
  const openAndFocus = (event: React.KeyboardEvent, menu: MenuId) => {
    event.preventDefault();
    clearTimers();
    open(menu);
    /* Le panneau s'affiche au rendu suivant. */
    window.requestAnimationFrame(() =>
      document
        .getElementById(`${menu}-panel`)
        ?.querySelector<HTMLElement>("a")
        ?.focus(),
    );
  };

  const underline = (
    <span
      className={cn(
        "absolute inset-x-4 -bottom-px h-[3px] rounded-full",
        onHero ? "bg-solar-500" : "bg-brand-600",
      )}
    />
  );

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Navigation principale"
        className="hidden self-stretch lg:flex"
      >
        <ul className="flex items-stretch gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const menu = MENU_FOR[link.href];

            if (!menu) {
              return (
                <li key={link.href} className="flex items-center">
                  <Link
                    href={link.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-lg px-4 py-2 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500",
                      linkTone(active),
                    )}
                  >
                    {link.label}
                    {active ? underline : null}
                  </Link>
                </li>
              );
            }

            const expanded = openMenu === menu;
            const Panel = PANELS[menu];

            return (
              <li
                key={link.href}
                className="flex items-center"
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse") return;
                  clearTimers();
                  /* Passer d'un panneau à l'autre est immédiat ; ouvrir le
                     premier attend l'intention. */
                  if (openMenu) open(menu);
                  else
                    openTimer.current = window.setTimeout(
                      () => open(menu),
                      OPEN_DELAY,
                    );
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType !== "mouse") return;
                  clearTimers();
                  closeTimer.current = window.setTimeout(close, CLOSE_DELAY);
                }}
                onBlur={(event) => {
                  /* Le focus quitte le déclencheur et son panneau : on replie. */
                  if (
                    expanded &&
                    !event.currentTarget.contains(event.relatedTarget as Node)
                  ) {
                    close();
                  }
                }}
              >
                {/*
                  Deux cibles, une seule pastille : l'intitulé est un lien vers
                  la page du hub, le chevron est le bouton du panneau. Au
                  survol, le panneau s'ouvre de lui-même ; au doigt (tablette)
                  et au clavier, c'est le chevron qui l'ouvre.
                */}
                <div
                  className={cn(
                    "group/item relative flex items-center rounded-lg transition-colors",
                    expanded
                      ? onHero
                        ? "bg-white/10"
                        : "bg-brand-50"
                      : onHero
                        ? "hover:bg-white/10"
                        : "hover:bg-brand-50",
                  )}
                >
                  <Link
                    href={link.href}
                    onClick={close}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown") openAndFocus(event, menu);
                    }}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg py-2 pl-4 pr-1 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500",
                      itemTone(active || expanded),
                    )}
                  >
                    {link.label}
                  </Link>
                  <button
                    type="button"
                    id={`${menu}-trigger`}
                    aria-expanded={expanded}
                    aria-controls={`${menu}-panel`}
                    aria-label={`${link.label} : sous-menu`}
                    onClick={() => {
                      clearTimers();
                      if (!expanded) open(menu);
                      else if (Date.now() - openedAt.current > 400) close();
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown") openAndFocus(event, menu);
                    }}
                    className={cn(
                      "grid h-10 place-items-center rounded-lg pl-1 pr-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500",
                      itemTone(active || expanded),
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform duration-200",
                        expanded && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  {active ? (
                    <span
                      className={cn(
                        "absolute -bottom-px left-4 right-3 h-[3px] rounded-full",
                        onHero ? "bg-solar-500" : "bg-brand-600",
                      )}
                    />
                  ) : null}
                </div>

                {/*
                  Positionné par rapport à l'en-tête (le `<li>` reste statique) :
                  le panneau prend la largeur du conteneur, pas celle du lien.
                */}
                <div
                  id={`${menu}-panel`}
                  hidden={!expanded}
                  className="absolute inset-x-0 top-full z-10 pt-2"
                >
                  <div className="mx-auto max-w-[1304px] px-5 sm:px-6 lg:px-8 xl:px-10">
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_36px_80px_-28px_rgba(11,10,51,0.42)] motion-safe:duration-200 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-2">
                      <Panel onNavigate={close} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Voile sous le panneau — le clic referme, la page reste visible */}
      {openMenu ? (
        <div
          className="absolute inset-x-0 top-full hidden h-[100dvh] bg-brand-950/25 motion-safe:duration-200 motion-safe:animate-in motion-safe:fade-in-0 lg:block"
          onClick={close}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}

/**
 * Le même contenu dans le panneau mobile, en accordéon. La section de la page
 * courante s'ouvre d'elle-même : sur une fiche kit, la liste des kits est
 * déjà dépliée.
 */
export function MobileNav({
  onNavigate,
  isActive,
}: {
  onNavigate: () => void;
  isActive: (href: string) => boolean;
}) {
  const current = navLinks.find(
    (link) => MENU_FOR[link.href] && isActive(link.href),
  );

  const row =
    "flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-base font-semibold transition-colors";

  return (
    <nav aria-label="Navigation mobile" className="flex flex-col gap-1">
      <AccordionPrimitive.Root
        type="single"
        collapsible
        defaultValue={current ? MENU_FOR[current.href] : undefined}
        className="flex flex-col gap-1"
      >
        {navLinks
          .filter((link) => MENU_FOR[link.href])
          .map((link) => {
            const menu = MENU_FOR[link.href];
            const active = isActive(link.href);
            return (
              <AccordionPrimitive.Item key={link.href} value={menu}>
                {/* Comme sur desktop : l'intitulé mène au hub, le chevron
                    déplie la liste — séparés par un filet, pour qu'on voie
                    deux cibles et non une. */}
                <AccordionPrimitive.Header className="group/acc flex items-stretch rounded-xl transition-colors data-[state=open]:bg-brand-50">
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      row,
                      "flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500",
                      active ? "text-brand-700" : "text-slate-700 hover:bg-brand-50",
                    )}
                  >
                    {link.label}
                  </Link>
                  <AccordionPrimitive.Trigger
                    aria-label={`${link.label} : sous-menu`}
                    className="relative grid w-14 shrink-0 place-items-center rounded-xl text-slate-500 transition-colors before:absolute before:inset-y-3 before:left-0 before:w-px before:bg-slate-200 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500"
                  >
                    <ChevronDown
                      className="size-5 transition-transform duration-200 group-data-[state=open]/acc:rotate-180"
                      aria-hidden="true"
                    />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  {menu === "services" ? (
                    <ul className="space-y-0.5 py-2 pl-2">
                      {services.map((service) => (
                        <li key={service.slug}>
                          <Link
                            href={serviceHref(service.slug)}
                            onClick={onNavigate}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-slate-700 hover:bg-brand-50"
                          >
                            <service.icon
                              className="size-[18px] shrink-0 text-brand-600"
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />
                            {service.shortTitle}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href="/services"
                          onClick={onNavigate}
                          className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-brand-700"
                        >
                          Tous nos services
                          <ArrowRight className="size-3.5" aria-hidden="true" />
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    <div className="space-y-3 py-2 pl-2">
                      {kitSegments.map((segment) => (
                        <div key={segment.id}>
                          <p className="flex items-center gap-2 px-3 pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            <segment.icon className="size-3.5" aria-hidden="true" />
                            {segment.label}
                          </p>
                          <ul className="mt-1">
                            {kitsForSegment(segment.id).map((kit) => (
                              <li key={kit.slug}>
                                <Link
                                  href={kitHref(kit)}
                                  onClick={onNavigate}
                                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] text-slate-700 hover:bg-brand-50"
                                >
                                  <span className="w-[4.25rem] shrink-0 font-display font-bold tabular-nums text-brand-700">
                                    {kit.power}
                                  </span>
                                  <span className="font-medium">{kit.tier}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="flex flex-col gap-1 border-t border-dashed border-slate-200 pt-2">
                        <Link
                          href={productCategoryHref("kits-solaires")}
                          onClick={onNavigate}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-brand-700"
                        >
                          {`Comparer les ${kits.length} kits`}
                          <ArrowRight className="size-3.5" aria-hidden="true" />
                        </Link>
                        <Link
                          href="/produits"
                          onClick={onNavigate}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-brand-700"
                        >
                          Tout le catalogue
                          <ArrowRight className="size-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  )}
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            );
          })}
      </AccordionPrimitive.Root>

      {navLinks
        .filter((link) => !MENU_FOR[link.href])
        .map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                row,
                active ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-brand-50",
              )}
            >
              {link.label}
              <ArrowRight
                className={cn("size-4", active ? "text-white" : "text-slate-300")}
                aria-hidden="true"
              />
            </Link>
          );
        })}
    </nav>
  );
}
