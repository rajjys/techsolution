import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Kits solaires — Tech Solution RDC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "Kits solaires",
    title: "Du foyer à l’usine : neuf kits hybrides, de 650 Va à 30 kVA.",
    photo: "gallery-web/systeme-victron.jpg",
  });
}
