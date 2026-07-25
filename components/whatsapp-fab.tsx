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
      className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/95 p-2 shadow-lift backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:py-2.5 sm:pl-5 sm:pr-2.5 md:bottom-7 md:right-7"
    >
      <span className="hidden text-sm font-semibold text-slate-800 sm:block">
        Nous contacter sur WhatsApp
      </span>
      <span className="flex size-10 items-center justify-center rounded-full bg-[#25D366] sm:size-9">
        <WhatsAppIcon className="size-5 text-white" />
      </span>
    </a>
  );
}
