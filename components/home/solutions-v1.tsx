import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Home,
  ShieldCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Card = {
  icon: LucideIcon;
  capacity: string;
  title: string;
  target: string;
  tags: string[];
  copy: string;
  features: string[];
  cta: { label: string; href: string };
  variant: "outline" | "default";
  featured?: boolean;
};

const cards: Card[] = [
  {
    icon: Home,
    capacity: "2 kW – 6 kW+",
    title: "Résidentiel & Villas",
    target: "Propriétaires exigeants, villas & résidences.",
    tags: ["100% Lithium", "Autonomie 24/7", "Silencieux"],
    copy: "Alimentation continue pour vos appareils sensibles. Fini les générateurs bruyants et les batteries plomb défaillantes après 6 mois.",
    features: [
      "Dimensionnement exact par audit de charge",
      "Batteries lithium haute durabilité",
      "Garantie installation 1 an",
    ],
    cta: { label: "Étude pour ma résidence", href: "/contact" },
    variant: "outline",
  },
  {
    icon: Building2,
    capacity: "10 kW – 40 kW+",
    title: "Commercial & Hôtellerie",
    target: "Hôtels, bureaux, cliniques & agences.",
    tags: ["Zéro temps d'arrêt", "Réduction facture SNEL", "Centrales hybrides"],
    copy: "Garantissez la continuité totale de vos opérations commerciales. Capacité prouvée jusqu'à 40 kW+ pour complexes hôteliers et sièges.",
    features: [
      "Relais automatique instantané (0 ms)",
      "Protection des équipements informatiques",
      "Maintenance préventive dédiée",
    ],
    cta: { label: "Devis professionnel", href: "/contact" },
    variant: "default",
    featured: true,
  },
  {
    icon: Wrench,
    capacity: "Audit & suivi",
    title: "Audit, Reprise & Maintenance",
    target: "Reprise d'installations existantes & suivi long terme.",
    tags: ["Diagnostic de panne", "Migration Lithium", "Suivi annuel"],
    copy: "Votre système actuel ne tient plus la charge ? Nos ingénieurs auditent, corrigent et prennent en charge la maintenance de votre parc.",
    features: [
      "Diagnostic technique sur site",
      "Remplacement par batteries lithium",
      "Contrats de maintenance annuelle",
    ],
    cta: { label: "Demander un diagnostic", href: "/contact" },
    variant: "outline",
  },
];

const trust: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: ShieldCheck,
    title: "Garantie 1 an",
    desc: "Sur installation intégrée, sans altération.",
  },
  {
    icon: BatteryCharging,
    title: "100% Lithium Grade A",
    desc: "Aucune batterie bas de gamme.",
  },
  {
    icon: Users,
    title: "Équipes techniques locales",
    desc: "Intervention et suivi rapides.",
  },
  {
    icon: ClipboardCheck,
    title: "Contrats de maintenance",
    desc: "Visites de contrôle régulières.",
  },
];

export function SolutionsV1() {
  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="container">
        {/* En-tête */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-brand-700">
            Ingénierie &amp; sécurité énergétique
          </span>
          <h2 className="mt-5 text-3xl font-bold leading-[1.15] text-slate-900 md:text-4xl lg:text-[36px] lg:leading-[42px]">
            Des installations solaires conçues pour durer.{" "}
            <span className="text-brand-600">Sans compromis.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            Que ce soit pour votre résidence principale ou votre établissement
            commercial, nous déployons uniquement du matériel de grade
            industriel (100% Lithium) sous supervision d&apos;ingénieurs
            qualifiés.
          </p>
        </Reveal>

        {/* Grille 3 cartes */}
        <Stagger className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {cards.map((card) => (
            <StaggerItem key={card.title} className="h-full">
              <article
                className={cn(
                  "group flex h-full flex-col rounded-2xl border bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft lg:p-8",
                  card.featured
                    ? "border-navy-200 ring-1 ring-navy-950/5"
                    : "border-slate-200",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-navy-950 shadow-sm">
                    <card.icon className="size-6 text-solar-500" />
                  </span>
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
                    {card.capacity}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {card.target}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {card.copy}
                </p>

                <ul className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                  {card.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm font-medium text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-solar-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant={card.variant} className="mt-8 w-full" asChild>
                  <Link href={card.cta.href}>
                    {card.cta.label}
                    <ArrowRight />
                  </Link>
                </Button>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Bandeau confiance & garantie */}
        <Reveal className="mt-10 lg:mt-12">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-card sm:grid-cols-2 lg:grid-cols-4">
            {trust.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3.5 bg-white p-6"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-solar-500/15">
                  <item.icon className="size-5 text-solar-700" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
