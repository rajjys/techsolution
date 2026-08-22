import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { Engagement } from "@/components/about/engagement";
import { Glow } from "@/components/glow";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { values } from "@/lib/data/clients";
import { pageMetadata } from "@/lib/seo";
import { metrics, offices, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "Qui sommes-nous — ingénierie congolaise",
  description: `Entreprise congolaise d’ingénierie énergétique, basée à Bunia et Kinshasa depuis ${site.foundedYear}. Notre mission, nos valeurs et nos engagements de service.`,
});

/** Course du jour — le même dégradé que la déclaration solaire de l'accueil. */
const DAYLIGHT =
  "bg-[linear-gradient(184deg,#CE9A3A_0%,#C67C36_30%,#BB5F48_55%,#A15265_78%,#7E5382_100%)]";

/** « Bunia et Kinshasa » — cf. le hero d'accueil : `offices` reste la source. */
const baseCities = new Intl.ListFormat("fr", { type: "conjunction" }).format(
  offices.map((office) => office.city),
);

export default function AboutPage() {
  return (
    <>
      <PageHero
        compact
        breadcrumb={[{ label: "À propos" }]}
        eyebrow="À propos"
        title={
          <>
            Le problème n&apos;est pas le soleil.{" "}
            <span className="text-brand-600">
              C&apos;est ce qui manque entre lui et vous.
            </span>
          </>
        }
        lead={`${site.name} est née en ${site.foundedYear} de ce constat : en RDC, l'énergie ne manque pas — c'est l'ingénierie pour la capter, la stocker et la distribuer qui fait défaut. Nous installons et entretenons des systèmes solaires avec batteries pour les foyers, les entreprises et les institutions, depuis nos bases de ${baseCities}.`}
        image={{
          src: "/photos/equipe-complicite-copy.jpg",
          alt: `L'équipe technique ${site.name}`,
          position: "58% 35%",
          /* Des visages, des sourires, la marque : c'est ce qu'on achète. */
          mobile: "band",
        }}
        actions={
          <>
            <Button className="group" asChild>
              <Link href="/contact">
                Parler de votre projet
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="neutral" asChild>
              <a href={site.fardeUrl} download>
                <Download className="size-4 text-brand-600" />
                Télécharger la farde
              </a>
            </Button>
          </>
        }
      />

      {/*
        Raison d'être — le seul registre chaud hors de l'accueil.

        L'échelle du manifeste reste sous celle du H1 à chaque palier
        (24/30/36/40 contre 30/36/44/48). Elle venait de l'accueil, où le bloc
        montait à 76 px sans H1 concurrent au-dessus ; transposée telle quelle
        elle dépassait le titre de la page à partir de `lg` et l'égalait à
        `sm` et `md`. Rien sur une page ne doit approcher son H1 — surtout pas
        un paragraphe.
      */}
      <Section className="relative isolate overflow-hidden bg-surface-warm">
        <Glow variant="warm" />
        <div className="container relative">
          <Reveal>
            <div className="mx-auto max-w-4xl">
              <p
                className={`text-balance bg-clip-text text-transparent ${DAYLIGHT} text-[24px] font-normal leading-[1.16] tracking-tight sm:text-[30px] md:text-[36px] lg:text-[40px]`}
              >
                Un pays qui reçoit chaque jour de quoi s&apos;éclairer plusieurs
                fois, et qui achète pourtant son électricité au bidon.
              </p>
              <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-base md:text-lg lg:mt-10">
                Nous n&apos;avons pas monté cette entreprise pour vendre des
                panneaux. Nous l&apos;avons montée parce que des foyers, des
                bureaux, des cliniques, des écoles et des stations de radio
                s&apos;arrêtent
                chaque jour faute d&apos;une installation dimensionnée
                correctement — et parce que remplacer un groupe électrogène par
                un autre groupe électrogène n&apos;a jamais réglé le problème.
              </p>

              {/*
                Les chiffres qui portaient le manifeste de l'accueil. Ils
                arrivent ici et pas ailleurs : la page d'accueil tenait déjà
                cette démonstration — pourquoi le solaire, en RDC — mais la
                posait entre la preuve et l'offre, c'est-à-dire devant un
                visiteur qui avait justement fini d'en douter. Elle appartient
                à la page qui explique pourquoi l'entreprise existe.

                Fondue dans cette section plutôt qu'ajoutée à la suite : le
                paragraphe au-dessus fait déjà exactement cette affirmation.
                Deux blocs en dégradé disant la même chose à dix centimètres
                l'un de l'autre auraient affaibli les deux.
              */}
              <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-base md:text-lg">
                Chaque jour, 4,5 à 5,5 kWh par mètre carré tombent sur les 26
                provinces du pays. Pourtant, en 2017, près de 10&nbsp;%
                seulement de la population était raccordée au réseau
                électrique&nbsp;(Banque mondiale, 2020). Et le raccordement ne
                règle pas tout&nbsp;: à Kinshasa, 60&nbsp;% des habitants ont
                accès à l&apos;électricité, mais la qualité et la fiabilité du
                service y restent très faibles. Le pays ne souffre pas d&apos;un
                déficit d&apos;énergie — il souffre d&apos;un déficit de
                captation.
              </p>
            </div>
          </Reveal>

          {/*
            Deux colonnes séparées par un filet plutôt que deux encadrés à
            pictogramme : dans un bandeau éditorial, une boîte grise cassait le
            registre, et l'icône n'ajoutait rien que le libellé ne dise déjà.
          */}
          <div className="mx-auto mt-14 grid max-w-4xl gap-10 border-t border-slate-300/70 pt-10 md:grid-cols-2 md:gap-14 md:divide-x md:divide-slate-300/70 lg:mt-20">
            {[
              {
                label: "Notre vision",
                text: "Devenir un acteur incontournable de la transformation énergétique et technologique en Afrique, avec des solutions durables, accessibles et au service des communautés.",
              },
              {
                label: "Notre mission",
                text: "Fournir des solutions fiables en énergie solaire et en technologies de proximité, tout en contribuant activement à la protection de l'environnement et à la lutte contre la déforestation.",
              },
            ].map((block, index) => (
              <Reveal key={block.label} delay={index * 0.08}>
                <div className={index === 1 ? "md:pl-14" : undefined}>
                  <h2 className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    <span
                      className="h-[3px] w-8 shrink-0 rounded-full bg-[#C67C36]"
                      aria-hidden="true"
                    />
                    {block.label}
                  </h2>
                  <p className="mt-5 text-lg leading-relaxed text-slate-700 sm:text-xl sm:leading-[1.6]">
                    {block.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Les chiffres — le sombre est la couleur de la preuve */}
      <Section className="relative isolate overflow-hidden bg-brand-900">
        <Glow variant="dark" corner="top-right" />
        <div className="container relative">
          <SectionHeading
            align="center"
            onDark
            eyebrow={`Depuis ${site.foundedYear}`}
            title="Ce que ça donne, concrètement."
          />

          <Stagger className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:mt-16 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-white/10">
            {metrics.map((metric) => (
              <StaggerItem key={metric.label} className="lg:px-6">
                <p className="font-display text-4xl font-bold tabular-nums text-solar-400 sm:text-5xl">
                  <CountUp value={metric.value} suffix={metric.suffix} />
                </p>
                <h3 className="mt-3 text-base font-bold text-white lg:text-lg">
                  {metric.label}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-200">
                  {metric.detail}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <Engagement />

      {/* Valeurs — sept principes, en fiches compactes */}
      <Section className="relative isolate bg-surface-cool">
        <Glow variant="cool" corner="bottom-left" />
        <div className="container relative">
          <SectionHeading
            rule
            eyebrow="Nos valeurs"
            title="Ce qui ne change pas d'un chantier à l'autre."
            lead={`${values.length} principes, écrits une fois et appliqués partout — y compris quand ils coûtent plus cher que l'alternative.`}
          />

          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
            {values.map((value, index) => (
              <StaggerItem key={value.title} className="h-full">
                <div className="flex h-full gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                  <span className="font-display text-lg font-bold tabular-nums text-brand-200">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold text-slate-900">
                      {value.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {value.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}

            {/* Huitième case : la suite logique de la lecture */}
            <StaggerItem className="h-full">
              <div className="flex h-full flex-col justify-center gap-4 rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 p-5">
                <p className="text-[15px] font-bold text-slate-900">
                  Ces principes se vérifient sur le terrain.
                </p>
                <Button
                  variant="outline-brand"
                  size="sm"
                  className="group self-start"
                  asChild
                >
                  <Link href="/references">
                    Voir nos réalisations
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </Section>
    </>
  );
}
