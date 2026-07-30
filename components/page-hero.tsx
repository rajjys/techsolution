import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/section";

/** Bandeau d'en-tête navy des pages intérieures. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-grid-navy" aria-hidden="true" />
      <div
        className="absolute -right-32 -top-40 size-[440px] rounded-full bg-solar-500/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-44 -left-32 size-[400px] rounded-full bg-navy-600/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative py-12 sm:py-16 md:py-24">
        <Reveal mode="mount" className="max-w-3xl">
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h1 className="mt-4 text-[30px] font-bold leading-[1.15] text-white sm:text-4xl sm:leading-[1.1] md:text-5xl">
            {title}
          </h1>
          {lead ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-100/85 sm:text-lg">
              {lead}
            </p>
          ) : null}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
