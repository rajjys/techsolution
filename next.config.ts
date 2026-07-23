import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    qualities: [60, 75, 85, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
