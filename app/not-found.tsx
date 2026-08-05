import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

import { Glow } from "@/components/glow";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-50">
      <Glow variant="cool" />
      <div className="container relative flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-950 shadow-soft">
          <Compass className="size-8 text-solar-500" />
        </span>
        <p className="mt-8 font-display text-6xl font-bold text-slate-900">
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
          <Button asChild>
            <Link href="/">
              <ArrowLeft />
              Retour à l&apos;accueil
            </Link>
          </Button>
          <Button variant="outline-ember" asChild>
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
