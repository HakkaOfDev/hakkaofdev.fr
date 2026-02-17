import {
  Github,
  Instagram,
  Linkedin,
  type LucideIcon,
  Twitter,
} from "lucide-react";

export const SITE = {
  url: "https://hakkaofdev.fr",
  title: "Alexandre Gossard | Digital Nomad & Software Engineer",
  name: "Alexandre Gossard",
  handle: "hakkaofdev",
  description:
    "Digital nomad & Software Engineer @kabila.app. Open-source enthusiast crafting performant web experiences with React and Next.js.",
  jobTitle: "Software Engineer",
  employer: {
    name: "kabila.app",
    url: "https://kabila.app",
  },
  keywords: [
    "Alexandre Gossard",
    "Frontend Developer",
    "Digital Nomad",
    "Open-source",
    "Modern Technologies",
    "hakkaofdev",
    "kabila.app",
    "Kabila",
    "Software Engineer",
    "Freelance",
  ],
} as const;

export const GITHUB_URL = "https://github.com/hakkaofdev";

export const SOCIALS: { name: string; url: string; icon: LucideIcon }[] = [
  {
    name: "GitHub",
    url: GITHUB_URL,
    icon: Github,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/hakkaofdev/",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/hakkaofdev/",
    icon: Instagram,
  },
  {
    name: "Twitter",
    url: "https://x.com/hakkaofdev",
    icon: Twitter,
  },
];

// Commands/Spotify commands were moved to:
// - components/commands/registry.tsx
// - components/commands/spotify-registry.tsx

export const PROJECTS = [
  {
    name: "Kabila App",
    description:
      "A Web3 social platform and NFT ecosystem built on Hedera, featuring an NFT marketplace, community plazas, launchpads and creator tools.",
    url: "https://kabila.app",
    imageUrl: "/projects/kabila-app.png",
    tags: [
      "Next.js",
      "Tailwind",
      "Typescript",
      "Blockchain",
      "Marketplace",
      "Web3 Social",
    ],
  },
  {
    name: "Kabila Tools",
    description:
      "An all-in-one NFT toolkit for creators and communities on Hedera. A powerful and easy-to-use platform to create, launch, and manage your NFT collections while being in total control.",
    url: "https://tools.kabila.app",
    imageUrl: "/projects/kabila-tools.png",
    tags: ["Next.js", "Tailwind", "Typescript", "Blockchain"],
  },
  {
    name: "Kabila Wallet",
    description:
      "A non-custodial, simple, and secure wallet for the Hedera network. Manage your accounts, tokens, NFTs, and connect with DApps while maintaining full control of your assets.",
    url: "https://www.kabila.app/docs/kabila-wallet",
    imageUrl: "/projects/kabila-wallet.webp",
    tags: ["Next.js", "Tailwind", "Javascript", "Blockchain"],
  },
  {
    name: "Ferreira Borges Thomas",
    description:
      "A professional website for an automotive repair business, featuring services, transparent pricing and contact information.",
    url: "https://www.thomas-ferreira.fr",
    imageUrl: "/projects/fbt-auto-repair.png",
    tags: ["Next.js", "Tailwind", "Typescript", "Freelance"],
  },
  {
    name: "Brian Grav&Style",
    description: "An e-commerce website for an engraving company.",
    url: "https://brian-gravure.vercel.app",
    imageUrl: "/projects/brian-gravure.png",
    tags: ["Next.js", "Tailwind", "Typescript", "E-commerce"],
  },
  {
    name: "Portfolio V1",
    description:
      "My previous portfolio website built with Next.js and Chakra UI, featuring a dark theme and smooth animations.",
    url: "https://hakkaofdev-portfolio-v1.vercel.app",
    imageUrl: "/projects/old-portfolio.png",
    tags: ["Next.js", "Chakra UI", "Typescript", "Open-source"],
  },
  {
    name: "ts-next-chakra-motion-kit",
    description:
      "Discover a starter kit which includes Next.js, Chakra-UI, Framer-Motion in Typescript. You have few components, Internationalization, SEO and more in this template.",
    url: "https://ts-next-chakra-motion-kit.vercel.app",
    imageUrl: "/projects/ts-next-chakra-motion-kit.png",
    tags: ["Next.js", "Chakra UI", "Typescript", "Template", "Open-source"],
  },
  {
    name: "AC-Vision",
    description: "DASAN OLT/ONUs Supervision tool [Opensource].",
    url: "https://github.com/hakkaofdev/ac-vision",
    imageUrl: "/projects/ac-vision.png",
    tags: ["Next.js", "Python", "Typescript", "Redis", "Docker", "Open-source"],
  },
  {
    name: "RT'ransport",
    description:
      "A Percel Platform created for the project of my first year in DUT Networks & Telecoms (two-year university degree).",
    url: "https://github.com/HakkaOfDev/RT-ransport",
    imageUrl: "/projects/rt-ransport.png",
    tags: ["Python", "Flask", "Tailwind", "Open-source"],
  },
];

