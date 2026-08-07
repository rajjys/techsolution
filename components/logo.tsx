import Image from "next/image";

import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Logo officiel TECH SOLUTION (public/assets).
 * - `nav`  : marque + wordmark empilé avec tagline sous le wordmark
 *            (lockup compact recomposé pour les barres de navigation)
 * - `full` : lockup complet original avec tagline (pied de page, usages larges)
 */
export function Logo({
  onDark = false,
  variant = "nav",
  className,
}: {
  onDark?: boolean;
  variant?: "nav" | "full";
  className?: string;
}) {
  const src =
    variant === "full"
      ? onDark
        ? "/assets/logo-full-white.png"
        : "/assets/logo-full-blue.png"
      : onDark
        ? "/assets/logo-nav-white.png"
        : "/assets/logo-nav-blue.png";

  const dims =
    variant === "full"
      ? { width: 3058, height: 1310 }
      : { width: 2924, height: 832 };

  return (
    <Image
      src={src}
      alt={`${site.name} — ${site.tagline}`}
      width={dims.width}
      height={dims.height}
      priority
      className={cn(
        variant === "full" ? "h-20 w-auto" : "h-11 w-auto lg:h-12",
        className,
      )}
    />
  );
}
