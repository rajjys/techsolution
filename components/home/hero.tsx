import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion";
import { RotatingPhrases } from "@/components/home/rotating-phrases";
import { Button } from "@/components/ui/button";
import { offices } from "@/lib/site";

/**
 * « Bunia et Kinshasa » — dérivé de `offices`, qui reste la source unique des
 * implantations (pied de page, page contact, JSON-LD). `Intl.ListFormat` pour
 * que l'énumération reste correcte le jour où une troisième base s'ouvre.
 */
const baseCities = new Intl.ListFormat("fr", { type: "conjunction" }).format(
  offices.map((office) => office.city),
);

/**
 * Hero pleine largeur (modèle BairesDev) : image de fond plein cadre sur
 * desktop avec voile blanc dégradé gauche → droite ; typographie centrée
 * et sans image en dessous de lg.
 */
export function Hero() {
  /*
   * Le hero est bleu très pâle, la section d'autorité est blanche : c'est ce
   * qui rend la courbe lisible, y compris sur mobile où l'image est masquée
   * et où le fond est alors la seule séparation.
   *
   * `brand-50` et non plus un crème : le fond, le mobilier et le logo sont
   * désormais du même bleu, et le jaune reste seul à porter l'action. Un fond
   * chaud sous un bouton jaune aurait remis deux teintes voisines en
   * concurrence — le défaut même qu'on cherchait à sortir de la page.
   */
  return (
    <section className="relative overflow-hidden bg-brand-50">
      {/* Image de fond — desktop uniquement */}
      <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1509389928833-fe62aef36deb?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          /*
           * `loading="lazy"` et non `priority`, alors que l'image est bien
           * au-dessus de la ligne de flottaison — sur desktop.
           *
           * `hidden lg:block` masque le conteneur sous `lg` mais n'empêche pas
           * le téléchargement : le navigateur allait chercher 80 Ko jamais
           * affichés, et `priority` les plaçait en tête de file, devant la
           * police et le HTML. Sur une connexion de terrain, l'image décorative
           * du desktop retardait le texte du mobile.
           *
           * En `lazy`, un élément en `display:none` n'entre jamais dans le
           * viewport : mobile ne la charge pas du tout. Sur desktop elle est
           * dans le viewport dès la mise en page et part immédiatement.
           */
          loading="lazy"
          sizes="(min-width: 1024px) 100vw, 1px"
          className="object-cover object-[70%_45%] saturate-[0.85] brightness-[1.04]"
        />
        {/*
          Voile : `brand-50` plein à gauche → transparent à droite, d'un seul
          ton du fond de section jusqu'à l'image. Il a d'abord démarré à 10 %,
          puis mêlé un tint froid et un tint chaud : les diagonales très
          contrastées des panneaux transparaissaient derrière le chapô, et le
          mélange donnait ce rendu trouble, « presque propre ».

          Le voile s'éteint à 84 % et non au bord droit : au-delà, la photo
          est nette. Un dégradé qui court jusqu'au bord ne laisse aucune zone
          franche et donne cette impression de brume sur toute l'image.

          Surtout : la colonne de texte et l'image ne se recouvrent jamais.
          C'est la règle du modèle — chez BairesDev le texte s'arrête vers
          49 % et l'image ne commence à paraître qu'à 52 %. Densifier le voile
          ne suffisait pas : tant que le titre dépassait dans la zone de
          fondu, il restait posé sur les diagonales des panneaux. C'est donc
          le titre qui recule (`max-w`), pas le voile qui avance — sinon il ne
          reste plus aucune bande d'image franche.

          Le dégradé est écrit en toutes lettres, en paliers rapprochés, et
          non avec les utilitaires `from`/`via`/`to`. Trois arrêts donnaient
          une rampe d'alpha linéaire, dont l'œil repère la cassure de pente :
          on lisait une arête franche entre la colonne de texte et la photo
          alors que le code n'en contenait aucune. Neuf paliers approchent une
          courbe et la couture disparaît.

          Corollaire, appris à la dure : les positions littérales des
          utilitaires Tailwind doivent s'écrire entre crochets. L'échelle
          `gradientColorStopPositions` ne contient que des multiples de 5, et
          `from-54%` ne produisait aucune règle — la variable retombait sur sa
          valeur par défaut, le voile se dégradait depuis le bord gauche, et
          la classe se lisait juste sans exister.
        */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(242_242_253)_0%,rgb(242_242_253)_46%,rgb(242_242_253/0.98)_53%,rgb(242_242_253/0.92)_59%,rgb(242_242_253/0.8)_65%,rgb(242_242_253/0.62)_71%,rgb(242_242_253/0.42)_77%,rgb(242_242_253/0.22)_83%,rgb(242_242_253/0.08)_89%,rgb(242_242_253/0)_95%)]" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl pb-36 pt-8 text-center sm:pb-40 md:pt-12 lg:mx-0 lg:max-w-6xl lg:pb-52 lg:pt-14 lg:text-left xl:-ml-8">
          {/*
            Une seule phrase, dont la rotation est la chute — comme le modèle,
            où la couleur d'action tombe sur le groupe nominal qui achève le titre
            (« …Vetted Nearshore *Full-Stack Engineers* »).

            La version précédente refermait une phrase (« …24h/24. ») puis en
            ouvrait une seconde, animée, qui redisait la première (« Fini les
            délestages » ≈ « Éliminez les coupures »). La couleur y décorait au
            lieu de désigner, et le mouvement, placé haut à gauche, ramenait
            l'œil vers le titre toutes les 3,5 s — loin du bouton. Ici il se
            produit sur la dernière ligne, juste au-dessus du CTA et dans sa
            couleur : le regard descend de jaune en jaune.

            « l'autonomie solaire » porte la catégorie, et c'est le titre qui
            doit la porter. Sans elle — « Fini les délestages pour vos foyers »
            — rien ne disait si l'on vendait des groupes électrogènes, si l'on
            réparait des lignes ou si l'on installait des systèmes autonomes :
            le chapô devait rattraper la première ligne. « Autonomie » dit le
            stockage sans le jargon des batteries.
          */}
          <Reveal mode="mount">
            <h1 className="text-[30px] font-semibold leading-[1.12] tracking-[-0.025em] text-slate-900 sm:text-[42px] sm:leading-[1.1] md:text-6xl lg:max-w-[680px] lg:text-[80px] lg:leading-[1.05] lg:tracking-[-0.03em]">
              Fini les délestages&nbsp;: l&apos;autonomie solaire pour{" "}
              <RotatingPhrases />
            </h1>
          </Reveal>

          <Reveal mode="mount" delay={0.1}>
            {/*
              Le chapô prend les créneaux que le titre ne peut pas porter : le
              comment (étude, pose, entretien, batteries), la portée, et le
              qui.

              « haute fiabilité » a sauté. C'était un adjectif invérifiable,
              que revendique aussi bien n'importe quel concurrent. Ce qui lève
              vraiment l'objection sur ce marché n'est pas « est-ce que le
              solaire fonctionne » mais « qui vient le réparer dans dix-huit
              mois » : d'où « maintenance », et deux villes nommées plutôt
              qu'une promesse.

              Gras à l'intérieur du chapô : un point d'accroche pour le regard
              qui balaie sans lire.
            */}
            <p className="mx-auto mt-4 max-w-xl text-lg font-normal leading-relaxed text-[#52606D] sm:mt-6 lg:mx-0 lg:max-w-xl lg:text-[22px] lg:leading-[32px]">
              Étude, installation et{" "}
              <strong className="font-semibold text-slate-900">
                maintenance
              </strong>{" "}
              de systèmes solaires avec batteries — partout en RDC, depuis nos
              bases de {baseCities}.
            </p>
          </Reveal>

          {/*
            Un seul bouton. Le secondaire était un co-primaire déguisé : même
            hauteur, même rayon, bordure de 2 px, fond teinté et couleur de
            marque concurrente. Deux cibles de poids égal n'en font aucune de
            dominante. Réduit à un lien texte, il reste accessible à qui le
            cherche sans disputer la fixation au devis.
          */}
          <Reveal mode="mount" delay={0.2}>
            <div className="mx-auto mt-8 flex max-w-sm flex-col items-center gap-5 sm:mx-0 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-7 lg:mt-14 lg:justify-start">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                asChild
              >
                <Link href="/contact">Obtenez un devis gratuit</Link>
              </Button>
              <Link
                href="/references"
                className="group inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-1 py-1 text-base font-semibold text-slate-600 underline-offset-4 transition-colors duration-200
                hover:text-slate-900 hover:underline
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 sm:text-[17px]"
              >
                Découvrir nos réalisations
                <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
