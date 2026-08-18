"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { WhatsAppIcon } from "@/components/icons";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Bouton flottant WhatsApp — pastille au repos, libellé déplié au survol.
 *
 * Le libellé s'ouvre vers la gauche : le bord droit étant ancré, la pastille
 * ne bouge pas sous le curseur.
 *
 * **Visible aussi sur mobile.** Il en était masqué au motif que l'accès
 * WhatsApp vivait dans le menu — mais un canal rangé derrière un hamburger
 * n'est pas un canal offert, et le mobile est le terrain réel en RDC. Il
 * disparaît en revanche sur /contact : la page y propose déjà WhatsApp sous
 * l'entonnoir, et la barre d'action du formulaire occupe le bas de l'écran.
 * Deux pastilles dans le même coin, dont l'une couvre « Continuer », c'est un
 * chemin de conversion qui en bloque un autre.
 *
 * Il n'apparaît qu'une fois le premier écran dépassé. Le vert #25D366 est une
 * couleur saturée de plus dans un hero qui doit n'en compter qu'une, et c'est
 * un second chemin de conversion posé en diagonale du CTA : sur l'accueil, les
 * deux se disputaient le coin bas-droit. Passé le hero, le devis n'est plus à
 * l'écran et WhatsApp devient le raccourci utile — d'autant qu'en RDC il
 * convertit. Il ne disparaît donc pas : il attend son tour.
 */
export function WhatsAppFab() {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/contact") return null;

  return (
    <a
      href={buildWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      /*
       * `invisible` et non la seule opacité : un élément à `opacity-0` reste
       * focusable au clavier, et le bouton se serait retrouvé dans l'ordre de
       * tabulation du hero alors qu'il n'y est pas visible.
       */
      className={cn(
        "group fixed bottom-5 right-5 z-40 inline-flex items-center rounded-full bg-[#25D366] shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:bottom-6 sm:right-6",
        visible
          ? "translate-y-0 opacity-100"
          : "invisible translate-y-4 opacity-0",
      )}
    >
      <span
        aria-hidden="true"
        className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold text-white opacity-0 transition-all duration-300 ease-out group-hover:max-w-[14rem] group-hover:opacity-100 group-focus-visible:max-w-[14rem] group-focus-visible:opacity-100"
      >
        <span className="block pl-5">Nous contacter sur WhatsApp</span>
      </span>
      <span className="grid size-[3.25rem] shrink-0 place-items-center sm:size-14">
        <WhatsAppIcon className="size-6 text-white sm:size-7" />
      </span>
    </a>
  );
}
