import { caseStudies, findCaseStudy } from "@/lib/data/case-studies";
import { clients, projects } from "@/lib/data/clients";
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
  const study = findCaseStudy(slug);

  if (!study) {
    return ogImage({
      eyebrow: "Nos réalisations",
      title: `${projects.length} installations documentées, pour ${clients.length} clients nommés.`,
    });
  }

  return ogImage({
    /* Le client et la ville en surtitre : les deux repères qu'un lien
       partagé doit porter. Un client non nommé n'y figure pas. */
    eyebrow: study.clientNamed
      ? `${study.client} · ${study.city}`
      : `${study.city} · ${study.province}`,
    title: study.title,
    /* La photo du chantier lui-même — `image` est un chemin depuis /public. */
    photo: study.image.replace(/^\//, ""),
  });
}
