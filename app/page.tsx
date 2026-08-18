import type { Metadata } from "next";

import { Authority } from "@/components/home/authority";
import { CaseStudiesReach } from "@/components/home/case-studies-reach";
import { CostFrame } from "@/components/home/cost-frame";
import { Hero } from "@/components/home/hero";
import { KitsSelector } from "@/components/home/kits-selector";
import { Maintenance } from "@/components/home/maintenance";
import { Offerings } from "@/components/home/offerings";
import { Solutions } from "@/components/home/solutions";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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
