import { findKit, kitSegmentPhotos, kitSegments, kits } from "@/lib/data/kits";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Kit solaire hybride — Tech Solution RDC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Une vignette par kit, préparée au build comme les fiches. */
export function generateStaticParams() {
  return kits.map((kit) => ({ slug: kit.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kit = findKit(slug);

  if (!kit) {
    return ogImage({
      eyebrow: "Kits solaires",
      title: "Kits solaires hybrides, du foyer à l’établissement.",
    });
  }

  const segment = kitSegments.find((item) => item.id === kit.segment);
  return ogImage({
    /* Le segment en surtitre : « Ma maison » se lit avant les kVA. */
    eyebrow: `${segment?.label ?? "Kits solaires"} · ${kit.phase}`,
    title: `${kit.name} — ${kit.outcome}`,
    photo: kitSegmentPhotos[kit.segment].src.replace(/^\//, ""),
  });
}
