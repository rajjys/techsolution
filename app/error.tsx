"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-grid-slate" aria-hidden="true" />
      <div className="container relative flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-navy-950 shadow-soft">
          <TriangleAlert className="size-8 text-solar-500" />
        </span>
        <h1 className="mt-8 text-2xl font-bold text-slate-900">
          Une erreur inattendue est survenue
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
          Nos équipes sont prévenues. Vous pouvez recharger la page ou revenir
          plus tard.
        </p>
        <Button variant="solar" className="mt-8" onClick={() => reset()}>
          <RotateCcw />
          Réessayer
        </Button>
      </div>
    </section>
  );
}
