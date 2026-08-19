import type { Metadata } from "next";

import { Authority } from "@/components/home/authority";
import { CaseStudiesReach } from "@/components/home/case-studies-reach";
import { CostFrame } from "@/components/home/cost-frame";
import { Hero } from "@/components/home/hero";
import { KitsSelector } from "@/components/home/kits-selector";
import { Maintenance } from "@/components/home/maintenance";
import { Offerings } from "@/components/home/offerings";
import { Solutions } from "@/components/home/solutions";
import { projects } from "@/lib/data/clients";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/",
  /* Pas de `title` : l'accueil garde le titre par défaut du layout. */
  /*
   * La description décrivait la page (« Solutions énergétiques, solaires et
   * infrastructures techniques ») — vrai, mais interchangeable avec n'importe
   * quel concurrent du pays. Elle donne maintenant une raison de cliquer :
   * la preuve chiffrée, les clients qu'on peut vérifier, et d'où l'on part.
   */
  description: `${projects.length} installations livrées dans ${site.provincesDelivered} provinces — MONUSCO, CARE, ALIMA, Afriland. Étude et devis gratuits, depuis Bunia et Kinshasa.`,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Authority />
      <Solutions />
      <Offerings />
      <CaseStudiesReach />
      <Maintenance />
      <CostFrame />
      <KitsSelector />
    </>
  );
}
