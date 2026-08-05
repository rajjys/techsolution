import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { offices, site } from "@/lib/site";

import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "Tech Solution RDC — Énergie solaire, électricité & infrastructures techniques",
    template: "%s | Tech Solution RDC",
  },
  description: site.description,
  keywords: [
    "énergie solaire RDC",
    "installation solaire Congo",
    "panneaux solaires Kinshasa",
    "électricité industrielle RDC",
    "backup batteries lithium",
    "Tech Solution RDC",
    "énergie Bunia Goma Butembo",
    "installateur solaire certifié RDC",
  ],
  openGraph: {
    type: "website",
    locale: "fr_CD",
    url: site.url,
    siteName: site.name,
    title:
      "Tech Solution RDC — Énergie solaire, électricité & infrastructures techniques",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Solution RDC",
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
  themeColor: "#0B192C",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
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
  areaServed: {
    "@type": "Country",
    name: "République Démocratique du Congo",
  },
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
          className="sr-only z-[100] rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
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
