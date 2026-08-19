import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt =
  "Tech Solution RDC — énergie solaire, électricité et infrastructures techniques en RDC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "Énergie solaire · RDC",
    title: "Fini les délestages : l’autonomie solaire, installée et entretenue.",
  });
}
