import { projects } from "@/lib/data/clients";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = "Nos réalisations — Tech Solution RDC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "Nos réalisations",
    title: `${projects.length} installations documentées, ${site.householdsEquipped}+ foyers équipés`,
  });
}
