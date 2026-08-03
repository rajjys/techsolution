import Link from "next/link";
import {
  ArrowRight,
  Check,
  PlugZap,
  RadioTower,
  ShieldCheck,
  Sun,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Eyebrow } from "@/components/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

type Solution = {
  title: string;
  icon: LucideIcon;
  /**
   * Deux points, dans cet ordre : d'abord le résultat pour le client,
   * ensuite seulement le « comment » technique.
   */
  points: [string, string];
  /** Ancre de la page /services (les pages dédiées n'existent pas encore). */
  href: string;
};

/**
 * Les six domaines d'intervention. Le solaire résidentiel et professionnel
 * sont réunis en une seule offre : même métier, dimensionnements différents.
 */
const solutions: Solution[] = [
  {
    title: "Énergie solaire",
    icon: Sun,
    points: [
      "Ne subissez plus les coupures, chez vous comme au bureau.",
      "Centrales et kits dimensionnés sur audit de charge, batteries 100 % lithium.",
    ],
    href: "/services#energie-solaire",
  },
  {
    title: "Backup & stockage",
    icon: Zap,
    points: [
      "Gardez vos équipements critiques allumés, 24 h/24.",
      "Onduleurs hybrides, parcs batteries lithium et supervision, même hors réseau.",
    ],
    href: "/services#backup-stockage",
  },
  {
    title: "Infrastructure électrique",
    icon: PlugZap,
    points: [
      "Arrêtez de remplacer du matériel grillé par le réseau.",
      "Tableaux, distribution basse tension, protection foudre et mise en conformité.",
    ],
    href: "/services#infrastructure-electrique",
  },
  {
    title: "Télécoms & médias",
    icon: RadioTower,
    points: [
      "Restez à l'antenne, même quand tout le quartier s'éteint.",
      "Énergie autonome pour stations de radio, serveurs et sites télécoms isolés.",
    ],
    href: "/services#telecom-medias",
  },
  {
    title: "Sécurité électronique",
    icon: ShieldCheck,
    points: [
      "Sachez ce qui se passe sur votre site, à toute heure.",
      "Alarmes, contrôle d'accès et vidéosurveillance adossés à une alimentation secourue.",
    ],
    href: "/services#securite-electronique",
  },
  {
    title: "Maintenance & climatisation",
    icon: Wrench,
    points: [
      "Ne perdez plus une journée d'activité sur une panne.",
      "Contrats préventifs, dépannage rapide et entretien de vos climatisations.",
    ],
    href: "/services#maintenance-froid",
  },
];

function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <Link
      href={solution.href}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:p-7"
    >
      <div className="flex items-center gap-3">
        <solution.icon
          className="size-6 shrink-0 text-brand-600"
          strokeWidth={1.8}
        />
        <h3 className="text-[17px] font-bold leading-snug text-slate-900 sm:text-lg">
          {solution.title}
        </h3>
      </div>

      <hr className="mt-5 border-t border-dashed border-slate-200" />

      <ul className="mt-5 space-y-3">
        {solution.points.map((point) => (
          <li key={point} className="flex items-start gap-3">
            <Check
              className="mt-[3px] size-4 shrink-0 text-brand-600"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span className="text-sm leading-relaxed text-slate-600">
              {point}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <hr className="border-t border-dashed border-slate-200" />
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-brand-600">
          En savoir plus
          <span className="sr-only"> sur {solution.title}</span>
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
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
      className="relative isolate bg-[#F4F7FE] pb-14 pt-[9.5rem] sm:pb-20 sm:pt-[11rem] lg:pb-28 lg:pt-[16rem]"
    >
      {/* Radiance bleue pleine largeur */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(75rem_38rem_at_50%_8%,rgba(49,48,208,0.13),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55rem_35rem_at_100%_100%,rgba(255,184,0,0.08),transparent_60%)]" />
      </div>

      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-14 xl:gap-20">
          {/* Colonne de gauche — sticky sur desktop.
              L'élément de grille reste étiré (hauteur de la rangée) : c'est lui
              qui donne au bloc sticky sa course de défilement. */}
          <div className="lg:relative">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <div className="flex items-center gap-4">
                  <Eyebrow>Nos solutions</Eyebrow>
                  <span
                    className="h-px flex-1 border-t border-dashed border-slate-300"
                    aria-hidden="true"
                  />
                </div>

                <h2
                  id="solutions-title"
                  className="mt-6 text-[26px] font-bold leading-[1.18] text-slate-900 sm:text-3xl sm:leading-[1.15] md:text-4xl lg:text-[42px] lg:leading-[1.1]"
                >
                  L&apos;accès à l&apos;électricité reste un défi majeur en
                  RDC.{" "}
                  <span className="text-brand-600">
                    Tech Solution le relève.
                  </span>
                </h2>
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base md:text-lg">
                  Coupures à répétition, carburant qui s&apos;envole,
                  équipements qui grillent : votre activité s&apos;arrête
                  pendant que les factures continuent. Nous relevons ce défi
                  chantier après chantier — de l&apos;audit gratuit à la
                  maintenance, pour les ménages comme pour les institutions,
                  partout dans le pays.
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 lg:mt-10">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-ember-700 px-7 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-ember-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-700 focus-visible:ring-offset-2"
                  >
                    Obtenez un devis gratuit
                  </Link>
                  <Link
                    href="/services"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ember-700 px-[26px] py-3 text-base font-semibold text-ember-700 transition-colors duration-200 hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-700 focus-visible:ring-offset-2"
                  >
                    Tous nos services
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
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