export const SKILLS = {
  languages: ["Javascript", "Typescript", "Python"],
  frameworks: [
    "Next.js",
    "Vue.js",
    "React",
    "React Native",
    "Expo",
    "Flask",
    "Django",
  ],
  styling: ["Tailwind", "shadcn/ui", "Motion"],
  devtools: ["Biome", "Bun"],
  databases: ["PostgreSQL", "Supabase", "MongoDB", "Redis"],
  hosting: ["Vercel", "AWS"],
  workflow: ["Git", "Gitlab"],
  orm: ["Prisma"],
  devops: ["Docker", "k8s"],
  automation: ["n8n", "openclaw"],
  ai: ["Codex", "Claude"],
};

export const EDUCATION = [
  {
    period: "2022-2023",
    name: "System Administration and Security (vocational degree)",
    location: "IUT Châlons (Châlons-en-Champagne, France)",
  },
  {
    period: "2020-2022",
    name: "DUT Networks and Telecommunications (technical degree)",
    location: "IUT Châlons (Châlons-en-Champagne, France)",
    descriptions: ["Salutatorian"],
  },
  {
    period: "2019-2020",
    name: "Scientific Baccalaureate (A level equivalent)",
    location: "Lycée Jean Talon (Châlons-en-Champagne, France)",
    descriptions: [
      "Specialised in ISN (Computer and digital sicences)",
      "With distinctions",
    ],
  },
];

export const EXPERIENCES = [
  {
    period: "Since July 2022",
    name: "Software Engineer",
    company: "kabila.app",
    location: "Madrid, Spain",
    descriptions: [
      "Leading a team to deliver high-quality web applications",
      "Implementing modern frontend architecture and best practices",
      "Managing technical roadmap and sprint planning",
      "Mentoring junior developers and conducting code reviews",
      "Building reusable component libraries and design systems",
      "Creating mobile apps with React Native and Expo",
    ],
  },
  {
    period: "Since July 2022",
    name: "Freelance",
    company: "Alexandre GOSSARD",
    location: "Châlons-en-Champagne, France",
    descriptions: [
      "Developed full-stack web applications using React and Next.js",
      "Built cross-platform mobile apps with React Native and Expo",
      "Implemented CI/CD pipelines and automated deployment workflows",
      "Provided technical consulting and architecture recommendations",
      "Managed client relationships and project timelines independently",
      "Delivering mobile apps for clients on the Google Play Store and Apple App Store",
    ],
  },
  {
    period: "September 2022 - August 2023",
    name: "Apprenticeship",
    company: "Arche MC2",
    location: "Châlons-en-Champagne, France",
    descriptions: [
      "Implemented GitLab CI/CD pipelines for automated testing and deployment",
      "Managed Docker containerization of applications and services",
      "Automated system administration tasks using shell scripts",
      "Monitored system health and implemented scalable solutions",
    ],
  },
];

export const LANGUAGES = [
  {
    lang: "French",
    level: "Native",
  },
  {
    lang: "English",
    level: "C1",
  },
  {
    lang: "Spanish",
    level: "A2",
  },
];

export const HOBBIES = [
  "Motorcycles",
  "Cars",
  "Weightlifting",
  "Traveling",
  "Manga",
  "Gaming",
];
