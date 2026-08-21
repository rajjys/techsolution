import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Devis gratuit — Tech Solution RDC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "Devis gratuit",
    title: "Audit sur site, dimensionnement et devis — réponse sous 24 h ouvrées.",
    photo: "photos/cablage-duo-technicien.webp",
  });
}
