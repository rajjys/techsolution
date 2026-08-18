import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/produits",
    "/references",
    "/contact",
    "/about",
    "/confidentialite",
  ];

  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/contact"
          ? 0.9
          : route === "/confidentialite"
            ? 0.3
            : 0.8,
  }));
}
