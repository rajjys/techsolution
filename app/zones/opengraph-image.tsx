import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Zones d'intervention — Tech Solution RDC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "Zones d'intervention",
    title: "Bunia, Kinshasa, Goma, Mahagi — et partout en RDC.",
    photo: "photos/equipe-trois-techniciens.webp",
  });
}
