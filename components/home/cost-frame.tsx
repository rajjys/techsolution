import Link from "next/link";
import { ArrowRight, ClipboardCheck, Clock3, ReceiptText } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Eyebrow } from "@/components/section";
import { Button } from "@/components/ui/button";

/**
 * Le cadre de prix — sans prix.
 *
 * La page ne publie aucun tarif, par décision de l'entreprise. Ce n'est pas
 * pour autant la question du visiteur qui disparaît : elle se scinde en trois
 * peurs, dont une seule appelle un chiffre.
 *
 *   « demander m'engage-t-il ? »  → les trois promesses ci-dessous ;
 *   « vais-je être gonflé ? »     → le devis poste par poste ;
 *   « quel ordre de grandeur ? »  → le titre.
 *
 * Le titre est la pièce maîtresse : il n'annonce pas un prix, il s'appuie sur
 * un montant que le visiteur a déjà en tête — sa facture de carburant — et
 * fait du devis le moyen de la convertir en durée. Le concurrent réel n'est
 * pas un autre installateur, c'est un groupe électrogène dont on connaît le
 * coût de fonctionnement ; se comparer à lui vaut mieux que se taire.
 *
 * Aucune des trois promesses n'est nouvelle : le pied de page annonce déjà la
 * réponse sous 24 h ouvrées, /services la facturation après devis, et
 * l'audit gratuit apparaît partout. Elles étaient dispersées et énoncées en
 * libellés de boutons, là où elles se lisent comme un argument de vente ;
 * réunies, elles se lisent comme une politique.
 *
 * La section tient aussi une place de tuyauterie : entre « Ce que nous
 * offrons » et les kits, trois sections se suivaient sans le moindre chemin
 * vers /contact — le plus long segment de la page, et il traversait
 * précisément le point où la conviction est au plus haut, juste après les
 * réalisations.
 */
const promises = [
  {
    icon: ClipboardCheck,
    title: "Audit gratuit sur site",
    detail:
      "Un technicien relève vos charges réelles, chez vous ou sur votre site.",
  },
  {
    icon: Clock3,
    title: "Réponse sous 24 h ouvrées",
    detail: "Partout en RDC, depuis nos bases de Bunia et Kinshasa.",
  },
  {
    icon: ReceiptText,
    title: "Rien n'est facturé avant le devis",
    detail:
      "Vous décidez une fois le chiffrage en main, pas avant.",
  },
];

export function CostFrame() {
  return (
    <section
      aria-labelledby="cadre-devis-titre"
      className="bg-surface-cool py-14 sm:py-20 lg:py-24"
    >
      <div className="container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Avant de vous engager</Eyebrow>
          <h2
            id="cadre-devis-titre"
            className="mt-4 text-balance text-[26px] font-bold leading-[1.18] text-slate-900 sm:text-3xl sm:leading-[1.15] md:text-4xl"
          >
            Vous connaissez votre facture de carburant.{" "}
            <span className="text-brand-600">
              L&apos;audit vous dit en combien de mois l&apos;installation la
              remplace.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-base md:text-lg">
            Le devis détaille chaque poste — matériel, pose, mise en service,
            entretien. Pas de forfait opaque&nbsp;: vous voyez ce que vous
            payez, ligne par ligne.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-6 lg:mt-14 lg:gap-10">
          {promises.map((promise) => (
            <StaggerItem key={promise.title}>
              <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-card">
                  <promise.icon
                    className="size-6 text-brand-600"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {promise.title}
                </h3>
                <p className="mt-2 max-w-[19rem] text-sm leading-relaxed text-slate-600">
                  {promise.detail}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-7 lg:mt-14">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="/contact">Demander mon audit gratuit</Link>
            </Button>
            <Button variant="link" className="group" asChild>
              <Link href="/produits">
                Voir les kits et leur composition
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
