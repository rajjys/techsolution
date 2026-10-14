import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Produits solaires — Tech Solution RDC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "Produits",
    title: "Kits solaires et systèmes sur mesure, du foyer à l’établissement.",
    photo: "photos/toiture-residence-duo.webp",
  });
}
