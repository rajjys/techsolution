import { Reveal } from "@/components/motion";
import { site } from "@/lib/site";

/**
 * Bandeau éditorial — respiration typographique entre les réalisations
 * (bande navy) et le catalogue de kits (bande blanche).
 *
 * Le dégradé du texte suit volontairement la course du jour : or du matin →
 * ambre → terre cuite → rose brûlé → mauve du crépuscule.
 *
 * ⚠️ CHIFFRES À SOURCER avant mise en production — aucun des deux ne provient
 * de la farde de l'entreprise :
 *   • « 4,5 à 5,5 kWh/m²/jour » : irradiation moyenne couramment citée pour
 *     la RDC (à confirmer par une source publiable, ex. Global Solar Atlas).
 *   • « moins d'un Congolais sur cinq » : accès fiable au réseau, attribué
 *     ici à la Banque mondiale — vérifier le millésime exact du rapport.
 */

/** Course du jour, réutilisée par le texte et le filet de signature. */
const DAYLIGHT =
  "bg-[linear-gradient(184deg,#CE9A3A_0%,#C67C36_30%,#BB5F48_55%,#A15265_78%,#7E5382_100%)]";

export function SolarStatement() {
  return (
    <section
      aria-labelledby="solar-statement"
      className="relative isolate overflow-hidden bg-[#FAF7F0] px-6 py-24 sm:py-28 lg:px-16 lg:py-40"
    >
      {/* Deux halos pleine largeur : soleil levant à gauche, crépuscule à droite */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_18%_-8%,rgba(214,160,66,0.20),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55rem_38rem_at_88%_112%,rgba(150,88,120,0.13),transparent_62%)]" />
      </div>

      <div className="mx-auto max-w-5xl">
        <Reveal>
          <figure>
            <p
              id="solar-statement"
              className={`text-balance bg-clip-text text-transparent ${DAYLIGHT} text-[30px] font-normal leading-[1.12] tracking-tight sm:text-[42px] md:text-[54px] lg:text-[64px] xl:text-[76px]`}
            >
              Avec un rayonnement solaire moyen de 5 kWh/m² par jour sur
              l&apos;ensemble du pays,
              La RDC ne souffre pas d&apos;un déficit d&apos;énergie mais d&apos;un déficit technologique de captation.
            </p>

            <p className="mt-10 max-w-3xl text-[15px] leading-relaxed text-slate-600 sm:text-base md:text-lg lg:mt-14">
              Chaque jour, 4,5 — 5,5kWh par mètre carré tombent sur les 26
              provinces du pays. Pourtant, selon la Banque mondiale, moins
              20% des Congolais disposent d&apos;un accès fiable au
              réseau electrique — le reste paye le carburant au prix fort.
              <br/>
              Le solaire n&apos;est pas
              un dépannage : c&apos;est une infrastructure énergétique qui vous permet de répondre à vos besoins en énergie de manière autonome.
            </p>

            <figcaption className="mt-6 lg:mt-8 flex justify-start items-center gap-2">
              <span
                className={`h-[3px] w-16 rounded-full ${DAYLIGHT}`}
                aria-hidden="true"
              />
              <span className="text-sm font-medium uppercase tracking-wider text-slate-500 lg:text-base">
                {site.name} • Ingénierie &amp; Autonomie Énergétique
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
