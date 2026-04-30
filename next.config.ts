import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

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

export default withNextIntl(nextConfig);
