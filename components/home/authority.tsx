import Image from "next/image";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";

type ClientLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Hauteur max responsive, ajustée par logo pour un poids visuel équivalent */
  sizeClass: string;
};

/**
 * Logos partenaires — ordonnés pour que chaque rangée compte 2 logos larges
 * + 1 logo compact (JW.ORG, GRECOM, ALIMA) en 3ᵉ colonne.
 */
const logos: ClientLogo[] = [
  { src: "/logos/save-the-children.png", alt: "Save the Children", width: 520, height: 134, sizeClass: "max-h-6 sm:max-h-8 lg:max-h-10" },
  { src: "/logos/monusco.png", alt: "MONUSCO — Nations Unies", width: 520, height: 110, sizeClass: "max-h-6 sm:max-h-8 lg:max-h-10" },
  { src: "/logos/jworg.png", alt: "JW.ORG", width: 160, height: 160, sizeClass: "max-h-9 sm:max-h-11 lg:max-h-14" },
  { src: "/logos/care.png", alt: "CARE International", width: 457, height: 160, sizeClass: "max-h-7 sm:max-h-9 lg:max-h-12" },
  { src: "/logos/afriland.png", alt: "Afriland First Bank", width: 520, height: 66, sizeClass: "max-h-5 sm:max-h-7 lg:max-h-9" },
  { src: "/logos/grecom.png", alt: "GRECOM — Green Community Mind", width: 372, height: 160, sizeClass: "max-h-7 sm:max-h-9 lg:max-h-12" },
  { src: "/logos/cadeco.png", alt: "CADECO — Banque publique", width: 520, height: 158, sizeClass: "max-h-7 sm:max-h-9 lg:max-h-12" },
  { src: "/logos/pdl145t.png", alt: "PDL-145T — Gouvernement de la RDC", width: 520, height: 137, sizeClass: "max-h-6 sm:max-h-8 lg:max-h-11" },
  { src: "/logos/alima.png", alt: "ALIMA", width: 129, height: 160, sizeClass: "max-h-10 sm:max-h-12 lg:max-h-16" },
];

/**
 * Section d'autorité — déclaration d'impact + mur de logos monochromes.
 * Toujours en 3 colonnes (3×3) ; les logos rétrécissent sur petits écrans.
 */
export function Authority() {
  return (
    <section
      aria-label="Ils nous font confiance"
      className="relative -mt-24 bg-white pb-12 pt-24 [border-top-left-radius:50%_5rem] [border-top-right-radius:50%_5rem] lg:-mt-40 lg:pb-16 lg:pt-40 lg:[border-top-left-radius:50%_9rem] lg:[border-top-right-radius:50%_9rem]"
    >
      <div className="container grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <h2 className="mx-auto max-w-md text-center text-xl font-bold leading-snug text-[#687580] sm:text-2xl lg:mx-0 lg:text-left lg:text-[36px] lg:leading-[44px]">
            <span className="underline decoration-solar-500 decoration-2 underline-offset-[4px]">
              17+ projets
            </span>{" "}
            d&apos;envergure et{" "}
            <span className="underline decoration-solar-500 decoration-2 underline-offset-[4px]">60+ ménages</span>{" "}
            alimentés en énergie solaire à travers la RDC.
          </h2>
        </Reveal>

        <Stagger
          gap={0.05}
          className="grid grid-cols-3 items-center justify-items-center gap-x-4 gap-y-7 sm:gap-x-8 sm:gap-y-8"
        >
          {logos.map((logo) => (
            <StaggerItem key={logo.src} y={14} className="w-full">
              <div className="flex h-10 w-full items-center justify-center sm:h-14 lg:h-16">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className={`max-w-full object-contain opacity-80 grayscale transition-opacity hover:opacity-100 ${logo.sizeClass}`}
                />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
