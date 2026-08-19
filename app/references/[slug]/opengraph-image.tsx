import { caseStudies } from "@/lib/data/case-studies";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Étude de cas — Tech Solution RDC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Une vignette par réalisation, préparée au build comme les pages. */
export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);

  if (!study) {
    return ogImage({
      eyebrow: "Nos réalisations",
      title: "17 installations en service, pour 11 organisations.",
    });
  }

  return ogImage({
    /* La ville en surtitre : c'est le repère qui manque au partage local. */
    eyebrow: `${study.city} · ${study.province}`,
    title: study.title,
    /* La photo du chantier lui-même — `image` est un chemin depuis /public. */
    photo: study.image.replace(/^\//, ""),
  });
}
