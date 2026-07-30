import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion";
import { RotatingPhrases } from "@/components/home/rotating-phrases";

/**
 * Hero pleine largeur (modèle BairesDev) : image de fond plein cadre sur
 * desktop avec voile blanc dégradé gauche → droite ; typographie centrée
 * et sans image en dessous de lg.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFF7ED]">
      {/* Image de fond — desktop uniquement */}
      <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1509389928833-fe62aef36deb?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_45%]"
        />
        {/* Voile : crème opaque à gauche → transparent à droite */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF7ED] from-10% via-[#FFF7ED]/85 to-transparent" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl pb-24 pt-8 text-center sm:pb-28 md:pt-12 lg:mx-0 lg:max-w-6xl lg:pb-48 lg:pt-14 lg:text-left xl:-ml-8">
          <Reveal mode="mount">
            <h1 className="text-[30px] font-medium leading-[1.15] tracking-[-0.02em] text-navy-950 sm:text-[42px] sm:leading-[1.12] md:text-6xl lg:max-w-[800px] lg:text-[72px] lg:leading-[1.1]">
              Prenez le contrôle de votre énergie&nbsp;
              <RotatingPhrases />
            </h1>
          </Reveal>

          <Reveal mode="mount" delay={0.1}>
            <p className="mx-auto mt-4 max-w-xl text-lg font-normal leading-relaxed text-[#52606D] sm:mt-6 lg:mx-0 lg:max-w-xl lg:text-[22px] lg:leading-[32px]">
              L&apos;installation solaire haute fiabilité pour vos domiciles,
              entreprises et sites industriels partout en RDC.
            </p>
          </Reveal>

          <Reveal mode="mount" delay={0.2}>
            <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4 lg:mt-14 lg:justify-start">
              <Link
                href="/contact"
                className="inline-flex w-auto items-center justify-center rounded-xl bg-[#C2410C] px-7 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#9A3412] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2 sm:px-8 sm:py-4 sm:text-[18px]"
              >
                Obtenez un devis gratuit
              </Link>
              <Link
                href="/references"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#C2410C] px-[26px] py-3 text-base font-semibold text-[#C2410C] transition-colors duration-200 hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2 sm:px-[30px] sm:py-[14px] sm:text-[18px]"
              >
                Découvrir nos réalisations
                <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
