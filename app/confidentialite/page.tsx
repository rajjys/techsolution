import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Glow } from "@/components/glow";
import { Section } from "@/components/section";
import { getHeadquarters, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Confidentialité",
  description:
    "Ce que TECH SOLUTION RDC collecte via le formulaire de devis, pourquoi, combien de temps, et comment demander la suppression de vos données.",
  alternates: { canonical: "/confidentialite" },
};

/**
 * Politique de confidentialité.
 *
 * Écrite **depuis le code**, pas depuis un modèle : chaque paragraphe décrit ce
 * que `app/api/contact/route.ts` et `app/layout.tsx` font réellement. Le
 * formulaire portait une seule ligne — « vos informations servent uniquement à
 * traiter cette demande » — honnête mais seule, et sans page où l'étayer.
 *
 * ⚠️ La durée de conservation (trois ans après le dernier échange) est une
 * décision d'entreprise, pas une contrainte technique : c'est l'usage courant
 * pour des données de prospection. À faire confirmer si l'entreprise veut
 * s'adosser explicitement au RGPD ou à la législation congolaise sur les
 * données — aucun texte n'est cité ici faute de pouvoir le vérifier.
 */
export default function ConfidentialitePage() {
  const hq = getHeadquarters();

  const sections: { title: string; body: React.ReactNode }[] = [
    {
      title: "Qui traite vos données",
      body: (
        <>
          <p>
            {site.legalName}, {hq.street}, {hq.city} — {hq.region}, République
            Démocratique du Congo.
          </p>
          <p className="mt-2">
            Pour toute question ou demande relative à vos données&nbsp;:{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              {site.email}
            </a>{" "}
            ou{" "}
            <a
              href={`tel:${site.phone}`}
              className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              {site.phoneDisplay}
            </a>
            .
          </p>
        </>
      ),
    },
    {
      title: "Ce que nous collectons, et seulement cela",
      body: (
        <>
          <p>
            Le formulaire de demande de devis recueille quatre réponses
            cliquées — la nature de votre besoin, le type de site, son
            alimentation actuelle et votre échéance — puis&nbsp;:
          </p>
          <ul className="mt-3 space-y-1.5">
            <li>
              <strong className="font-semibold text-slate-900">
                votre nom, votre téléphone et la ville du site
              </strong>{" "}
              — nécessaires&nbsp;: sans eux nous ne pouvons ni vous rappeler ni
              organiser la visite&nbsp;;
            </li>
            <li>
              <strong className="font-semibold text-slate-900">
                votre email et vos précisions
              </strong>{" "}
              — facultatifs. L&apos;email ne sert qu&apos;à vous transmettre le
              devis écrit.
            </li>
          </ul>
          <p className="mt-3">
            Nous ne demandons rien d&apos;autre. Aucun champ caché ne collecte
            d&apos;information sur vous&nbsp;: le seul que la page contienne est
            un piège à robots, laissé vide par les êtres humains.
          </p>
        </>
      ),
    },
    {
      title: "À quoi elles servent",
      body: (
        <p>
          À vous rappeler sous 24 h ouvrées, à convenir de la visite
          d&apos;audit, puis à établir votre devis. À rien d&apos;autre. Nous
          n&apos;envoyons pas de lettre d&apos;information et ne vous inscrivons
          à aucune liste de diffusion.
        </p>
      ),
    },
    {
      title: "Qui les voit",
      body: (
        <>
          <p>
            L&apos;équipe commerciale et technique de {site.legalName}. Votre
            demande arrive par email dans une boîte de l&apos;entreprise.
          </p>
          <p className="mt-2">
            Trois prestataires techniques interviennent dans cette chaîne, sans
            autre usage que de la faire fonctionner&nbsp;:
          </p>
          <ul className="mt-3 space-y-1.5">
            <li>
              <strong className="font-semibold text-slate-900">Vercel</strong>{" "}
              — hébergement du site et exécution du formulaire&nbsp;;
            </li>
            <li>
              <strong className="font-semibold text-slate-900">Resend</strong>{" "}
              — acheminement de votre demande vers notre boîte&nbsp;;
            </li>
            <li>
              <strong className="font-semibold text-slate-900">
                Google Analytics
              </strong>{" "}
              — mesure d&apos;audience.
            </li>
          </ul>
          <p className="mt-3">
            Nous ne vendons, ne louons ni n&apos;échangeons vos données. Elles
            ne servent à aucune publicité, ni chez nous ni ailleurs.
          </p>
        </>
      ),
    },
    {
      title: "Combien de temps",
      body: (
        <p>
          Trois ans après notre dernier échange, s&apos;il n&apos;a pas donné
          lieu à un contrat. Passé ce délai, la demande est supprimée. Si un
          chantier a été réalisé, les pièces liées sont conservées le temps
          exigé par nos obligations comptables et de garantie.
        </p>
      ),
    },
    {
      title: "Mesure d'audience",
      body: (
        <p>
          Nous utilisons Google Analytics pour savoir quelles pages sont lues et
          où les visiteurs abandonnent le formulaire. Cela repose sur des
          cookies déposés par Google. Nous n&apos;y associons ni votre nom, ni
          votre téléphone, ni votre email — la mesure porte sur des parcours,
          pas sur des personnes. Le blocage des cookies dans votre navigateur
          n&apos;empêche en rien l&apos;envoi du formulaire.
        </p>
      ),
    },
    {
      title: "Vos droits",
      body: (
        <>
          <p>
            Vous pouvez à tout moment demander à consulter les données que nous
            détenons sur vous, à les faire corriger, ou à les faire supprimer.
            Un message à{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              {site.email}
            </a>{" "}
            suffit — précisez simplement le numéro de téléphone utilisé lors de
            votre demande, c&apos;est ce qui nous permet de la retrouver.
          </p>
          <p className="mt-2">
            Nous répondons sous 30 jours. La suppression est définitive et
            gratuite.
          </p>
        </>
      ),
    },
  ];

  return (
    <Section className="relative isolate bg-brand-50 !pt-8 !pb-16 sm:!pt-10 lg:!pt-12 lg:!pb-24">
      <Glow variant="cool" corner="bottom-right" />
      <div className="container relative">
        <div className="mx-auto max-w-[44rem]">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-slate-500">
              <li>
                <Link href="/" className="transition-colors hover:text-brand-700">
                  Accueil
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight
                  className="size-3.5 shrink-0 text-slate-400"
                  aria-hidden="true"
                />
                <span className="font-semibold text-slate-700">
                  Confidentialité
                </span>
              </li>
            </ol>
          </nav>

          <h1 className="text-balance font-display text-[30px] font-bold leading-[1.1] tracking-[-0.01em] text-slate-900 sm:text-4xl md:text-[44px]">
            Ce que nous faisons{" "}
            <span className="text-brand-600">de vos informations.</span>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-slate-600 sm:text-base md:text-lg">
            Vous nous confiez un numéro pour être rappelé. Voilà exactement ce
            qu&apos;il devient, qui le voit, et comment le faire effacer.
          </p>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-[19px] font-bold leading-snug text-slate-900 sm:text-xl">
                  {section.title}
                </h2>
                <div className="mt-3 text-[15px] leading-relaxed text-slate-600 [&_li]:relative [&_li]:pl-4 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6em] [&_li]:before:size-1.5 [&_li]:before:rounded-full [&_li]:before:bg-solar-500">
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <p className="text-sm leading-relaxed text-slate-600">
              Cette page décrit le fonctionnement réel du site. Si une pratique
              change, elle change ici d&apos;abord.
            </p>
            <p className="mt-3">
              <Link
                href="/contact"
                className="text-sm font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                Retour au formulaire de devis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
