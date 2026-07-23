import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/logo";
import { WhatsAppIcon } from "@/components/icons";
import { navLinks, site } from "@/lib/site";
import { services } from "@/lib/data/services";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-navy-100">
      <div className="absolute inset-0 bg-grid-navy" aria-hidden="true" />
      <div
        className="absolute -right-40 -top-40 size-[420px] rounded-full bg-solar-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-8">
          {/* Marque */}
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="Tech Solution RDC — Accueil"
              className="inline-block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500"
            >
              <Logo onDark />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-navy-200">
              Solutions énergétiques, solaires et infrastructures techniques
              pour institutions, ONG, banques et entreprises — partout en
              République Démocratique du Congo.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
              <ShieldCheck className="size-4 text-solar-500" />
              Certifié &amp; Agréé en RDC — depuis {site.foundedYear}
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Navigation pied de page">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
              Navigation
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-navy-200 transition-colors hover:text-solar-500"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Nos services">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
              Expertises
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services#${service.slug}`}
                    className="text-navy-200 transition-colors hover:text-solar-500"
                  >
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={`tel:${site.phone}`}
                  className="group flex items-start gap-3 text-navy-200 transition-colors hover:text-solar-500"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-solar-500" />
                  <span>
                    {site.phoneDisplay}
                    <span className="block text-xs text-navy-300">
                      Lun. – Sam., 8h00 – 17h00
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-start gap-3 text-navy-200 transition-colors hover:text-solar-500"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-solar-500" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-navy-200 transition-colors hover:text-solar-500"
                >
                  <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-solar-500" />
                  WhatsApp Business — réponse rapide
                </a>
              </li>
              <li className="flex items-start gap-3 text-navy-200">
                <MapPin className="mt-0.5 size-4 shrink-0 text-solar-500" />
                <span>
                  Base opérationnelle : {site.base}
                  <span className="block text-xs text-navy-300">
                    Interventions dans les 26 provinces
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre inférieure */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 text-xs text-navy-300 md:flex-row">
          <p>
            © {year} {site.legalName} — {site.domain}. Tous droits réservés.
          </p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block size-1.5 rounded-full bg-solar-500" />
            {site.tagline} — avec une démarche {site.approach}
          </p>
        </div>
      </div>
    </footer>
  );
}
