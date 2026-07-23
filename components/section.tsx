import * as React from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion";

export function Section({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("py-20 md:py-28", className)} {...props}>
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  onDark = false,
  className,
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em]",
        onDark ? "text-solar-500" : "text-solar-700",
        className,
      )}
    >
      <span
        className={cn(
          "h-[3px] w-8 rounded-full",
          onDark ? "bg-solar-500" : "bg-solar-500",
        )}
      />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  onDark = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow
          onDark={onDark}
          className={cn(align === "center" && "justify-center")}
        >
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2
        className={cn(
          "mt-4 text-3xl font-bold leading-[1.12] md:text-4xl",
          onDark ? "text-white" : "text-slate-900",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            onDark ? "text-navy-100/80" : "text-slate-600",
          )}
        >
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}
