import type { Metadata } from "next";

import { Authority } from "@/components/home/authority";
import { CaseStudiesReach } from "@/components/home/case-studies-reach";
import { Hero } from "@/components/home/hero";
import { KitsSelector } from "@/components/home/kits-selector";
import { KitsShowcase } from "@/components/home/kits-showcase";
import { Offerings } from "@/components/home/offerings";
import { SolarStatement } from "@/components/home/solar-statement";
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
      <SolarStatement />
      <KitsSelector />
      <KitsShowcase />
    </>
  );
}
