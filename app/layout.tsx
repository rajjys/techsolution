import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { presenceCities } from "@/lib/data/case-studies";
import { legal, offices, site, socialLinks } from "@/lib/site";

import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Énergie solaire, électricité & infrastructures techniques`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "fr_CD",
    url: site.url,
    siteName: site.name,
    title:
      `${site.name} — Énergie solaire, électricité & infrastructures techniques`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0A33",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  logo: `${site.url}/assets/logo-full-blue.png`,
  image: `${site.url}/assets/logo-full-blue.png`,
  telephone: site.phone,
  email: site.email,
  foundingDate: String(site.foundedYear),
  slogan: site.tagline,
  description: site.description,
  address: offices.map((office) => ({
    "@type": "PostalAddress",
    streetAddress: office.street,
    addressLocality: office.city,
    addressRegion: office.region,
    addressCountry: "CD",
  })),
  /*
   * Les comptes officiels. C'est `sameAs` qui rattache le domaine aux profils
   * dans le graphe d'entités de Google — le levier le plus direct contre la
   * confusion de marque avec les autres « Tech Solution » du pays.
   */
  sameAs: socialLinks.map((account) => account.href),
  /*
   * Identifiants légaux congolais. `taxID` porte le NIF ; le RCCM et l'IDNAT
   * n'ont pas de propriété dédiée dans schema.org, d'où `identifier` typé par
   * son `propertyID`. Ce sont les numéros qu'un acheteur institutionnel
   * vérifie avant d'ouvrir un dossier.
   */
  taxID: legal.nif,
  identifier: [
    { "@type": "PropertyValue", propertyID: "RCCM", value: legal.rccm },
    { "@type": "PropertyValue", propertyID: "IDNAT", value: legal.idnat },
    { "@type": "PropertyValue", propertyID: "NIF", value: legal.nif },
  ],
  /*
   * Le pays reste la zone d'intervention, mais les provinces réellement
   * livrées sont nommées. Une couverture annoncée met en concurrence avec
   * tout le territoire ; une livraison prouvée distingue.
   */
  areaServed: [
    {
      "@type": "Country",
      name: "République Démocratique du Congo",
    },
    ...[...new Set(presenceCities.map((city) => city.province))].map(
      (province) => ({
        "@type": "AdministrativeArea",
        name: province,
        containedInPlace: {
          "@type": "Country",
          name: "République Démocratique du Congo",
        },
      }),
    ),
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: site.phone,
    contactType: "customer service",
    availableLanguage: ["French"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${outfit.variable} min-h-screen`}>
        {/* Sans JavaScript, les blocs animés restent visibles */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <a
          href="#contenu"
          className="sr-only z-[100] rounded-xl bg-brand-950 px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Aller au contenu principal
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <GoogleAnalytics gaId="G-BM0WRKQTVY" />
        <Footer />
        <WhatsAppFab />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </body>
    </html>
  );
}
