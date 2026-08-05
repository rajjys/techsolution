"use client";

import Link from "next/link";

import { kitSegments, kits } from "@/lib/data/kits";
import { cn } from "@/lib/utils";

/**
 * Comparatif complet — le pendant de l'échelle : elle fait choisir, le
 * tableau fait vérifier. Groupé par usage, avec les repères courts alignés
 * en colonnes pour que la lecture se fasse de haut en bas.
 *
 * Table sémantique volontaire : c'est une vraie donnée tabulaire, et les
 * lecteurs d'écran doivent pouvoir la parcourir cellule par cellule.
 *
 * Chaque ligne renvoie à l'échelle : la puissance est un bouton qui
 * sélectionne le palier et remonte à la règle. La ligne entière est cliquable
 * pour la souris, le bouton porte l'affordance pour le clavier.
 */
export function KitsTable({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      <table className="w-full min-w-[46rem] border-collapse text-left">
        <caption className="sr-only">
          Comparatif des {kits.length} kits solaires Tech Solution : puissance,
          onduleur, batterie et panneaux.
        </caption>
        <thead>
          <tr className="border-b border-slate-300">
            {["Puissance", "Palier", "Onduleur", "Batterie", "Panneaux", ""].map(
              (heading, i) => (
                <th
                  key={heading || `col-${i}`}
                  scope="col"
                  className="pb-3 pr-4 text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-500 last:pr-0 last:text-right"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>

        {kitSegments.map((segment) => {
          const rows = kits.filter((kit) => kit.segment === segment.id);
          if (rows.length === 0) return null;

          return (
            <tbody key={segment.id}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={6}
                  className="pb-3 pt-8 text-left"
                >
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
                    <segment.icon className="size-4" strokeWidth={2.2} />
                    {segment.label}
                    <span className="font-medium normal-case tracking-normal text-slate-500">
                      — {segment.detail}
                    </span>
                  </span>
                </th>
              </tr>

              {rows.map((kit) => {
                const index = kits.indexOf(kit);
                const isActive = index === activeIndex;
                return (
                <tr
                  key={kit.id}
                  onClick={() => onSelect(index)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "cursor-pointer border-t border-slate-100 transition-colors",
                    isActive ? "bg-brand-50" : "hover:bg-brand-50/50",
                  )}
                >
                  <th scope="row" className="py-4 pr-4 align-top">
                    <button
                      type="button"
                      onClick={() => onSelect(index)}
                      className="block rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                    >
                      <span className="block font-display text-lg font-bold tabular-nums text-slate-900 underline-offset-4 hover:underline">
                        {kit.power}
                      </span>
                      <span className="sr-only">
                        {" "}
                        — voir ce palier sur l&apos;échelle
                      </span>
                    </button>
                    <span className="mt-0.5 block text-xs font-medium text-slate-500">
                      {kit.phase}
                    </span>
                  </th>
                  <td className="py-4 pr-4 align-top">
                    <span className="block text-sm font-semibold text-slate-800">
                      {kit.tier}
                    </span>
                    <span className="mt-0.5 block max-w-[15rem] text-xs leading-relaxed text-slate-500">
                      {kit.outcome}
                    </span>
                  </td>
                  <td className="py-4 pr-4 align-top text-sm tabular-nums text-slate-700">
                    {kit.specs.inverter}
                  </td>
                  <td className="py-4 pr-4 align-top text-sm tabular-nums text-slate-700">
                    {kit.specs.battery}
                  </td>
                  <td className="py-4 pr-4 align-top text-sm tabular-nums text-slate-700">
                    {kit.specs.panels}
                  </td>
                  <td className="py-4 align-top text-right">
                    <Link
                      href={`/contact?produit=${encodeURIComponent(kit.name)}`}
                      className="inline-flex whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      Devis
                      <span className="sr-only"> pour le {kit.name}</span>
                    </Link>
                  </td>
                </tr>
                );
              })}
            </tbody>
          );
        })}
      </table>
    </div>
  );
}
