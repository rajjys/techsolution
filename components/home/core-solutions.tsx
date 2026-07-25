import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Factory,
  Home,
  KeyRound,
  Ruler,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Solution = {
  number: string;
  icon: LucideIcon;
  audience: string;
  title: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  variant: "outline" | "default";
  featured?: boolean;
};

const solutions: Solution[] = [
  {
    number: "01",
    icon: Home,
    audience: "Domiciles & villas",
    title: "Systèmes Résidentiels",
    description:
      "Alimentation continue 24/7 pour votre domicile. Adieu aux groupes électrogènes bruyants et aux coupures intempestives.",
    features: [
      "Hybridation SNEL / solaire",
      "Stockage lithium haute durée",
      "Dimensionnement sur-mesure",
    ],
    cta: { label: "Explorer les packs maison", href: "/produits" },
    variant: "outline",
  },
  {
    number: "02",
    icon: Building2,
    audience: "Commercial & tertiaire",
    title: "Bureaux & Commerces",
    description:
      "Garantissez la continuité opérationnelle de vos équipes et protégez vos équipements électroniques sensibles.",
    features: [
      "Zéro temps d'arrêt (relais instantané)",
      "Réduction nette de vos factures d'énergie",
      "Supervision à distance",
    ],
    cta: { label: "Étude pour entreprise", href: "/contact" },
    variant: "default",
    featured: true,
  },
  {
    number: "03",
    icon: Factory,
    audience: "Industriel & projets RDC",
    title: "Sites Industriels & ONG",
    description:
      "Centrales solaires de forte puissance pour sites isolés, installations minières et infrastructures clés.",
    features: [
      "Projets hors-réseau (off-grid)",
      "Ingénierie & conteneurs solaires",
      "Déploiement toutes provinces",
    ],
    cta: { label: "Consulter l'ingénierie", href: "/services" },
    variant: "outline",
  },
];

const distinctions: { icon: LucideIcon; title: string; description: string }[] =
  [
    {
      icon: ShieldCheck,
      title: "Matériel Tier 1 certifié",
      description: "Composants de classe mondiale garantis.",
    },
    {
      icon: Ruler,
      title: "Étude de charge réelle",
      description: "Dimensionnement rigoureux, sans surcoût inutile.",
    },
    {
      icon: Wrench,
      title: "Maintenance localisée",
      description: "Support technique réactif à travers la RDC.",
    },
    {
      icon: KeyRound,
      title: "Clés en main",
      description: "Gestion intégrée, du schéma au raccordement.",
    },
  ];

export function CoreSolutions() {
  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="container">
        {/* En-tête */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-brand-700">
            Ce que nous faisons
          </span>
          <h2 className="mt-5 text-3xl font-bold leading-[1.15] text-slate-900 md:text-4xl lg:text-[36px] lg:leading-[40px]">
            Des solutions solaires dimensionnées pour chaque échelle.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            Sélectionnez votre profil pour découvrir nos architectures solaires
            adaptées.
          </p>
        </Reveal>

        {/* Grille des 3 solutions */}
        <Stagger className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {solutions.map((solution) => (
            <StaggerItem key={solution.number} className="h-full">
              <article
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft lg:p-8",
                  solution.featured
                    ? "border-navy-200 ring-1 ring-navy-950/5"
                    : "border-slate-200",
                )}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-6 top-5 font-display text-5xl font-bold text-slate-100 transition-colors duration-300 group-hover:text-brand-100"
                >
                  {solution.number}
                </span>

                <span className="flex size-12 items-center justify-center rounded-xl bg-navy-950 shadow-sm">
                  <solution.icon className="size-6 text-solar-500" />
                </span>

                <p className="mt-5 text-xs font-bold uppercase tracking-wide text-brand-600">
                  {solution.audience}
                </p>
                <h3 className="mt-1.5 text-xl font-bold text-slate-900">
                  {solution.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {solution.description}
                </p>

                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                  {solution.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm font-medium text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-solar-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={solution.variant}
                  className="mt-8 w-full"
                  asChild
                >
                  <Link href={solution.cta.href}>
                    {solution.cta.label}
                    <ArrowRight />
                  </Link>
                </Button>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Ce qui nous distingue */}
        <Reveal className="mt-20 lg:mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-brand-700">
              Ce qui nous distingue
            </span>
            <h3 className="mt-5 text-2xl font-bold leading-tight text-slate-900 md:text-3xl">
              L&apos;ingénierie avant le prix.
            </h3>
          </div>

          <Stagger className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {distinctions.map((item) => (
              <StaggerItem key={item.title}>
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-white shadow-card ring-1 ring-slate-100">
                    <item.icon className="size-6 text-brand-600" />
                  </span>
                  <h4 className="mt-4 text-base font-bold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>
      </div>
    </section>
  );
}
