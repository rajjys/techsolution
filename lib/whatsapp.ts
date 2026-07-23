import { site } from "@/lib/site";

/**
 * Construit un lien WhatsApp Business `wa.me` avec message pré-rempli.
 */
export function buildWhatsAppLink(message?: string): string {
  const text =
    message ??
    "Bonjour Tech Solution, je souhaite obtenir un devis pour un projet d'énergie solaire/électricité. Pouvez-vous me recontacter ?";
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/** Message pré-rempli pour une demande de devis produit. */
export function buildProductWhatsAppLink(productName: string): string {
  return buildWhatsAppLink(
    `Bonjour Tech Solution, je suis intéressé par « ${productName} ». Merci de m'envoyer un devis détaillé.`,
  );
}

/** Message pré-rempli pour une demande d'étude sur un service. */
export function buildServiceWhatsAppLink(serviceName: string): string {
  return buildWhatsAppLink(
    `Bonjour Tech Solution, je souhaite une étude gratuite pour un projet : ${serviceName}. Pouvez-vous me recontacter ?`,
  );
}
