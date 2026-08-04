import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Eyebrow } from "@/components/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { services, type Service } from "@/lib/data/services";

function SolutionCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services#${service.slug}`}
      // `relative` : sans bloc conteneur positionné, le <span class="sr-only">
      // se positionnerait par rapport à la section et échapperait au rognage.
      className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card ring-0 ring-brand-200 transition-all duration-300 
      hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft hover:ring-4 hover:ring-offset-1
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:p-7"
    >
      <div className="flex items-center gap-3">
        <service.icon
          className="size-6 shrink-0 text-solar-600"
          strokeWidth={1.8}
        />
        <h3 className="text-[17px] font-bold leading-snug text-slate-900 sm:text-lg">
          {service.shortTitle}
        </h3>
      </div>

      <hr className="mt-5 border-t border-dashed border-slate-200" />

      <ul className="mt-5 space-y-3">
        {[service.outcome, service.delivery].map((point) => (
          <li key={point} className="flex items-start gap-3">
            <Check
              className="mt-[3px] size-4 shrink-0 text-solar-600"
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
          <span className="sr-only"> sur {service.shortTitle}</span>
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
                  Entre délestages à répétition et coûts élevés de carburant,{" "}
                  <span className="text-brand-600">
                    Votre site, lui, reste indépendant.
                  </span>
                </h2>
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base md:text-lg">
                  Ne laissez plus l&apos;instabilité du réseau paralyser vos équipes ou vous garder dans le noir. 
                  De l&apos;étude de vos besoins jusqu&apos;à la maintenance de vos équipements, 
                  nous installons un système solaire autonome qui garantit une alimentation continue 24h/24, sans interruption.
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 lg:mt-10">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-ember-700 px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 
                    hover:scale-105 hover:ring-4 hover:ring-offset-1 hover:ring-ember-200 
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-700 focus-visible:ring-offset-2"
                  >
                    Obtenez un devis gratuit
                  </Link>
                  <Link
                    href="/services"
                    className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-ember-700 px-[26px] py-3 text-base font-semibold text-ember-700 
                    transition-all duration-200 hover:ring-4 hover:ring-offset-1 hover:ring-ember-200 
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-700 focus-visible:ring-offset-2"
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
            {services.map((service) => (
              <StaggerItem key={service.slug} y={18} className="h-full">
                <SolutionCard service={service} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
