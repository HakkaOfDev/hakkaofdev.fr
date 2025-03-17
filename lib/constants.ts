import { DynamicIcon } from "lucide-react/dynamic";
import { ComponentProps } from "react";

export const SOCIALS: {
  name: string;
  url: string;
  icon: ComponentProps<typeof DynamicIcon>["name"];
}[] = [
  {
    name: "GitHub",
    url: "https://github.com/hakkaofdev",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/hakkaofdev/",
    icon: "linkedin",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/hakkaofdev/",
    icon: "instagram",
  },
  {
    name: "Twitter",
    url: "https://x.com/hakkaofdev",
    icon: "twitter",
  },
];

export const COMMANDS = [
  {
    command: "welcome",
    description: "Display a welcome message and introduction",
  },
  {
    command: "help",
    description: "Display a list of available commands and their descriptions",
  },
  {
    command: "projects",
    description:
      "Browse through my portfolio of personal and professional projects",
  },
  {
    command: "skills",
    description: "View my technical skills, tools and technologies I work with",
  },
  {
    command: "about",
    description: "Learn more about my background, interests and career goals",
  },
  {
    command: "education",
    description: "See my academic background and qualifications",
  },
  {
    command: "experiences",
    description: "Explore my professional work history and accomplishments",
  },
  {
    command: "clear",
    description: "Clear all previous commands and output from the terminal",
  },
];

export const PROJECTS = [
  {
    name: "Kabila Wallet",
    description:
      "A secure and easy-to-use wallet for managing your crypto assets on Hedera Blockchain.",
    url: "https://www.kabila.app/wallet",
    imageUrl: "/projects/kabila-wallet.png",
    tags: ["Next.js", "Tailwind", "Typescript", "Blockchain"],
  },
  {
    name: "Kabila Marketplace",
    description:
      "An NFT Marketplace built on Hedera where users can access the best NFT launches.",
    url: "https://market.kabila.app",
    imageUrl: "/projects/kabila-marketplace.webp",
    tags: ["Next.js", "Tailwind", "Typescript", "Blockchain"],
  },
  {
    name: "Kabila Plazas",
    description:
      "A social media platform built on Hedera where users can create and manage their own communities.",
    url: "https://plazas.social",
    imageUrl: "/projects/kabila-plazas.avif",
    tags: ["Next.js", "Tailwind", "Typescript", "Blockchain"],
  },
  {
    name: "Kabila Tools",
    description:
      "A place where community builders can find tools to help them build NFTs, collections and more.",
    url: "https://tools.kabila.app",
    imageUrl: "/projects/kabila-tools.avif",
    tags: ["Next.js", "Tailwind", "Typescript", "Blockchain"],
  },
  {
    name: "Kabila Token App",
    description:
      "The token app made for the $KBL token, you can stake, unstake, claim daily rewards and more.",
    url: "https://token.kabila.app",
    imageUrl: "/projects/kabila-token.png",
    tags: ["Next.js", "Tailwind", "Typescript", "Blockchain"],
  },
  {
    name: "ts-next-chakra-motion-kit",
    description:
      "Discover a starter kit which includes Next.js, Chakra-UI, Framer-Motion in Typescript. You have few components, Internationalization, SEO and more in this template.",
    url: "https://ts-next-chakra-motion-kit.vercel.app/",
    imageUrl: "/projects/ts-next-chakra-motion-kit.png",
    tags: ["Next.js", "Chakra UI", "Typescript", "Template", "Open-source"],
  },
  {
    name: "HakkaOfDev's API",
    description: "A simple API for my global stats (spotify/development time).",
    url: "https://api.hakkaofdev.fr/",
    imageUrl: "/projects/hakkaofdev-api.png",
    tags: ["Next.js", "Chakra UI", "Typescript", "Open-source"],
  },
  {
    name: "AC-Vision",
    description: "DASAN OLT/ONUs Supervision tool [Opensource].",
    url: "https://github.com/hakkaofdev/ac-vision",
    imageUrl: "/projects/ac-vision.png",
    tags: ["Next.js", "Python", "Typescript", "Redis", "Docker", "Open-source"],
  },
  {
    name: "Flonoa Homepage",
    description: "Florine Leroy website. Graphic designer.",
    url: "https://github.com/hakkaofdev/flonoa-homepage",
    imageUrl: "/projects/flonoa.png",
    tags: ["Next.js", "Chakra UI", "Javascript", "Open-source"],
  },
  {
    name: "RT'ransport",
    description:
      "A Percel Platform created for the project of my first year in DUT Networks & Telecoms (two-year university degree).",
    url: "https://github.com/HakkaOfDev/RT-ransport",
    imageUrl: "/projects/rt-ransport.png",
    tags: ["Python", "Flask", "Tailwind", "Open-source"],
  },
  {
    name: "hakkaofdev.me",
    description:
      "My first opensource portfolio made with React and my own CSS framework.",
    url: "https://github.com/HakkaOfDev/hakkaofdev.me",
    imageUrl: "/projects/hakkaofdev-me.png",
    tags: ["React", "Typescript", "Open-source"],
  },
];

export const SKILLS = {
  languages: ["Javascript", "Typescript", "Python"],
  frameworks: ["Next.js", "Vue.js", "React", "React Native", "Flask"],
  tools: ["Tailwind", "Chakra UI", "Framer Motion", "Docker", "Redis"],
  databases: ["PostgreSQL", "MySQL", "MongoDB"],
  hosting: ["Vercel", "AWS"],
  workflow: ["Git", "Gitlab"],
};
