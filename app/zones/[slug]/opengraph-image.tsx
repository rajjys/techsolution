import { findZone, zones } from "@/lib/data/locations";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Installation solaire — Tech Solution RDC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Une vignette par ville, préparée au build comme les pages. */
export function generateStaticParams() {
  return zones.map((zone) => ({ slug: zone.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const zone = findZone(slug);
  if (!zone) {
    return ogImage({ eyebrow: "Zones d'intervention", title: "Partout en RDC." });
  }
  return ogImage({
    eyebrow: `${zone.name} · ${zone.province}`,
    title: `Installation solaire à ${zone.name}`,
    photo: zone.image.replace(/^\//, ""),
  });
}
