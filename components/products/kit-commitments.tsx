import { Glow } from "@/components/glow";
import { Stagger, StaggerItem } from "@/components/motion";
import { Section, SectionHeading } from "@/components/section";
import { kitCommitments } from "@/lib/data/kits";
import { cn } from "@/lib/utils";

/**
 * « Compris dans chaque kit » — les quatre engagements qui valent pour toute
 * la gamme. Même grammaire que « Ce que nous offrons » : quatre colonnes
 * séparées par des filets, pictogramme sur pastille blanche.
 *
 * Sorti de /produits pour servir aussi à la gamme et à chaque fiche : la
 * promesse ne change pas d'un kit à l'autre, sa formulation non plus.
 */
export function KitCommitments({
  className,
  children,
}: {
  className?: string;
  /** Bloc posé sous les engagements — le « hors catalogue » de la gamme. */
  children?: React.ReactNode;
}) {
  return (
    <Section className={cn("relative isolate bg-surface-cool", className)}>
      <Glow variant="cool" corner="bottom-left" />
      <div className="container relative">
        <SectionHeading
          align="center"
          eyebrow="Compris dans chaque kit"
          title="Le prix d'un kit n'est pas celui d'un carton."
        />

        <Stagger className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:mt-16 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-slate-300/70">
          {kitCommitments.map((item) => (
            <StaggerItem key={item.title} className="lg:px-6">
              <div className="flex flex-col items-center text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-card sm:size-16">
                  <item.icon
                    className="size-7 text-brand-600 sm:size-8"
                    strokeWidth={1.5}
                  />
                </span>
                <h3 className="mt-5 text-base font-bold text-slate-900 lg:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[17rem] text-sm leading-relaxed text-slate-600">
                  {item.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {children}
      </div>
    </Section>
  );
}
