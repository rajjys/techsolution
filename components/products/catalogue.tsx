"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  categoryVisuals,
  productCategories,
  products,
  type ProductCategory,
} from "@/lib/data/products";
import { buildProductWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Filter = ProductCategory | "tous";

/** Catalogue filtrable — grille animée par catégorie d'équipement. */
export function Catalogue() {
  const [filter, setFilter] = React.useState<Filter>("tous");
  const reduce = useReducedMotion();

  const visible =
    filter === "tous"
      ? products
      : products.filter((product) => product.category === filter);

  const categoryLabel = (id: ProductCategory) =>
    productCategories.find((c) => c.id === id)?.label ?? id;

  return (
    <div>
      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as Filter)}
      >
        <TabsList aria-label="Filtrer les produits par catégorie">
          {productCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              <category.icon />
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <p className="mt-8 text-sm text-slate-500" aria-live="polite">
        {visible.length} équipement{visible.length > 1 ? "s" : ""}{" "}
        {filter === "tous"
          ? "au catalogue"
          : `— ${categoryLabel(filter as ProductCategory)}`}
      </p>

      <motion.div layout={!reduce} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((product) => {
            const visual = categoryVisuals[product.category];
            return (
              <motion.article
                key={product.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-shadow hover:shadow-soft"
              >
                {/* Visuel de marque */}
                <div
                  className={cn(
                    "relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br",
                    visual.gradient,
                  )}
                >
                  <div className="absolute inset-0 bg-grid-navy" aria-hidden="true" />
                  <div
                    className="absolute -right-10 -top-10 size-40 rounded-full bg-solar-500/20 blur-2xl transition-all duration-500 group-hover:bg-solar-500/30"
                    aria-hidden="true"
                  />
                  <visual.icon
                    className="relative size-14 text-solar-500 transition-transform duration-500 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                  {product.highlight ? (
                    <Badge
                      variant="solar"
                      className="absolute left-4 top-4 shadow-md"
                    >
                      <Sparkles className="!size-3" />
                      Populaire
                    </Badge>
                  ) : null}
                  <Badge
                    variant="outline-light"
                    className="absolute bottom-4 right-4 text-[10px]"
                  >
                    {categoryLabel(product.category)}
                  </Badge>
                </div>

                {/* Contenu */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-base font-bold leading-snug text-slate-900">
                    {product.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {product.description}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {product.specs.map((spec) => (
                      <li
                        key={spec}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600"
                      >
                        {spec}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    <span className="text-sm font-bold text-navy-900">
                      Sur devis
                      <span className="block text-[11px] font-medium text-slate-400">
                        selon étude du site
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" asChild>
                        <a
                          href={buildProductWhatsAppLink(product.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Demander un devis WhatsApp pour ${product.name}`}
                        >
                          <WhatsAppIcon className="!size-4 text-[#25D366]" />
                        </a>
                      </Button>
                      <Button size="sm" asChild>
                        <Link
                          href={`/contact?produit=${encodeURIComponent(product.name)}`}
                        >
                          Devis
                          <ArrowRight className="!size-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
