import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * « Ville — Province », sauf quand les deux se confondent : Kinshasa est une
 * ville-province, et « Kinshasa — Kinshasa » se lisait comme une coquille.
 */
export function placeLabel(city: string, province: string): string {
  return city === province ? city : `${city} — ${province}`;
}
