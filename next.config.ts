import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
  images: {
    qualities: [75],
    formats: ["image/webp"],
    remotePatterns: [
      {
        hostname: "i.scdn.co",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
