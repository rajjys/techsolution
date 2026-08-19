import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "À propos — Tech Solution RDC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "À propos",
    title: "Une ingénierie congolaise au service de l’autonomie électrique.",
    photo: "gallery-web/equipe-technique.jpg",
  });
}
