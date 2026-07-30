import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Building2,
  PlugZap,
  ShieldCheck,
  Sun,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Eyebrow } from "@/components/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";

type Solution = {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Ancre de la page /services (les pages dédiées n'existent pas encore). */
  href: string;
  /** Renseigné uniquement pour les deux solutions phares (solaire). */
  capacity?: string;
  featured?: boolean;
};

/**
 * Six domaines proposés en page d'accueil. Les deux premiers (solaire
 * résidentiel et solaire entreprises) sont mis en avant : ils portent
 * l'essentiel de la demande. Les quatre autres élargissent l'empreinte
 * technique de l'entreprise au-delà du photovoltaïque.
 */
const solutions: Solution[] = [
  {
    title: "Solaire résidentiel",
    description:
      "Villas, résidences et logements de fonction : autonomie complète, batteries 100 % lithium, installation clé en main.",
    icon: Sun,
    href: "/services#energie-solaire",
    capacity: "2 – 6 kW+",
    featured: true,
  },
  {
    title: "Solaire entreprises & institutions",
    description:
      "Hôtels, bureaux, banques, cliniques et bâtiments publics : centrales dimensionnées sur audit de charge.",
    icon: Building2,
    href: "/services#energie-solaire",
    capacity: "10 – 40 kW+",
    featured: true,
  },
  {
    title: "Backup & stockage d'énergie",
    description:
      "Onduleurs hybrides et parcs batteries lithium pour une continuité électrique 24 h/24, même hors réseau.",
    icon: BatteryCharging,
    href: "/services#backup-stockage",
  },
  {
    title: "Infrastructure électrique",
    description:
      "Tableaux et distribution basse tension, protection foudre, rénovation et mise en conformité des bâtiments.",
    icon: PlugZap,
    href: "/services#infrastructure-electrique",
  },
  {
    title: "Sécurité électronique",
    description:
      "Alarmes anti-intrusion, contrôle d'accès et vidéosurveillance, adossés à une alimentation secourue.",
    icon: ShieldCheck,
    href: "/services#securite-electronique",
  },
  {
    title: "Maintenance & climatisation",
    description:
      "Contrats préventifs, dépannage rapide et entretien des systèmes électriques, solaires et de climatisation.",
    icon: Wrench,
    href: "/services#maintenance-froid",
  },
];

function SolutionCard({ solution }: { solution: Solution }) {
  const { featured } = solution;

  return (
    <Link
      href={solution.href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:p-6 lg:p-7",
        "hover:-translate-y-1 hover:shadow-soft",
        featured
          ? "border-brand-200 bg-gradient-to-b from-white via-white to-brand-100/50 shadow-[0_18px_40px_-28px_rgba(49,48,208,0.55)]"
          : "border-slate-200/90 bg-white/90 shadow-card backdrop-blur-sm hover:border-brand-200",
      )}
    >
      {featured ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-brand-400 to-solar-500"
        />
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors sm:size-12",
            featured
              ? "bg-brand-600 text-white shadow-[0_10px_24px_-12px_rgba(49,48,208,0.9)]"
              : "bg-brand-100/70 text-brand-600 group-hover:bg-brand-100",
          )}
        >
          <solution.icon className="size-5 sm:size-6" strokeWidth={1.7} />
        </span>

        {solution.capacity ? (
          <span className="mt-0.5 shrink-0 rounded-full bg-solar-50 px-2.5 py-1 font-display text-xs font-bold text-solar-800 ring-1 ring-inset ring-solar-200">
            {solution.capacity}
          </span>
        ) : null}
      </div>

      <h3
        className={cn(
          "mt-5 font-bold leading-snug text-slate-900",
          featured ? "text-[17px] sm:text-lg" : "text-base sm:text-[17px]",
        )}
      >
        {solution.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {solution.description}
      </p>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-600">
        Découvrir
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

/**
 * Grille des solutions — colonne de gauche fixée (sticky) pendant le
 * défilement de la grille de droite, dans les deux sens.
 * NB : pas d'`overflow-hidden` sur les ancêtres, cela casserait le sticky.
 */
export function Solutions() {
  return (
    <section
      aria-labelledby="solutions-title"
      className="relative isolate bg-[#F4F7FE] py-14 sm:py-20 lg:py-28"
    >
      {/* Radiance bleue pleine largeur */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(75rem_38rem_at_50%_-8%,rgba(49,48,208,0.13),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55rem_35rem_at_100%_100%,rgba(255,184,0,0.08),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
      </div>

      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-14 xl:gap-20">
          {/* Colonne de gauche — sticky sur desktop.
              L'élément de grille reste étiré (hauteur de la rangée) : c'est lui
              qui donne au bloc sticky sa course de défilement. */}
          <div className="lg:relative">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <Eyebrow>Nos solutions</Eyebrow>
                <h2
                  id="solutions-title"
                  className="mt-4 text-[26px] font-bold leading-[1.18] text-slate-900 sm:text-3xl sm:leading-[1.15] md:text-4xl lg:text-[42px] lg:leading-[1.1]"
                >
                  Bien plus que le solaire.{" "}
                  <span className="text-brand-600">
                    Toute votre infrastructure technique.
                  </span>
                </h2>
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base md:text-lg">
                  Des ménages aux banques, ONG et stations de radio, nous
                  concevons, installons et entretenons les systèmes qui gardent
                  vos sites sous tension — de l&apos;audit gratuit à la
                  maintenance, partout en RDC.
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5 lg:mt-10">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-[#C2410C] px-7 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#9A3412] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2"
                  >
                    Obtenez un devis gratuit
                  </Link>
                  <Link
                    href="/services"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-white hover:text-navy-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  >
                    Tous nos services
                    <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-7 text-sm font-medium text-slate-500 lg:mt-9">
                  6 domaines d&apos;expertise · Audit de site offert · Équipes
                  basées en RDC
                </p>
              </Reveal>
            </div>
          </div>

          {/* Colonne de droite — grille des services */}
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
            {solutions.map((solution) => (
              <StaggerItem key={solution.title} y={18} className="h-full">
                <SolutionCard solution={solution} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
