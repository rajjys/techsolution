import { WhatsAppIcon } from "@/components/icons";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * Bouton flottant WhatsApp — pastille au repos, libellé déplié au survol.
 *
 * Le libellé s'ouvre vers la gauche : le bord droit étant ancré, la pastille
 * ne bouge pas sous le curseur. Masqué sous lg, où l'accès WhatsApp vit déjà
 * dans le menu.
 */
export function WhatsAppFab() {
  return (
    <a
      href={buildWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      className="group fixed bottom-6 right-6 z-40 hidden items-center rounded-full bg-[#25D366] shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 lg:inline-flex"
    >
      <span
        aria-hidden="true"
        className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold text-white opacity-0 transition-all duration-300 ease-out group-hover:max-w-[14rem] group-hover:opacity-100 group-focus-visible:max-w-[14rem] group-focus-visible:opacity-100"
      >
        <span className="block pl-5">Nous contacter sur WhatsApp</span>
      </span>
      <span className="grid size-14 shrink-0 place-items-center">
        <WhatsAppIcon className="size-7 text-white" />
      </span>
    </a>
  );
}
