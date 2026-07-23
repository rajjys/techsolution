import { CountUp, Stagger, StaggerItem } from "@/components/motion";
import { metrics } from "@/lib/site";

/** Bande d'impact — compteurs animés sur fond navy. */
export function Metrics() {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-solar-500 to-transparent"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-grid-navy" aria-hidden="true" />
      <div
        className="absolute -left-32 top-1/2 size-[360px] -translate-y-1/2 rounded-full bg-solar-500/10 blur-3xl"
        aria-hidden="true"
      />

      <Stagger className="container relative grid grid-cols-2 gap-x-6 gap-y-10 py-16 md:py-20 lg:grid-cols-4">
        {metrics.map((metric) => (
          <StaggerItem key={metric.label} className="text-center lg:text-left">
            <p className="font-display text-4xl font-bold text-white md:text-5xl">
              <CountUp value={metric.value} suffix={metric.suffix} />
            </p>
            <p className="mt-2 font-display text-sm font-semibold uppercase tracking-wide text-solar-500">
              {metric.label}
            </p>
            <p className="mx-auto mt-1.5 max-w-[220px] text-xs leading-relaxed text-navy-200 lg:mx-0">
              {metric.detail}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
