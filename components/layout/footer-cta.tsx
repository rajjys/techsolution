"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * Les deux appels à l'action de la conclusion du pied de page.
 *
 * Sur la page /contact, « Demander une étude gratuite » renvoyait vers la page
 * qu'on est en train de lire : une boucle morte posée au bas du seul écran du
 * site où le visiteur est déjà en train de convertir. Le bouton disparaît donc
 * là-bas ; WhatsApp reste, parce que c'est un autre canal, pas le même chemin.
 *
 * C'est le seul morceau client du pied de page — il a besoin de savoir où l'on
 * se trouve, et le reste n'en a aucun besoin.
 */
export function FooterCta() {
  const pathname = usePathname();
  const onContactPage = pathname === "/contact";

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
      {onContactPage ? null : (
        <Button variant="primary-dark" className="group w-full sm:w-auto" asChild>
          <Link href="/contact">
            Demander une étude gratuite
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Button>
      )}
      <a
        href={buildWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/25 px-6 py-[0.8rem] text-base font-semibold text-white transition-all duration-200
        hover:border-white hover:bg-white hover:text-brand-950 hover:ring-4 hover:ring-white/25 hover:ring-offset-1 hover:ring-offset-brand-950
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 sm:w-auto"
      >
        <WhatsAppIcon className="size-5" />
        {onContactPage ? `Écrire sur WhatsApp` : "WhatsApp"}
      </a>
    </div>
  );
}

/** La promesse du bandeau — elle aussi change de sens une fois sur /contact. */
export function FooterLead() {
  const pathname = usePathname();
  if (pathname === "/contact") {
    return (
      <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-brand-200 sm:text-base">
        Le formulaire est plus haut. Si vous préférez la voix ou le message,
        c&apos;est le même numéro, aux mêmes heures.
      </p>
    );
  }
  return (
    <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-brand-200 sm:text-base">
      Audit, dimensionnement et devis gratuits — réponse sous 24 h ouvrées,
      partout en RDC.
    </p>
  );
}
