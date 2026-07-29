import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CalendarCheck,
  MapPin,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";

type Offer = {
  image: string;
  imageAlt: string;
  capacity: string;
  title: string;
  audience: string;
  proof?: string;
  cta: { label: string; href: string };
};

const offers: Offer[] = [
  {
    image:
      "/gallery-web/residentiel.jpg",
    imageAlt:
      "Installation solaire résidentielle Tech Solution sur toiture, RDC",
    capacity: "2 – 6 kW+",
    title: "Résidentiel",
    audience: "Villas & résidences principales.",
    cta: {
      label: "Voir les solutions maison",
      href: "/produits?categorie=solaire-residentiel",
    },
  },
  {
    image:
      "/gallery-web/commercial.jpg",
    imageAlt:
      "Centrale solaire commerciale Tech Solution sur grande toiture, RDC",
    capacity: "10 – 40 kW+",
    title: "Commercial & Hôtellerie",
    audience: "Hôtels, bureaux & cliniques.",
    proof: "40 kW — Kinshasa",
    cta: { label: "Étude projet commercial", href: "/contact" },
  },
];

const advantages: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: BatteryCharging,
    title: "100% Lithium",
    text: "Jamais de plomb. Stockage longue durée.",
  },
  {
    icon: ShieldCheck,
    title: "Garantie Renouvelable",
    text: "Garantie d'une annee renouvelable pour la batterie.",
  },
  {
    icon: MapPin,
    title: "Équipes en RDC",
    text: "Techniciens locaux, intervention rapide.",
  },
  {
    icon: CalendarCheck,
    title: "Suivi & maintenance",
    text: "Visites de contrôle, année après année.",
  },
];

export function Solutions() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-20 lg:py-28">
      <div className="container">
        {/* En-tête — aligné à gauche, en continuité du hero */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-bold leading-[1.15] text-slate-900 md:text-4xl lg:text-[44px] lg:leading-[1.1]">
              Des installations solaires conçues pour durer.{" "}
              <span className="text-brand-600">Sans compromis.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              Que ce soit pour votre résidence principale ou votre établissement
              commercial, nous déployons des batteries 100% Lithium et un
              accompagnement technique local pour résidences et entreprises.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="shrink-0">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-base font-semibold text-brand-600 transition-colors hover:text-brand-800"
            >
              Voir tous nos services
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Deux offres — visuel en un coup d'œil */}
        <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {offers.map((offer) => (
            <StaggerItem key={offer.title} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={offer.image}
                    alt={offer.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 44vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1.5 font-display text-sm font-bold text-navy-950 shadow-sm backdrop-blur">
                    {offer.capacity}
                  </span>
                  {offer.proof ? (
                    <span className="absolute right-4 top-4 rounded-full bg-navy-950/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                      {offer.proof}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-slate-900 lg:text-2xl">
                    {offer.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] text-slate-500">
                    {offer.audience}
                  </p>

                  <Button
                    className="mt-7 w-full rounded-lg py-3 transition-all hover:bg-navy-950/90 sm:mt-8"
                    asChild
                  >
                    <Link href={offer.cta.href}>
                      {offer.cta.label}
                      <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Ce que nous offrons — même largeur que les offres, sur bande blanche premium */}
        <Reveal className="mt-6 lg:mt-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            <h3 className="px-6 pt-10 text-center text-2xl font-bold text-slate-900 md:text-3xl">
              Ce que nous offrons.
            </h3>
            <Stagger className="grid grid-cols-2 gap-x-6 gap-y-12 p-8 pt-10 lg:grid-cols-4 lg:divide-x lg:divide-slate-200 lg:p-12">
              {advantages.map((item) => (
                <StaggerItem key={item.title} className="lg:px-6">
                  <div className="flex flex-col items-center text-center">
                    <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-100/60">
                      <item.icon
                        className="size-8 text-brand-600 lg:size-9"
                        strokeWidth={1.5}
                      />
                    </span>
                    <h4 className="mt-5 text-base font-bold text-slate-900 lg:text-lg">
                      {item.title}
                    </h4>
                    <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
