import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-grid-slate" aria-hidden="true" />
      <div className="container relative flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-navy-950 shadow-soft">
          <Compass className="size-8 text-solar-500" />
        </span>
        <p className="mt-8 font-display text-6xl font-bold text-navy-950">
          404
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Cette page n&apos;existe pas
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
          Le lien est peut-être obsolète ou l&apos;adresse mal saisie.
          Retrouvez nos services, notre catalogue et nos références depuis
          l&apos;accueil.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="solar" asChild>
            <Link href="/">
              <ArrowLeft />
              Retour à l&apos;accueil
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
