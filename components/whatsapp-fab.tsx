import { WhatsAppIcon } from "@/components/icons";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * Bouton flottant WhatsApp Business — visible sur tout le site,
 * message français pré-rempli.
 */
export function WhatsAppFab() {
  return (
    <a
      href={buildWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter avec Tech Solution sur WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-0 rounded-full bg-[#25D366] p-3.5 text-white shadow-lift transition-all duration-300 hover:gap-2.5 hover:pl-5 hover:shadow-[0_20px_45px_-12px_rgba(37,211,102,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 md:bottom-7 md:right-7"
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[160px] group-hover:opacity-100">
        Devis via WhatsApp
      </span>
      <WhatsAppIcon className="size-6" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.6s]" />
    </a>
  );
}
