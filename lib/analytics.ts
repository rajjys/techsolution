/**
 * Envoi d'événements à GA4 (`@next/third-parties/google`, cf. app/layout.tsx).
 *
 * GA4 mesurait jusqu'ici les vues de page et rien d'autre. Sur /contact, cela
 * ne dit rien : l'entonnoir ne change jamais d'URL, et son `<form>` n'apparaît
 * qu'au dernier écran — la mesure automatique se déclenchait donc **après**
 * toute la partie où l'on perd les visiteurs. On ne savait ni combien
 * commençaient, ni où ils s'arrêtaient.
 *
 * Les noms d'événements sont en français, comme le reste du code, et préfixés
 * `devis_` pour se regrouper d'eux-mêmes dans l'interface GA4.
 *
 * L'événement est déposé dans `dataLayer`, pas passé à `window.gtag` : le
 * script GA4 se charge en différé, et l'événement d'ouverture — le
 * dénominateur de tout l'entonnoir — partait avant lui et se perdait. La file
 * `dataLayer`, elle, existe avant le script et il la vide à son arrivée.
 *
 * Le tir est silencieux par construction : sans réseau, sans consentement ou
 * avec un bloqueur, la file n'est simplement jamais lue. Aucune mesure ne doit
 * jamais empêcher un envoi de formulaire.
 */
type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(name: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    const clean: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        clean[key] = value;
      }
    }
    window.dataLayer = window.dataLayer ?? [];
    /* gtag.js attend un objet de type `arguments`, pas un tableau littéral. */
    (function pushArguments(this: void, ...args: unknown[]) {
      void args;
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    })("event", name, clean);
  } catch {
    /* La mesure ne fait jamais échouer le parcours. */
  }
}
