import { findZone } from "@/lib/data/locations";
import { zoneHref } from "@/lib/routes";
import { site, type Office } from "@/lib/site";

/**
 * Balisage `LocalBusiness` d'un bureau — **une seule source** pour /contact
 * et la page de la ville.
 *
 * Même `@id` partout (la page de la ville, `#bureau`) : deux balisages du
 * même bureau sous deux identifiants feraient deux entités pour Google. Même
 * `name` que la fiche Google — « Tech Solution RDC », sans la ville : c'est
 * l'adresse qui distingue Bunia de Kinshasa, pas le nom (règle des fiches
 * d'établissement, docs/SEO-STRATEGY.md §16).
 */
export function officeId(office: Office): string {
  return `${site.url}${zoneHref(office.city.toLowerCase())}#bureau`;
}

export function officeJsonLd(office: Office) {
  const zone = findZone(office.city.toLowerCase());
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": officeId(office),
    name: site.name,
    description: `${office.role} de ${site.name} à ${office.city}.`,
    parentOrganization: { "@type": "Organization", name: site.legalName, url: site.url },
    url: `${site.url}${zoneHref(office.city.toLowerCase())}`,
    image: zone ? `${site.url}${zone.image}` : `${site.url}/assets/logo-full-blue.png`,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: office.street,
      addressLocality: office.city,
      addressRegion: office.region,
      addressCountry: "CD",
    },
    ...(zone
      ? { geo: { "@type": "GeoCoordinates", latitude: zone.lat, longitude: zone.lon } }
      : {}),
    /* Heure locale de chaque bureau — schema.org n'a pas de fuseau ici. */
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "17:00",
    },
    areaServed: { "@type": "Country", name: "République Démocratique du Congo" },
  };
}
