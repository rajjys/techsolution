import { site } from "@/lib/site";

/**
 * Liens WhatsApp `wa.me` avec message pré-rempli.
 *
 * Les messages sont volontairement **courts** : ils partent en
 * pourcent-encodage dans l'URL, où « d'énergie solaire/électricité » devient
 * `d%27%C3%A9nergie%20solaire%2F%C3%A9lectricit%C3%A9`. Une phrase brève
 * suffit à ouvrir la conversation et garde l'URL lisible quand elle est
 * copiée, partagée ou affichée par l'application.
 */
export function buildWhatsAppLink(message?: string): string {
  const text = message ?? "Bonjour, je souhaite un devis pour mon site.";
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/** Demande portant sur un kit précis du catalogue. */
export function buildProductWhatsAppLink(productName: string): string {
  return buildWhatsAppLink(
    `Bonjour, je souhaite un devis pour le ${productName}.`,
  );
}

/** Demande portant sur un domaine d'expertise. */
export function buildServiceWhatsAppLink(serviceName: string): string {
  return buildWhatsAppLink(`Bonjour, je souhaite une étude : ${serviceName}.`);
}
