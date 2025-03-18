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
    command: "clear",
    description: "Clear all previous commands and output from the terminal",
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
    command: "spotify",
    description: "Display the help for the spotify commands",
  },
];

export const SPOTIFY_COMMANDS = [
  {
    command: "now",
    description: "Display the currently playing song",
  },
  {
    command: "top",
    description: "Display my top tracks",
  },
  {
    command: "history",
    description: "Display my listening history",
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
    period: "Since April 2025",
    name: "Lead Frontend Developer",
    company: "kabila.app",
    location: "Madrid, Spain",
    descriptions: [
      "Leading a team to deliver high-quality web applications",
      "Implementing modern frontend architecture and best practices",
      "Managing technical roadmap and sprint planning",
      "Mentoring junior developers and conducting code reviews",
      "Building reusable component libraries and design systems",
    ],
  },
  {
    period: "July 2022 - April 2025",
    name: "Freelance",
    company: "Alexandre GOSSARD",
    location: "Châlons-en-Champagne, France",
    descriptions: [
      "Developed full-stack web applications using React and Next.js",
      "Built cross-platform mobile apps with React Native and Expo",
      "Implemented CI/CD pipelines and automated deployment workflows",
      "Provided technical consulting and architecture recommendations",
      "Managed client relationships and project timelines independently",
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

export const HOBBIES = ["Traveling", "Musculation", "Gaming"];
