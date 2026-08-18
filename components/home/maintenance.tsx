import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { offices, site } from "@/lib/site";

/**
 * L'après-vente — la section qui manquait.
 *
 * La maintenance était promise une fois, dans le chapô du hero, et jamais
 * reprise. Or sur ce marché, l'objection décisive n'est pas « est-ce que le
 * solaire fonctionne » — le client le voit fonctionner chez son voisin — mais
 * « qui revient dans dix-huit mois quand un régulateur lâche ». Le paysage
 * congolais est plein d'installations mortes faute de suivi.
 *
 * ⚠️ Les trois chiffres sont des engagements arrêtés avec l'entreprise, pas
 * des ordres de grandeur : 48 h ouvrées d'intervention sous contrat, un an de
 * garantie sur la pose, un stock de pièces courantes sur les deux bases. Ne
 * pas les modifier sans revalidation — ils engagent publiquement.
 *
 * La mise en page reprend mot pour mot la grammaire des blocs d'expertise de
 * /services : image en demi-écran touchant le bord, numéro et filet, titre
 * portant le problème du client, filet pointillé, liste à coches solaires,
 * primaire + secondaire. Une carte blanche arrondie posée sur un fond teinté
 * introduisait une troisième grammaire pour rien.
 */
const commitments = [
  {
    value: "48 h",
    label: "Délai d'intervention",
    detail: "Jours ouvrés, pour tout client sous contrat.",
  },
  {
    value: "1 an",
    label: "Garantie installation",
    detail: "Sur la pose, en plus des garanties constructeur.",
  },
  {
    value: `${offices.length} bases`,
    label: "Pièces en stock",
    detail: `Pièces courantes à ${offices
      .map((office) => office.city)
      .join(" et ")}.`,
  },
];

const included = [
  "Interventions préventives planifiées, et correctives en cas de panne",
  "Rapports techniques périodiques sur l'état de votre installation",
  "Supervision des installations et assistance prioritaire",
  "Vos équipes formées à l'exploitation courante",
  "Y compris sur des installations que nous n'avons pas posées",
];

export function Maintenance() {
  return (
    <section
      aria-labelledby="entretien-titre"
      className="relative isolate overflow-hidden bg-white lg:min-h-[36rem]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-slate-200"
        aria-hidden="true"
      />

      {/* Image : en flux au-dessus du texte sous lg, épinglée à gauche ensuite. */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-1/2">
        <Image
          src="/gallery-web/service-maintenance.jpg"
          alt={`Technicien ${site.name} en intervention de maintenance`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-950/30 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2">
          <div className="py-12 sm:py-16 lg:col-start-2 lg:py-24 lg:pl-14 xl:pl-20">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-brand-300" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Contrat d&apos;entretien
                </span>
              </div>

              <h2
                id="entretien-titre"
                className="mt-5 text-balance text-[26px] font-bold leading-[1.15] text-slate-900 sm:text-[30px] lg:text-[34px] lg:leading-[1.12]"
              >
                L&apos;installation n&apos;est pas la fin du chantier.{" "}
                <span className="text-brand-600">
                  C&apos;est le début du contrat.
                </span>
              </h2>

              <p className="mt-5 text-[15px] leading-relaxed text-slate-600 sm:text-base lg:text-[17px] lg:leading-[1.75]">
                Ce qui met une installation solaire à l&apos;arrêt en RDC
                n&apos;est presque jamais le matériel. C&apos;est l&apos;absence
                de suivi, et une pièce qui met trois mois à arriver.
              </p>
            </Reveal>

            {/*
              Chiffres en figures proportionnelles : `tabular-nums` donne à
              chaque chiffre la largeur d'un « 0 » et fait bâiller un nombre
              court à cette taille.
            */}
            <Reveal delay={0.08}>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-dashed border-slate-300 pt-8">
                {commitments.map((item) => (
                  <div key={item.label}>
                    <dd className="font-display text-[26px] font-bold leading-none text-brand-700 sm:text-[30px]">
                      {item.value}
                    </dd>
                    <dt className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      {item.label}
                    </dt>
                    <p className="mt-1.5 text-[13px] leading-snug text-slate-500">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.12}>
              <ul className="mt-8 grid gap-2.5 border-t border-dashed border-slate-300 pt-8">
                {included.map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <Check
                      className="mt-[3px] size-4 shrink-0 text-solar-600"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span className="text-[15px] leading-relaxed text-slate-700">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Une preuve nommée vaut mieux qu'un adjectif de plus. */}
              <p className="mt-6 text-sm leading-relaxed text-slate-600">
                <strong className="font-semibold text-slate-900">
                  Afriland First Bank
                </strong>{" "}
                nous confie ce suivi sur son agence de Bunia.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button asChild>
                  <Link href="/contact?service=maintenance-froid">
                    Nous confier votre installation
                  </Link>
                </Button>
                <Button variant="outline-strong" className="group" asChild>
                  <Link href="/services#maintenance-froid">
                    Le détail du contrat
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
