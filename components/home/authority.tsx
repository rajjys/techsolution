import Image from "next/image";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Eyebrow } from "@/components/section";

type ClientLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Hauteur max responsive, ajustée par logo pour un poids visuel équivalent */
  sizeClass: string;
  /**
   * Sert le fichier tel quel. Obligatoire pour un SVG : l'optimiseur de
   * `next/image` refuse ce format sans `dangerouslyAllowSVG`, et renverrait
   * une image cassée.
   */
  unoptimized?: boolean;
  /**
   * Correction d'encre. Le mur est en niveaux de gris à `opacity-80`, ce qui
   * suppose des logos de densité comparable. MONUSCO et IMC sont des tracés
   * quasi noirs : à la même opacité ils pèsent visiblement plus lourd que
   * Save the Children ou CARE, et le mur perd son unité.
   */
  toneClass?: string;
};

/**
 * Logos partenaires — ordonnés pour que chaque rangée compte 2 logos larges
 * + 1 logo compact (JW.ORG, GRECOM, ALIMA) en 3ᵉ colonne.
 *
 * Les hauteurs s'égalisent sur la quantité d'encre, pas sur la hauteur. Un
 * logo compact reçoit d'ordinaire quelques crans de plus pour compenser sa
 * faible largeur — sauf JW.ORG, qui est un aplat plein à bords francs : à
 * `max-h-14` il pesait environ trois fois un logotype filaire comme Afriland
 * posé à la même hauteur, et faisait un trou noir dans la grille. C'est le
 * plus dense du mur, donc le plus petit.
 */
const logos: ClientLogo[] = [
  { src: "/logos/save-the-children.png", alt: "Save the Children", width: 520, height: 134, sizeClass: "max-h-8 sm:max-h-8 lg:max-h-10" },
  { src: "/logos/monusco.png", alt: "MONUSCO — Nations Unies", width: 520, height: 110, sizeClass: "max-h-8 sm:max-h-8 lg:max-h-10", toneClass: "opacity-60" },
  { src: "/logos/jworg.png", alt: "JW.ORG", width: 160, height: 160, sizeClass: "max-h-7 sm:max-h-8 lg:max-h-10" },
  { src: "/logos/care.png", alt: "CARE International", width: 457, height: 160, sizeClass: "max-h-10 sm:max-h-9 lg:max-h-12" },
  { src: "/logos/afriland.png", alt: "Afriland First Bank", width: 520, height: 66, sizeClass: "max-h-7 sm:max-h-7 lg:max-h-9" },
  { src: "/logos/grecom.png", alt: "GRECOM — Green Community Mind", width: 372, height: 160, sizeClass: "max-h-10 sm:max-h-9 lg:max-h-12" },
  { src: "/logos/cadeco.png", alt: "CADECO — Banque publique", width: 520, height: 158, sizeClass: "max-h-10 sm:max-h-9 lg:max-h-12" },
  { src: "/logos/international-medical-corps.svg", alt: "International Medical Corps", width: 597, height: 144, sizeClass: "max-h-8 sm:max-h-8 lg:max-h-11", unoptimized: true, toneClass: "opacity-60" },
  { src: "/logos/alima.png", alt: "ALIMA", width: 129, height: 160, sizeClass: "max-h-14 sm:max-h-16 lg:max-h-[72px]" },
];

/**
 * Section d'autorité — preuve chiffrée + mur de logos monochromes.
 * Trois colonnes à toutes les tailles.
 */
export function Authority() {
  return (
    <section
      aria-labelledby="autorite-titre"
      className="relative z-10 -mb-16 -mt-16 bg-white pb-20 pt-20 [border-bottom-left-radius:50%_3rem] [border-bottom-right-radius:50%_3rem] [border-top-left-radius:50%_3rem] [border-top-right-radius:50%_3rem] lg:-mb-28 lg:-mt-28 lg:pb-24 lg:pt-32 lg:[border-bottom-left-radius:50%_6rem] lg:[border-bottom-right-radius:50%_6rem] lg:[border-top-left-radius:50%_6rem] lg:[border-top-right-radius:50%_6rem]"
    >
      {/*
        Colonnes rééquilibrées (0,95 / 1,05) : à 0,85 le titre tombait sur
        quatre lignes dont la dernière ne portait que « RDC. ».
      */}
      <div className="container grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <Reveal mode="mount">
          {/*
            « 17+ projets d'envergure et 60+ ménages » conjoignait deux unités
            sans rapport — des chantiers et des foyers — ce qui donnait une
            phrase qui a l'air de se couvrir. Séparés en deux tuiles, chaque
            nombre porte sa propre unité et se lit pour ce qu'il vaut.

            `mode="mount"` : la section affleure le premier écran, et en
            révélation au défilement son texte restait blanc sur blanc au
            chargement. Une preuve invisible ne prouve rien.
          */}
          <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
            <Eyebrow>Ils nous font confiance</Eyebrow>
            <h2
              id="autorite-titre"
              className="max-w-md text-balance text-[22px] font-bold leading-snug text-slate-700 sm:text-2xl lg:max-w-[30rem] lg:text-[32px] lg:leading-[42px]"
            >
              L&apos;énergie solaire, installée et entretenue à travers la RDC.
            </h2>

            {/*
              Chiffres en figures proportionnelles : `tabular-nums` donne à
              chaque chiffre la largeur d'un « 0 » et fait bâiller un nombre
              court à cette taille. Il ne sert qu'en colonnes à aligner.
            */}
            <dl className="flex flex-wrap justify-center gap-x-10 gap-y-4 lg:justify-start">
              {[
                { value: "17+", label: "projets d'envergure" },
                { value: "60+", label: "foyers alimentés" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-sm font-medium text-slate-500">
                    {stat.label}
                  </dt>
                  <dd className="text-[34px] font-bold leading-none text-brand-700 lg:text-[40px]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        {/*
          Trois colonnes à toutes les tailles. Le passage à deux sur téléphone
          traitait le symptôme : ce n'était pas le nombre de colonnes qui
          écrasait les logos mais l'air autour d'eux. Gouttières et interlignes
          resserrés, cellules d'une hauteur utile — la grille tient à trois et
          les logotypes respirent.
        */}
        <Stagger
          gap={0.05}
          mode="mount"
          className="grid grid-cols-3 items-center justify-items-center gap-x-3 gap-y-6 sm:gap-x-8 sm:gap-y-8"
        >
          {logos.map((logo) => (
            <StaggerItem key={logo.src} y={14} className="w-full">
              <div className="flex h-14 w-full items-center justify-center sm:h-16 lg:h-[72px]">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  unoptimized={logo.unoptimized}
                  className={`max-w-full object-contain grayscale transition-opacity hover:opacity-100 ${logo.toneClass ?? "opacity-80"} ${logo.sizeClass}`}
                />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
