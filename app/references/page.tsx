import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  FolderCheck,
  MapPin,
  MapPinned,
  Phone,
} from "lucide-react";

import { CtaPanel } from "@/components/cta-panel";
import { DrcMap } from "@/components/drc-map";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clients, projects, sectorGroups } from "@/lib/data/clients";
import { provinces } from "@/lib/data/drc";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Clients, Références & Présence en RDC",
  description:
    "Le track record Tech Solution RDC : MONUSCO, CARE, Save the Children, ALIMA, Afriland First Bank, CADECO, programme PDL-145T — 17 réalisations documentées en Ituri, Nord-Kivu et Sud-Kivu.",
  alternates: { canonical: "/references" },
};

const projectCategoryStyles: Record<string, string> = {
  Solaire: "bg-solar-50 text-solar-800 border-solar-500/30",
  Backup: "bg-navy-50 text-navy-800 border-navy-200",
  Électricité: "bg-amber-50 text-amber-800 border-amber-200",
  Sécurité: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Maintenance: "bg-slate-100 text-slate-700 border-slate-200",
  Télécoms: "bg-sky-50 text-sky-800 border-sky-200",
};

export default function ReferencesPage() {
  const activeProvinces = provinces.filter((p) => p.active);
  const totalProvinces = provinces.length;

  return (
    <>
      <PageHero
        eyebrow="Clients & Références"
        title={
          <>
            Un track record{" "}
            <span className="bg-gradient-to-r from-solar-500 to-solar-400 bg-clip-text text-transparent">
              vérifiable
            </span>
            , des clients exigeants
          </>
        }
        lead={`${clients.length} organisations de référence, ${projects.length} réalisations documentées : la farde technique complète — personnes de contact incluses — est disponible sur demande.`}
      >
        <Reveal mode="mount" delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div>
              <p className="font-display text-3xl font-bold text-white">
                {projects.length}
              </p>
              <p className="text-xs font-medium uppercase tracking-wide text-navy-200">
                Réalisations livrées
              </p>
            </div>
            <div className="h-10 w-px bg-white/15" aria-hidden="true" />
            <div>
              <p className="font-display text-3xl font-bold text-white">
                {clients.length}
              </p>
              <p className="text-xs font-medium uppercase tracking-wide text-navy-200">
                Clients institutionnels
              </p>
            </div>
            <div className="h-10 w-px bg-white/15" aria-hidden="true" />
            <div>
              <p className="font-display text-3xl font-bold text-white">
                {activeProvinces.length}
                <span className="text-lg text-navy-300">/{totalProvinces}</span>
              </p>
              <p className="text-xs font-medium uppercase tracking-wide text-navy-200">
                Provinces livrées / couvertes
              </p>
            </div>
          </div>
        </Reveal>
      </PageHero>

      {/* Références par secteur */}
      <Section className="bg-white">
        <div className="container">
          <SectionHeading
            eyebrow="Par secteur d'activité"
            title="Des références dans chaque secteur stratégique"
            lead="Organisations internationales, banques, programmes publics, médias et entreprises : chaque secteur impose ses standards — nous les respectons."
          />

          <div className="mt-14 space-y-14">
            {sectorGroups.map((group) => {
              const groupClients = clients.filter(
                (client) => client.sectorGroup === group.id,
              );
              if (groupClients.length === 0) return null;

              return (
                <div key={group.id}>
                  <Reveal>
                    <div className="flex flex-col gap-2 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
                      <div className="flex items-center gap-3.5">
                        <span className="flex size-11 items-center justify-center rounded-xl bg-navy-950">
                          <group.icon className="size-5 text-solar-500" />
                        </span>
                        <div>
                          <h3 className="font-display text-xl font-bold text-slate-900">
                            {group.label}
                          </h3>
                          <p className="mt-0.5 text-sm text-slate-500">
                            {group.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant="navy" className="shrink-0 self-start md:self-auto">
                        {groupClients.length} référence
                        {groupClients.length > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </Reveal>

                  <Stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {groupClients.map((client) => (
                      <StaggerItem key={client.name}>
                        <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                          <div className="flex items-start justify-between gap-3">
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 font-display text-sm font-bold text-solar-500">
                              {client.monogram}
                            </span>
                            <Badge variant="outline" className="gap-1">
                              <MapPin className="!size-3 text-solar-600" />
                              {client.city}
                            </Badge>
                          </div>
                          <h4 className="mt-4 text-[15px] font-bold leading-snug text-slate-900">
                            {client.name}
                          </h4>
                          <p className="mt-1 text-xs font-medium text-slate-500">
                            {client.sector}
                          </p>
                          <ul className="mt-3 flex-1 space-y-1.5">
                            {client.services.map((service) => (
                              <li
                                key={service}
                                className="flex items-start gap-2 text-sm text-slate-600"
                              >
                                <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-solar-600" />
                                {service}
                              </li>
                            ))}
                          </ul>
                        </article>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              );
            })}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-2xl bg-navy-950 p-7 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <Phone className="mt-1 size-5 shrink-0 text-solar-500" />
                <p className="max-w-2xl text-sm leading-relaxed text-navy-100">
                  <span className="font-semibold text-white">
                    Vérification des références :
                  </span>{" "}
                  les personnes de contact de chaque organisation (fonction et
                  téléphone direct) figurent dans notre farde technique,
                  transmise sur demande aux services achats et logistique.
                </p>
              </div>
              <Button variant="solar" asChild className="shrink-0">
                <Link href="/contact">
                  Demander la farde
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Réalisations */}
      <Section className="bg-slate-50">
        <div className="container">
          <SectionHeading
            eyebrow="Réalisations"
            title={`${projects.length} projets documentés, livrés et opérationnels`}
            lead="Centrales solaires, backups, sécurité électronique et maintenance — chaque ligne correspond à une installation réelle."
          />

          <Stagger className="mt-12 grid gap-4 md:grid-cols-2">
            {projects.map((project, index) => (
              <StaggerItem key={`${project.title}-${project.city}-${index}`}>
                <article className="flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-soft">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-solar-500/15">
                    <FolderCheck className="size-5 text-solar-700" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold leading-snug text-slate-900">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {project.client}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${projectCategoryStyles[project.category]}`}
                      >
                        {project.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <MapPin className="size-3 text-solar-600" />
                        {project.city} — {project.province}
                      </span>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Couverture provinciale */}
      <Section className="bg-white">
        <div className="container grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <Reveal y={30}>
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-card sm:p-8">
              <DrcMap />
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Présence provinciale"
              title="De l'Est vers les 26 provinces"
              lead={`Basés à ${site.base.split("—")[0].trim()}, nous avons livré des projets dans ${activeProvinces.length} provinces et mobilisons des équipes projet sur tout le territoire.`}
            />

            <Reveal delay={0.12}>
              <div className="mt-8">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <MapPinned className="size-4 text-solar-600" />
                  Les 26 provinces de la RDC
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {provinces.map((province) => (
                    <span
                      key={province.name}
                      className={
                        province.active
                          ? "inline-flex items-center gap-1.5 rounded-full bg-solar-500 px-3 py-1 text-xs font-bold text-navy-950 shadow-sm"
                          : "inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500"
                      }
                    >
                      {province.active ? (
                        <span
                          className="size-1.5 rounded-full bg-navy-950"
                          aria-hidden="true"
                        />
                      ) : null}
                      {province.name}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">
                    En surbrillance :
                  </span>{" "}
                  provinces avec réalisations livrées (Ituri, Nord-Kivu,
                  Sud-Kivu).
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <Building2 className="size-8 shrink-0 text-navy-800" />
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-900">
                    Villes d&apos;intervention :
                  </span>{" "}
                  Bunia, Mahagi, Aveba, Butembo, Goma et Numbi — avec
                  mobilisation possible vers Kinshasa, le Haut-Katanga, le
                  Lualaba, la Tshopo et toute autre province.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <CtaPanel
        title="Ajoutez votre organisation à nos références"
        lead="Rejoignez les institutions qui ont fait le choix d'une énergie fiable : étude gratuite, devis transparent, installation certifiée."
      />
    </>
  );
}
