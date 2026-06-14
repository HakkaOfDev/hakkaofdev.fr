export type ProjectEntry = {
  /** Key under `CV.projects.{slug}` for translated `name` and `description`. */
  slug: string;
  url?: string;
  imageUrl: string;
  tags: string[];
};

export const PROJECTS: ReadonlyArray<ProjectEntry> = [
  {
    slug: "bravalta",
    url: "https://bravalta.com",
    imageUrl: "/projects/bravalta.png",
    tags: ["Astro", "React", "Tailwind", "Typescript"],
  },
  {
    slug: "kabilaApp",
    url: "https://kabila.app",
    imageUrl: "/projects/kabila-app.png",
    tags: ["Next.js", "Tailwind", "Typescript", "Blockchain", "Marketplace"],
  },
  {
    slug: "kabilaTools",
    url: "https://tools.kabila.app",
    imageUrl: "/projects/kabila-tools.png",
    tags: ["Next.js", "Tailwind", "Typescript", "Blockchain"],
  },
  {
    slug: "kabilaWallet",
    url: "https://wallet.kabila.app",
    imageUrl: "/projects/kabila-wallet.webp",
    tags: ["Vite", "React", "Tailwind", "Javascript", "Blockchain"],
  },
  {
    slug: "ferreiraBorges",
    url: "https://thomas-ferreira.fr",
    imageUrl: "/projects/fbt-auto-repair.png",
    tags: ["Next.js", "Tailwind", "Typescript", "Freelance"],
  },
  {
    slug: "acVision",
    url: "https://github.com/hakkaofdev/ac-vision",
    imageUrl: "/projects/ac-vision.png",
    tags: ["Next.js", "Python", "Typescript", "Redis", "Docker", "Open-source"],
  },
  {
    slug: "brianGravure",
    imageUrl: "/projects/brian-gravure.png",
    tags: ["Next.js", "Tailwind", "Typescript", "E-commerce"],
  },
  {
    slug: "portfolioV1",
    url: "https://hakkaofdev-portfolio-v1.vercel.app",
    imageUrl: "/projects/old-portfolio.png",
    tags: ["Next.js", "Chakra UI", "Typescript", "Open-source"],
  },
  {
    slug: "tsNextKit",
    url: "https://ts-next-chakra-motion-kit.vercel.app",
    imageUrl: "/projects/ts-next-chakra-motion-kit.png",
    tags: ["Next.js", "Chakra UI", "Typescript", "Template", "Open-source"],
  },
  {
    slug: "rtransport",
    url: "https://github.com/HakkaOfDev/RT-ransport",
    imageUrl: "/projects/rt-ransport.png",
    tags: ["Python", "Flask", "Tailwind", "Open-source"],
  },
];
