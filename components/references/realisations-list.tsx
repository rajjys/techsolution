"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, SlidersHorizontal, X } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  projects,
  sectorGroups,
  type SectorGroup,
} from "@/lib/data/clients";
import { services } from "@/lib/data/services";
import { cn } from "@/lib/utils";

/**
 * Catégories — cantonnées aux quatre familles du système de couleurs.
 */
const CATEGORY_STYLES: Record<string, string> = {
  Solaire: "border-solar-500/30 bg-solar-50 text-solar-800",
  Backup: "border-brand-200 bg-brand-50 text-brand-800",
  Électricité: "border-ember-200 bg-ember-50 text-ember-800",
  Télécoms: "border-brand-200 bg-white text-brand-700",
  Sécurité: "border-slate-300 bg-white text-slate-700",
  Maintenance: "border-slate-200 bg-slate-100 text-slate-600",
};

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        active
          ? "border-brand-600 bg-brand-600 font-semibold text-white"
          : "border-slate-200 bg-white font-medium text-slate-700 hover:border-brand-300 hover:bg-brand-50",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Liste des réalisations, filtrable.
 *
 * Le filtrage se fait côté client : le catalogue tient en mémoire, et un
 * aller-retour serveur par clic donnait l'impression que rien ne répondait.
 * Le paramètre `?domaine=` de /services reste honoré comme état initial, ce
 * qui garde le lien profond et le rendu serveur intacts.
 *
 * Les facettes vivent dans un panneau : ce n'est pas une boutique, personne
 * ne vient trier toute la journée — la place appartient aux réalisations.
 */
export function RealisationsList({ initialDomain }: { initialDomain?: string }) {
  const [domain, setDomain] = React.useState<string | null>(
    initialDomain ?? null,
  );
  const [sector, setSector] = React.useState<SectorGroup | null>(null);
  const [open, setOpen] = React.useState(false);

  const activeService = services.find((service) => service.slug === domain);
  const activeSector = sectorGroups.find((group) => group.id === sector);

  const visible = projects.filter(
    (project) =>
      (!activeService ||
        project.category === activeService.projectCategory) &&
      (!sector || project.sectorGroup === sector),
  );

  const filterCount = (activeService ? 1 : 0) + (sector ? 1 : 0);
  const clearAll = () => {
    setDomain(null);
    setSector(null);
  };

  return (
    <div>
      {/* Barre de contrôle — une seule ligne, filtres repliés */}
      <div className="mt-8 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-5">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="neutral" size="sm">
              <SlidersHorizontal className="size-4 text-brand-600" />
              Filtrer
              {filterCount > 0 ? (
                <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                  {filterCount}
                </span>
              ) : null}
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
            <div className="border-b border-slate-100 p-5">
              <SheetTitle className="font-display text-lg font-bold text-slate-900">
                Filtrer les réalisations
              </SheetTitle>
              <SheetDescription className="mt-1 text-sm text-slate-500">
                {visible.length} réalisation{visible.length > 1 ? "s" : ""} sur{" "}
                {projects.length}
              </SheetDescription>
            </div>

            <div className="flex-1 space-y-7 overflow-y-auto p-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Domaine
                </p>
                <div className="mt-3 space-y-2">
                  <OptionButton active={!domain} onClick={() => setDomain(null)}>
                    Tous les domaines
                    <span className="text-xs opacity-70">
                      {projects.length}
                    </span>
                  </OptionButton>
                  {services.map((service) => {
                    const count = projects.filter(
                      (p) => p.category === service.projectCategory,
                    ).length;
                    return (
                      <OptionButton
                        key={service.slug}
                        active={domain === service.slug}
                        onClick={() => setDomain(service.slug)}
                      >
                        {service.shortTitle}
                        <span className="text-xs opacity-70">{count}</span>
                      </OptionButton>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Secteur du client
                </p>
                <div className="mt-3 space-y-2">
                  <OptionButton active={!sector} onClick={() => setSector(null)}>
                    Tous les secteurs
                    <span className="text-xs opacity-70">
                      {projects.length}
                    </span>
                  </OptionButton>
                  {sectorGroups.map((group) => {
                    const count = projects.filter(
                      (p) => p.sectorGroup === group.id,
                    ).length;
                    if (count === 0) return null;
                    return (
                      <OptionButton
                        key={group.id}
                        active={sector === group.id}
                        onClick={() => setSector(group.id)}
                      >
                        {group.label}
                        <span className="text-xs opacity-70">{count}</span>
                      </OptionButton>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 p-5">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={filterCount === 0}
              >
                Tout effacer
              </Button>
              <Button
                variant="card"
                size="sm"
                block
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Voir les {visible.length} réalisations
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Filtres actifs — retirables d'un clic */}
        {activeService ? (
          <button
            type="button"
            onClick={() => setDomain(null)}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:bg-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {activeService.shortTitle}
            <X className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Retirer ce filtre</span>
          </button>
        ) : null}
        {activeSector ? (
          <button
            type="button"
            onClick={() => setSector(null)}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:bg-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {activeSector.label}
            <X className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Retirer ce filtre</span>
          </button>
        ) : null}

        <p
          aria-live="polite"
          className="ml-auto text-sm font-medium text-slate-500"
        >
          {visible.length} sur {projects.length}
        </p>
      </div>

      <Stagger className="divide-y divide-slate-100">
        {visible.map((project, index) => {
          /* Les projets documentés mènent à leur étude de cas ; les autres
             restent de simples lignes, sans fausse affordance. */
          const rowClass = cn(
            "group flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-6",
            project.caseStudy &&
              "-mx-3 rounded-xl px-3 transition-colors hover:bg-brand-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          );

          const content = (
            <>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center self-start rounded-full border px-2.5 py-0.5 text-[11px] font-semibold sm:w-28 sm:justify-center",
                  CATEGORY_STYLES[project.category],
                )}
              >
                {project.category}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold leading-snug text-slate-900">
                  {project.title}
                  {project.caseStudy ? (
                    <ArrowUpRight
                      className="ml-1.5 inline size-4 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  ) : null}
                </span>
                <span className="mt-0.5 block text-sm text-slate-500">
                  {project.client}
                  {project.caseStudy ? (
                    <span className="ml-2 text-xs font-semibold text-brand-600">
                      Étude de cas
                    </span>
                  ) : null}
                </span>
              </span>

              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-slate-600 sm:w-52">
                <MapPin
                  className="size-3.5 shrink-0 text-solar-600"
                  aria-hidden="true"
                />
                {project.city} — {project.province}
              </span>
            </>
          );

          return (
            <StaggerItem
              key={`${project.title}-${project.city}-${index}`}
              y={10}
            >
              {project.caseStudy ? (
                <Link
                  href={`/references/${project.caseStudy}`}
                  className={rowClass}
                >
                  {content}
                </Link>
              ) : (
                <div className={rowClass}>{content}</div>
              )}
            </StaggerItem>
          );
        })}
      </Stagger>

      {visible.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
          Aucune réalisation ne combine ces deux critères.{" "}
          <button
            type="button"
            onClick={clearAll}
            className="font-semibold text-brand-700 underline underline-offset-4"
          >
            Effacer les filtres
          </button>
        </p>
      ) : null}
    </div>
  );
}
