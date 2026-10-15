import { findServiceByPath, services } from "@/lib/data/services";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Expertise — Tech Solution RDC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Une vignette par domaine, préparée au build comme les pages. */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.urlSlug ?? service.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = findServiceByPath(slug);
  if (!service) {
    return ogImage({ eyebrow: "Nos services", title: "Six expertises, une seule équipe." });
  }
  return ogImage({
    eyebrow: service.shortTitle,
    title: service.outcome,
    photo: service.image.replace(/^\//, ""),
  });
}
