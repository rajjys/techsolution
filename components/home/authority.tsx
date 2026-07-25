import Image from "next/image";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";

type ClientLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

/** Logos partenaires normalisés en monochrome (public/logos). */
const logos: ClientLogo[] = [
  { src: "/logos/save-the-children.png", alt: "Save the Children", width: 520, height: 134 },
  { src: "/logos/monusco.png", alt: "MONUSCO — Nations Unies", width: 520, height: 110 },
  { src: "/logos/care.png", alt: "CARE International", width: 457, height: 160 },
  { src: "/logos/afriland.png", alt: "Afriland First Bank", width: 331, height: 160, className: "max-h-12 lg:max-h-14" },
  { src: "/logos/cadeco.png", alt: "CADECO — Banque publique", width: 520, height: 158 },
  { src: "/logos/pdl145t.png", alt: "PDL-145T — Gouvernement de la RDC", width: 520, height: 137 },
  { src: "/logos/jworg.png", alt: "JW.ORG", width: 160, height: 160, className: "max-h-12 lg:max-h-14" },
  { src: "/logos/grecom.png", alt: "GRECOM — Green Community Mind", width: 372, height: 160, className: "max-h-12 lg:max-h-14" },
  { src: "/logos/alima.png", alt: "ALIMA", width: 129, height: 160, className: "max-h-14 lg:max-h-16" },
];

/**
 * Section d'autorité — déclaration d'impact + mur de logos monochromes.
 * En dessous de lg, la déclaration est centrée au-dessus de la grille.
 */
export function Authority() {
  return (
    <section
      aria-label="Ils nous font confiance"
      className="relative -mt-8 rounded-t-[2.5rem] bg-white py-16 lg:-mt-12 lg:rounded-t-[3rem] lg:py-24"
    >
      <div className="container grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <h2 className="mx-auto max-w-md text-center text-2xl font-bold leading-snug text-[#687580] lg:mx-0 lg:text-left lg:text-[36px] lg:leading-[44px]">
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
          className="grid grid-cols-2 items-center gap-x-10 gap-y-9 sm:grid-cols-3"
        >
          {logos.map((logo) => (
            <StaggerItem key={logo.src} y={14} className="flex justify-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className={`w-auto max-w-[180px] object-contain opacity-60 grayscale transition-opacity duration-300 hover:opacity-100 ${logo.className ?? "max-h-9 lg:max-h-10"}`}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
