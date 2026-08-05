"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BatteryCharging, Sparkles, Sun, Zap } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { kitSegments, kits, type KitSegment } from "@/lib/data/kits";
import { buildProductWhatsAppLink } from "@/lib/whatsapp";

type Filter = KitSegment | "tous";

export function KitsCatalogue() {
  const [filter, setFilter] = React.useState<Filter>("tous");
  const reduce = useReducedMotion();

  const visible =
    filter === "tous" ? kits : kits.filter((k) => k.segment === filter);

  return (
    <div>
      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList aria-label="Filtrer les kits par segment">
          {kitSegments.map((seg) => (
            <TabsTrigger key={seg.id} value={seg.id}>
              {seg.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <p className="mt-8 text-sm text-slate-500" aria-live="polite">
        {visible.length} kit{visible.length > 1 ? "s" : ""} clés en main
      </p>

      <motion.div
        layout={!reduce}
        className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((kit) => (
            <motion.article
              key={kit.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-shadow hover:shadow-soft"
            >
              {/* Bandeau puissance */}
              <div className="relative flex items-center justify-between gap-3 bg-brand-950 px-6 py-5">
                <div>
                  <p className="font-display text-2xl font-bold text-white">
                    {kit.power}
                  </p>
                  <p className="text-xs font-medium text-brand-200">
                    {kit.phase}
                  </p>
                </div>
                <span className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                  <Sun className="size-6 text-solar-500" />
                </span>
                {kit.featured ? (
                  <span className="absolute -top-0 right-0 inline-flex items-center gap-1 rounded-bl-xl bg-solar-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-900">
                    <Sparkles className="!size-3" />
                    Populaire
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-base font-bold leading-snug text-slate-900">
                  {kit.name}
                </h3>

                <ul className="mt-4 space-y-2.5">
                  <li className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Zap className="mt-0.5 size-4 shrink-0 text-brand-600" />
                    {kit.inverter}
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-600">
                    <BatteryCharging className="mt-0.5 size-4 shrink-0 text-brand-600" />
                    {kit.battery}
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Sun className="mt-0.5 size-4 shrink-0 text-brand-600" />
                    {kit.panels}
                  </li>
                </ul>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Alimente
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {kit.usage}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-5">
                  <span className="text-sm font-bold text-brand-900">
                    Sur devis
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" variant="card-outline" asChild>
                      <a
                        href={buildProductWhatsAppLink(kit.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Devis WhatsApp pour ${kit.name}`}
                      >
                        <WhatsAppIcon className="!size-4 text-[#25D366]" />
                      </a>
                    </Button>
                    <Button size="sm" variant="card" asChild>
                      <Link href={`/contact?produit=${encodeURIComponent(kit.name)}`}>
                        Devis
                        <ArrowRight className="!size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
