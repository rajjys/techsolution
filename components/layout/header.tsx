"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Mail, Menu, Phone } from "lucide-react";

import { Logo } from "@/components/logo";
import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks, site } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      {/* Barre utilitaire */}
      <div className="hidden bg-navy-950 text-navy-100 lg:block">
        <div className="container flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${site.phone}`}
              className="flex items-center gap-1.5 transition-colors hover:text-solar-500"
            >
              <Phone className="size-3.5 text-solar-500" />
              {site.phoneDisplay}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-1.5 transition-colors hover:text-solar-500"
            >
              <Mail className="size-3.5 text-solar-500" />
              {site.email}
            </a>
          </div>
          <p className="font-medium tracking-wide text-navy-200">
            Interventions dans les{" "}
            <span className="font-semibold text-solar-500">26 provinces</span>{" "}
            de la RDC — depuis {site.foundedYear}
          </p>
        </div>
      </div>

      {/* Barre principale */}
      <div
        className={cn(
          "border-b bg-white/90 backdrop-blur-md transition-all duration-300",
          scrolled
            ? "border-slate-200/90 shadow-[0_8px_30px_-12px_rgba(11,25,44,0.12)]"
            : "border-transparent",
        )}
      >
        <div className="container flex h-[72px] items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Tech Solution RDC — Accueil"
            className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2"
          >
            <Logo />
          </Link>

          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-1 lg:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500",
                  isActive(link.href)
                    ? "text-navy-950"
                    : "text-slate-600 hover:bg-navy-50 hover:text-navy-950",
                )}
              >
                {link.label}
                {isActive(link.href) ? (
                  <span className="absolute inset-x-3.5 -bottom-px h-[3px] rounded-full bg-solar-500" />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button variant="solar" asChild>
              <Link href="/contact">
                Demander un devis
                <ArrowRight />
              </Link>
            </Button>
          </div>

          {/* Menu mobile */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Ouvrir le menu de navigation"
              >
                <Menu className="!size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col p-0">
              <div className="border-b border-slate-100 p-5">
                <SheetTitle asChild>
                  <Link href="/" onClick={() => setMobileOpen(false)}>
                    <Logo />
                  </Link>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Menu de navigation Tech Solution RDC
                </SheetDescription>
              </div>

              <nav
                aria-label="Navigation mobile"
                className="flex flex-1 flex-col gap-1 overflow-y-auto p-5"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold transition-colors",
                      isActive(link.href)
                        ? "bg-navy-950 text-white"
                        : "text-slate-700 hover:bg-navy-50",
                    )}
                  >
                    {link.label}
                    <ArrowRight
                      className={cn(
                        "size-4",
                        isActive(link.href)
                          ? "text-solar-500"
                          : "text-slate-300",
                      )}
                    />
                  </Link>
                ))}
              </nav>

              <div className="space-y-3 border-t border-slate-100 p-5">
                <Button variant="solar" className="w-full" asChild>
                  <Link href="/contact" onClick={() => setMobileOpen(false)}>
                    Demander un devis
                    <ArrowRight />
                  </Link>
                </Button>
                <Button variant="whatsapp" className="w-full" asChild>
                  <a
                    href={buildWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="size-4" />
                    WhatsApp Business
                  </a>
                </Button>
                <div className="space-y-1.5 pt-2 text-center text-xs text-slate-500">
                  <p>
                    <a
                      href={`tel:${site.phone}`}
                      className="font-semibold text-navy-900"
                    >
                      {site.phoneDisplay}
                    </a>
                  </p>
                  <p>{site.email}</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
