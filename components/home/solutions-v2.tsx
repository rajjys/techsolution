import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Home,
  ShieldCheck,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Card = {
  icon: LucideIcon;
  title: string;
  capacity: string;
  target: string;
  content: string;
  note?: string;
  badges: string[];
  cta: { label: string; href: string };
  variant: "outline" | "default";
  featured?: boolean;
};

const cards: Card[] = [
  {
    icon: Home,
    title: "Résidentiel Haut de Gamme",
    capacity: "2 kW – 6 kW+",
    target: "Villas, résidences principales, habitations familiales.",
    content:
      "Conçu pour ceux qui ont déjà été déçus par des systèmes bas de gamme. Alimentation 24/7 silencieuse, dimensionnée sur vos équipements réels.",
    badges: ["Stockage 100% Lithium", "Garantie 1 an", "Équipe technique locale"],
    cta: { label: "Demander une étude maison", href: "/contact" },
    variant: "outline",
  },
  {
    icon: Building2,
    title: "Commercial & Hôtellerie",
    capacity: "10 kW – 40 kW+",
    target: "Hôtels, sièges d'entreprises, agences, cliniques.",
    content:
      "Infrastructures hybrides haute capacité. Garantissez la continuité opérationnelle de votre établissement sans coupures ni baisse de tension.",
    note: "Référence : centrale hybride 40 kW déployée pour un complexe hôtelier à Kinshasa.",
    badges: ["Relais 0 ms", "Dimensionnement lourd", "Superviseur dédié"],
    cta: { label: "Étude projet commercial", href: "/contact" },
    variant: "default",
    featured: true,
  },
];

const maintenance: { icon: LucideIcon; text: string }[] = [
  { icon: ShieldCheck, text: "Garantie constructeur & installation 1 an" },
  { icon: CalendarCheck, text: "Visites techniques périodiques & inspection" },
  { icon: Wrench, text: "Intervention rapide par nos équipes locales" },
];

export function SolutionsV2() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container">
        {/* En-tête */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-brand-700">
            Architecture &amp; capacités
          </span>
          <h2 className="mt-5 text-3xl font-bold leading-[1.15] text-slate-900 md:text-4xl lg:text-[36px] lg:leading-[42px]">
            Des installations solaires conçues pour durer.{" "}
            <span className="text-brand-600">Sans compromis.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            Ingénierie sur-mesure, batteries 100% Lithium et accompagnement
            technique local pour résidences et entreprises.
          </p>
        </Reveal>

        {/* 2 grandes cartes */}
        <Stagger className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {cards.map((card) => (
            <StaggerItem key={card.title} className="h-full">
              <article
                className={cn(
                  "group flex h-full flex-col rounded-3xl border bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft lg:p-10",
                  card.featured
                    ? "border-navy-200 ring-1 ring-navy-950/5"
                    : "border-slate-200",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-navy-950 shadow-sm">
                    <card.icon className="size-7 text-solar-500" />
                  </span>
                  <span className="rounded-full bg-brand-600 px-4 py-1.5 font-display text-sm font-bold text-white">
                    {card.capacity}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-sm font-medium text-slate-500">
                  {card.target}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                  {card.content}
                </p>

                {card.note ? (
                  <div className="mt-5 flex items-start gap-3 rounded-xl border border-solar-500/30 bg-solar-50 p-4">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-solar-600" />
                    <p className="text-sm font-medium text-navy-900">
                      {card.note}
                    </p>
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-2">
                  {card.badges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      <CheckCircle2 className="size-3.5 text-solar-600" />
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex-1" />
                <Button variant={card.variant} className="w-full sm:w-auto" asChild>
                  <Link href={card.cta.href}>
                    {card.cta.label}
                    <ArrowRight />
                  </Link>
                </Button>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Bandeau SAV & maintenance — navy pleine largeur */}
        <Reveal className="mt-6 lg:mt-8">
          <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-8 shadow-lift lg:p-12">
            <div className="absolute inset-0 bg-grid-navy" aria-hidden="true" />
            <div
              className="absolute -right-20 -top-24 size-72 rounded-full bg-solar-500/10 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-solar-500">
                  Service après-vente
                </span>
                <h3 className="mt-4 text-2xl font-bold text-white md:text-3xl">
                  Service après-vente &amp; contrats de maintenance
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-navy-100/85 md:text-base">
                  Nos ingénieurs assurent le suivi régulier de vos installations
                  pour garantir une autonomie maximale, année après année.
                </p>
              </div>

              <ul className="grid gap-4">
                {maintenance.map((item) => (
                  <li
                    key={item.text}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-solar-500/15">
                      <item.icon className="size-5 text-solar-500" />
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
