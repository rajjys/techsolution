import { clients } from "@/lib/data/clients";
import { cn } from "@/lib/utils";

/**
 * Bandeau défilant des clients & références (pause au survol).
 * Liste dupliquée pour une boucle parfaitement continue.
 */
export function ClientMarquee({ className }: { className?: string }) {
  const items = [...clients, ...clients];

  return (
    <div
      className={cn("marquee-track mask-fade-x overflow-hidden", className)}
      aria-label="Nos clients et références"
    >
      <div className="flex w-max animate-marquee items-center gap-4 pr-4">
        {items.map((client, index) => (
          <div
            key={`${client.shortName}-${index}`}
            aria-hidden={index >= clients.length}
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-2 pl-2.5 pr-6 shadow-card"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-950 font-display text-[11px] font-bold text-solar-500">
              {client.monogram}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="whitespace-nowrap text-sm font-semibold text-slate-800">
                {client.shortName}
              </span>
              <span className="whitespace-nowrap text-[11px] text-slate-500">
                {client.sector}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
