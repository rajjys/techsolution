import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Nos expertises — Tech Solution RDC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "Nos expertises",
    title: "Six domaines pour que le courant ne s’arrête plus.",
    photo: "gallery-web/technicien-toiture.jpg",
  });
}
