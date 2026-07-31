import { Reveal } from "@/components/motion";

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

/**
 * Course du jour, réutilisée par le texte et le filet de signature.
 *
 * NB contraste : la première teinte (#CE9A3A) donne ~2,4:1 sur le fond crème,
 * sous le seuil WCAG AA de 3:1 pour les grands textes — c'est le prix du
 * rendu « lumière du jour » voulu. Passer ce stop à #B8842C rétablit 3:1
 * si l'accessibilité prime.
 */
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
              La RDC ne souffre pas d&apos;un déficit d&apos;énergie. Elle
              souffre d&apos;un déficit de captation.
            </p>

            <p className="mt-10 max-w-3xl text-[15px] leading-relaxed text-slate-600 sm:text-base md:text-lg lg:mt-14">
              Chaque jour, 4,5 à 5,5 kWh par mètre carré tombent sur les 26
              provinces du pays. Pourtant, selon la Banque mondiale, moins
              d&apos;un Congolais sur cinq dispose d&apos;un accès fiable au
              réseau — et les autres paient le carburant au prix fort pour
              faire tourner des groupes électrogènes. Le solaire n&apos;est pas
              un dépannage : c&apos;est une infrastructure énergétique que vous
              possédez et pilotez, 24 h/24.
            </p>

            <figcaption className="mt-10 lg:mt-12">
              <span
                className={`block h-[3px] w-24 rounded-full ${DAYLIGHT}`}
                aria-hidden="true"
              />
              <span className="mt-5 block text-sm font-medium uppercase tracking-wider text-slate-500 lg:text-base">
                — Tech Solution RDC • Ingénierie &amp; Autonomie Énergétique
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
