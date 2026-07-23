import { cn } from "@/lib/utils";

export function LogoIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 shadow-sm ring-1 ring-navy-950/10",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[56%]"
        fill="#FFB800"
        stroke="#FFB800"
        strokeWidth="0.8"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M13.2 2.2 3.6 13.6c-.3.35-.05.9.4.9h6l-1.2 7.1c-.08.5.55.78.87.38l9.6-11.4c.3-.35.05-.9-.4-.9h-6l1.2-7.1c.08-.5-.55-.78-.87-.38z" />
      </svg>
      <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-solar-500" />
    </span>
  );
}

export function Logo({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoIcon className="size-10" />
      <span className="flex flex-col justify-center gap-1 leading-none">
        <span
          className={cn(
            "font-display text-[17px] font-bold tracking-tight",
            onDark ? "text-white" : "text-navy-950",
          )}
        >
          TECH&nbsp;SOLUTION
        </span>
        <span
          className={cn(
            "text-[9.5px] font-semibold uppercase tracking-[0.16em]",
            onDark ? "text-solar-500" : "text-solar-700",
          )}
        >
          La révolution énergétique
        </span>
      </span>
    </span>
  );
}
