import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion";
import { RotatingPhrases } from "@/components/home/rotating-phrases";
import { Glow } from "@/components/glow";
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
   * Fond `brand-800` — et c'est une décision, pas une dérive.
   *
   * Le hero était en `brand-50`, si pâle qu'il se lit comme du blanc. Mesuré
   * sur les pixels réellement affichés dans la colonne de texte : fond
   * #f0f0ff 84 %, texte #181830 6 %, or #ffc000 4,8 %, et **l'indigo de
   * marque absent des cinq teintes dominantes**. Un visiteur l'a résumé sans
   * savoir qu'il décrivait un défaut de conception : « tout est noir et or ».
   *
   * La cause n'était pas le fond mais l'accent : les quatre pages intérieures
   * accentuent leur titre en `brand-600`, l'accueil était la seule à
   * l'accentuer en or. C'était aussi une entorse au §2 du système — le
   * solaire est « action, exclusivement », et la chute d'un titre n'est pas
   * une action.
   *
   * ⚠️ Ce fond casse sciemment deux règles de design-system.md §1 : le sombre
   * y est « réservé aux moments de preuve et à la conclusion » (règle 4) et la
   * page descend un arc de l'aube à la nuit (règle 6). La lecture change : le
   * hero devient une **plaque de marque**, une couverture, et l'arc démarre
   * juste après, à la section d'autorité qui reste blanche. Le contraste de la
   * courbe blanche sur l'indigo est d'ailleurs plus net qu'il ne l'était sur
   * `brand-50`.
   *
   * `brand-800` et non `brand-950` : à #0B0A33 l'indigo vire au quasi noir, et
   * répondre « noir et or » par « presque noir et or » n'aurait rien réglé.
   */
  return (
    /*
      Le hero remonte sous l'en-tête et se rend sa hauteur en rembourrage.
      L'en-tête est `sticky` : il occupe donc 72 px dans le flux, et la barre
      tranchait la plaque de marque à l'horizontale. Remonté, le fond et la
      photo courent jusqu'au haut de la fenêtre, et l'en-tête — transparent
      tant qu'on n'a pas défilé — s'y pose au lieu de la couper.
    */
    <section className="relative isolate -mt-[72px] overflow-hidden bg-brand-800 pt-[72px]">
      {/*
        Halos radiaux — le système les impose sur toute surface teintée ou
        sombre (§1, règle 2) : sans eux l'aplat paraît plat et bon marché.
        Le coin solaire est en haut à droite, à l'opposé de la colonne de
        texte, pour ne pas concurrencer le bouton.
      */}
      <Glow variant="dark" corner="top-right" />

      {/* Image de fond — desktop uniquement */}
      <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
        <Image
          src="/photos/hero-pose-panneau.webp"
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
          className="object-cover object-[50%_70%] saturate-[1.04] brightness-[1.0]"
        />
        {/*
          Voile : `brand-50` plein à gauche → transparent à droite, d'un seul
          ton du fond de section jusqu'à l'image. Il a d'abord démarré à 10 %,
          puis mêlé un tint froid et un tint chaud : les diagonales très
          contrastées des panneaux transparaissaient derrière le chapô, et le
          mélange donnait ce rendu trouble, « presque propre ».

          ⚠️ Ce voile a été **réouvert** le 22 août. Il avait été calibré pour
          un hero `brand-50` : du texte sombre sur fond pâle exige un voile
          quasi opaque, et la photo se réduisait alors à une bande de 20 % au
          bord droit — « on ne voit que le technicien, pas le travail ». Sur
          fond `brand-800` avec du texte blanc, la contrainte s'inverse : le
          blanc reste lisible sur une photo à peine assombrie. Le voile part
          donc de 0,97 et s'éteint au bord, laissant près de la moitié de la
          largeur à l'image. C'est le fond sombre qui a rendu la photo
          possible, pas un réglage de plus.

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
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(28_26_122/0.97)_0%,rgb(28_26_122/0.95)_28%,rgb(28_26_122/0.9)_36%,rgb(28_26_122/0.8)_43%,rgb(28_26_122/0.66)_50%,rgb(28_26_122/0.5)_57%,rgb(28_26_122/0.34)_64%,rgb(28_26_122/0.2)_72%,rgb(28_26_122/0.1)_80%,rgb(28_26_122/0.04)_90%,rgb(28_26_122/0)_100%)]" />
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
            <h1 className="text-[36px] font-semibold leading-[1.12] tracking-[-0.025em] text-white sm:text-[42px] sm:leading-[1.1] md:text-6xl lg:max-w-[680px] lg:text-[80px] lg:leading-[1.05] lg:tracking-[-0.03em]">
              Fini les délestages&nbsp;: l&apos;autonomie solaire pour{" "}
              <RotatingPhrases />
            </h1>
          </Reveal>

          {/*
            Échelle mobile : titre 36 px, chapô 16 px.
            Le titre était à 30 px et le chapô à 18 px — soit le **haut** de
            l'échelle de chapô du §4 (« 15 → 18 px ») appliqué au plus petit
            écran. Les deux blocs pesaient presque le même poids et le titre ne
            se détachait plus. À 36/16 la hiérarchie revient, et « vos
            entreprises » retombe sur sa propre ligne — c'est précisément la
            chute que ce hero cherche à produire.

            36 px et pas plus : à 38 px, « pour » reste seul sur une ligne. Les
            trois phrases rotatives tiennent sur une ligne à 36 px dès 360 px
            de large (la plus longue, « vos sites industriels », mesure 291 px
            pour 320 px utiles), donc la hauteur réservée ne bouge pas et il
            n'y a aucun décalage de mise en page.
          */}
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
            <p className="mx-auto mt-4 max-w-xl text-base font-normal leading-relaxed text-brand-200 sm:mt-6 sm:text-lg lg:mx-0 lg:max-w-xl lg:text-[22px] lg:leading-[32px]">
              Étude, installation et{" "}
              <strong className="font-semibold text-white">
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
                variant="primary-dark"
                size="lg"
                className="w-full sm:w-auto"
                asChild
              >
                <Link href="/contact">Obtenez un devis gratuit</Link>
              </Button>
              <Link
                href="/references"
                className="group inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-1 py-1 text-base font-semibold text-brand-200 underline-offset-4 transition-colors duration-200
                hover:text-white hover:underline
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-800 sm:text-[17px]"
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
