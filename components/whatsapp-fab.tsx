import { WhatsAppIcon } from "@/components/icons";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * Bouton flottant WhatsApp — pastille discrète et premium
 * (sans pulsation), texte visible dès sm.
 */
export function WhatsAppFab() {
  return (
    <a
      href={buildWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      className="fixed bottom-7 right-7 z-40 hidden items-center gap-3 rounded-full border border-slate-200/80 bg-white/95 py-2.5 pl-5 pr-2.5 shadow-lift backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 lg:flex"
    >
      <span className="text-sm font-semibold text-slate-800">
        Nous contacter sur WhatsApp
      </span>
      <span className="flex size-9 items-center justify-center rounded-full bg-[#25D366]">
        <WhatsAppIcon className="size-5 text-white" />
      </span>
    </a>
  );
}
