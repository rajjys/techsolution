import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Slot minimal compatible React Server Components
 * (@radix-ui/react-slot évalue un createContext côté serveur — proscrit en RSC).
 */
function Slot({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const child = React.Children.only(children) as React.ReactElement<{
    className?: string;
  }>;
  return React.cloneElement(child, {
    ...props,
    className: cn(className, child.props.className),
  });
}

/**
 * Matrice des appels à l'action — transcrite depuis la page d'accueil.
 * Le style ne dépend pas de l'importance seule mais du **contexte de pose** :
 * la surface (claire ou sombre) et le voisinage (isolé, adossé à un primaire,
 * ou à l'intérieur d'une carte).
 *
 * La couleur d'action est le **jaune de marque** (`solar-500`), et elle ne
 * sert qu'à ça. C'est le seul aplat saturé d'un écran : le bleu tient le
 * mobilier, le blanc le fond. L'orange `ember` a quitté les actions — il
 * n'appartenait pas à l'identité (bleu / jaune / blanc) et ne subsiste que
 * là où il porte un sens d'état, l'erreur de formulaire notamment.
 *
 * Le jaune impose son sens de lecture : du texte blanc sur `solar-500`
 * plafonne à 1,7:1, illisible. C'est donc le texte qui devient sombre —
 * `brand-950` sur `solar-500` monte à 11:1.
 *
 *   primary        action principale sur surface claire
 *   primary-dark   la même sur surface sombre
 *   outline-strong secondaire adossé à un primaire
 *   link           renvoi discret — un lien de section, pas une action
 *   outline-brand  secondaire isolé, registre navigation
 *   outline-light  secondaire sur surface sombre — s'inverse au survol
 *   card           action d'une carte mise en avant
 *   card-outline   action d'une carte ordinaire
 *
 * L'anneau au survol (`ring-4` + `ring-offset-1`) est la signature
 * d'interaction du site : elle vaut aussi pour les cartes et les contrôles.
 *
 * La flèche animée reste au point d'appel (`group` + `group-hover:translate-x-1`) :
 * la baker ici la déclencherait aussi sur les icônes de tête.
 *
 * @see docs/design-system.md — « Appels à l'action »
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /*
         * `shadow-sm` et non une bordure : sur fond blanc le jaune n'a que
         * 1,7:1 de contraste de luminance, donc un contour mou. Une ombre
         * lui rend son arête sans entrer dans le calcul des hauteurs — une
         * bordure de 1 px sur le seul `primary` l'aurait désaligné des
         * variantes à bordure de 2 px, déjà compensées plus bas.
         */
        primary:
          "bg-solar-500 text-brand-950 shadow-sm hover:scale-105 hover:ring-4 hover:ring-solar-200 hover:ring-offset-1 focus-visible:ring-solar-600",
        "primary-dark":
          "bg-solar-500 text-brand-950 hover:scale-105 hover:ring-4 hover:ring-solar-500/40 hover:ring-offset-1 hover:ring-offset-brand-950 focus-visible:ring-solar-400 focus-visible:ring-offset-brand-950",
        /*
         * Le secondaire ne peut pas être un contour jaune : sur blanc il
         * disparaîtrait. Il passe donc en bleu-noir — le registre du
         * mobilier, soit exactement ce qu'un secondaire doit être.
         */
        "outline-strong":
          "border-2 border-brand-950 text-brand-950 hover:ring-4 hover:ring-brand-100 hover:ring-offset-1 focus-visible:ring-brand-950",
        /*
         * Un renvoi vers une section de la même page n'est pas une action :
         * lui donner un cadre en fait un second bouton, et deux cibles de
         * poids voisin n'en laissent aucune dominante. Même traitement que le
         * secondaire du hero d'accueil — texte gris, souligné au survol.
         */
        link: "font-semibold text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline focus-visible:ring-slate-400",
        "outline-brand":
          "border-2 border-brand-700/30 bg-brand-200/15 text-brand-700 hover:ring-4 hover:ring-brand-200 hover:ring-offset-1 focus-visible:ring-brand-600",
        "outline-light":
          "border-2 border-white/25 text-white hover:border-white hover:bg-white hover:text-brand-950 hover:ring-4 hover:ring-white/25 hover:ring-offset-1 hover:ring-offset-brand-950 focus-visible:ring-solar-500 focus-visible:ring-offset-brand-950",
        /*
         * Chrome de navigation (header, menu) : ni `ember`, ni `brand` saturé,
         * mais le quasi-noir `brand-950`.
         *
         * La couleur d'action reste au contenu — une barre jaune permanente
         * en haut de chaque page la banaliserait. Mais l'indigo `brand-700`
         * posait le problème inverse : #232199 sur blanc atteint ~12:1 de
         * contraste, quand le CTA du hero n'en faisait que 4,9:1 sur son
         * fond teinté. Le bouton d'en-tête écrasait le bouton de conversion,
         * deux fois et demie plus fort que lui.
         *
         * En quasi-noir il redevient ce qu'il est — du mobilier — et laisse
         * une seule couleur saturée dans le premier écran : le jaune.
         */
        nav: "bg-brand-950 text-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:ring-4 hover:ring-brand-100 hover:ring-offset-1 focus-visible:ring-brand-950",
        card: "bg-brand-600 text-white hover:ring-4 hover:ring-brand-200 hover:ring-offset-1 focus-visible:ring-brand-500",
        "card-outline":
          "border-2 border-brand-400 text-brand-600 hover:ring-4 hover:ring-brand-200 hover:ring-offset-1 focus-visible:ring-brand-500",
        /**
         * Secondaire neutre : la couleur reste au picto (le vert WhatsApp,
         * par exemple) plutôt que d'inonder tout le bouton.
         */
        neutral:
          "border-2 border-slate-200 bg-white text-slate-900 hover:border-brand-300 hover:ring-4 hover:ring-brand-100 hover:ring-offset-1 focus-visible:ring-brand-500",
        ghost:
          "text-slate-700 hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-brand-500",
        whatsapp:
          "bg-[#25D366] text-white hover:ring-4 hover:ring-[#25D366]/30 hover:ring-offset-1 focus-visible:ring-[#25D366]",
      },
      /*
       * Les tailles sont exprimées en padding, pas en hauteur fixe : c'est ce
       * que fait la page d'accueil. Les variantes à bordure reçoivent ensuite
       * un padding réduit de 2 px (cf. compoundVariants) pour retomber sur la
       * même hauteur que leur primaire — `box-sizing: border-box` compte la
       * bordure dans la hauteur.
       */
      size: {
        sm: "px-5 py-2.5 text-sm [&_svg]:size-4",
        md: "px-7 py-3.5 text-base [&_svg]:size-4",
        lg: "px-8 py-4 text-[17px] [&_svg]:size-5",
        icon: "size-11 [&_svg]:size-5",
      },
      /** Pleine largeur — cartes, et empilement sur mobile. */
      block: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      /*
       * `link` n'a pas de boîte : il annule le rembourrage de la taille, qui
       * sinon lui donnerait l'encombrement d'un bouton plein sans en avoir
       * l'apparence — et décalerait son texte par rapport à son voisin.
       */
      ...(["sm", "md", "lg"] as const).map((size) => ({
        variant: "link" as const,
        size,
        class: "px-1 py-1",
      })),
      // Compensation des 2 px de bordure, taille par taille.
      ...(
        [
          "outline-strong",
          "outline-brand",
          "outline-light",
          "card-outline",
          "neutral",
        ] as const
      ).flatMap((variant) => [
        { variant, size: "sm" as const, class: "px-[18px] py-2" },
        { variant, size: "md" as const, class: "px-[26px] py-3" },
        { variant, size: "lg" as const, class: "px-[30px] py-[0.875rem]" },
      ]),
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      block: false,
    },
  },
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, block, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
