export type ProjectEntry = {
  /** Key under `CV.projects.{slug}` for translated `name` and `description`. */
  slug: string;
  url?: string;
  imageUrl: string;
  /** Tailwind `object-position` class for the card image (defaults to center). */
  imagePosition?: string;
  tags: string[];
};

export const PROJECTS: ReadonlyArray<ProjectEntry> = [
  {
    slug: "bravalta",
    url: "https://bravalta.com",
    imageUrl: "/projects/bravalta.png",
    tags: ["Astro", "Tailwind", "TypeScript"],
  },
  {
    slug: "kabilaApp",
    url: "https://kabila.app",
    imageUrl: "/projects/kabila-app.png",
    tags: ["Next.js", "Tailwind", "TypeScript", "Blockchain", "Marketplace"],
  },
  {
    slug: "kabilaWalletNative",
    url: "https://wallet.kabila.app",
    imageUrl: "/projects/kabila-wallet-native.png",
    imagePosition: "object-bottom",
    tags: ["Expo", "React Native", "TypeScript", "Blockchain", "Tailwind"],
  },
  {
    slug: "kabilaTools",
    url: "https://tools.kabila.app",
    imageUrl: "/projects/kabila-tools.png",
    tags: ["Next.js", "Tailwind", "TypeScript", "Blockchain"],
  },
  {
    slug: "kabilaWallet",
    url: "https://wallet.kabila.app",
    imageUrl: "/projects/kabila-wallet.webp",
    imagePosition: "object-bottom",
    tags: [
      "Vite",
      "React",
      "Capacitor",
      "Tailwind",
      "JavaScript",
      "Blockchain",
    ],
  },
  {
    slug: "ferreiraBorges",
    url: "https://thomas-ferreira.fr",
    imageUrl: "/projects/fbt-auto-repair.png",
    tags: ["Next.js", "Tailwind", "TypeScript", "Freelance"],
  },
  {
    slug: "acVision",
    url: "https://github.com/hakkaofdev/ac-vision",
    imageUrl: "/projects/ac-vision.png",
    tags: ["Next.js", "Python", "TypeScript", "Redis", "Docker", "Open-source"],
  },
  {
    slug: "brianGravure",
    imageUrl: "/projects/brian-gravure.png",
    tags: ["Next.js", "Tailwind", "TypeScript", "E-commerce"],
  },
  {
    slug: "portfolioV1",
    url: "https://hakkaofdev-portfolio-v1.vercel.app",
    imageUrl: "/projects/old-portfolio.png",
    tags: ["Next.js", "Chakra UI", "TypeScript", "Open-source"],
  },
  {
    slug: "tsNextKit",
    url: "https://ts-next-chakra-motion-kit.vercel.app",
    imageUrl: "/projects/ts-next-chakra-motion-kit.png",
    tags: ["Next.js", "Chakra UI", "TypeScript", "Template", "Open-source"],
  },
  {
    slug: "rtransport",
    url: "https://github.com/HakkaOfDev/RT-ransport",
    imageUrl: "/projects/rt-ransport.png",
    tags: ["Python", "Flask", "Tailwind", "Open-source"],
  },
];
