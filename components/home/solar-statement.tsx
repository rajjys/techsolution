import { Reveal } from "@/components/motion";

/**
 * Bandeau éditorial — respiration typographique entre les réalisations
 * (bande navy) et le catalogue de kits (bande blanche).
 *
 * ⚠️ À CONFIRMER : le chiffre « plus de 5 kWh par m² et par jour » correspond
 * à l'irradiation moyenne généralement citée pour la RDC, mais il n'est pas
 * issu de la farde de l'entreprise. À sourcer (ou à ajuster) avant mise en
 * production.
 */
export function SolarStatement() {
  return (
    <section
      aria-labelledby="solar-statement"
      className="relative isolate bg-[#FAF8F5] px-6 py-24 sm:py-28 lg:px-16 lg:py-40"
    >
      {/* Halo chaud pleine largeur — très discret, pour la profondeur */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70rem_36rem_at_20%_0%,rgba(217,119,6,0.07),transparent_65%)]"
        aria-hidden="true"
      />

      <Reveal className="mx-auto max-w-5xl">
        <figure>
          <p
            id="solar-statement"
            className="text-balance text-[28px] font-medium leading-[1.15] tracking-tight text-[#0B192C] sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[72px]"
          >
            Chaque jour en RDC, le soleil fournit{" "}
            <span className="box-decoration-clone bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#9A3412] bg-clip-text text-transparent">
              plus de 5 kWh par mètre carré
            </span>
            . L&apos;énergie est déjà là — il ne manque que l&apos;ingénierie
            pour sécuriser vos activités.
          </p>

          <figcaption className="mt-10 text-sm font-medium uppercase tracking-wider text-slate-500 lg:mt-14 lg:text-base">
            — Tech Solution RDC • Ingénierie &amp; Autonomie Énergétique
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
