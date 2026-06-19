import {
  type BrandIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/icons/brand";

export const SITE = {
  version: "1.13.1", // x-release-please-version
  url: "https://hakkaofdev.fr",
  repositoryUrl: "https://github.com/hakkaofdev/hakkaofdev.fr",
  title: "Alexandre Gossard | Digital Nomad & Software Engineer",
  name: "Alexandre Gossard",
  handle: "hakkaofdev",
  email: "alexandre.gossard.pro@gmail.com",
  location: "Châlons-en-Champagne, France",
  description:
    "Digital nomad & Software Engineer building performant web & mobile apps with React, Next.js, React Native & Expo. Shipping from anywhere.",
  jobTitle: "Software Engineer",
  employer: {
    name: "Alexandre Gossard",
    url: "https://hakkaofdev.fr",
  },
  keywords: [
    "Alexandre Gossard",
    "Digital Nomad",
    "Fullstack Developer",
    "Software Engineer",
    "Open-source",
    "hakkaofdev",
    "Kabila",
    "Freelance",
    "Hedera Hashgraph",
    "Blockchain",
  ],
} as const;

export const GITHUB_URL = "https://github.com/hakkaofdev";

export const SOCIALS: { name: string; url: string; icon: BrandIcon }[] = [
  {
    name: "GitHub",
    url: GITHUB_URL,
    icon: GithubIcon,
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/hakkaofdev",
    icon: LinkedinIcon,
  },
  {
    name: "Instagram",
    url: "https://instagram.com/hakkaofdev",
    icon: InstagramIcon,
  },
  {
    name: "Twitter",
    url: "https://x.com/hakkaofdev",
    icon: TwitterIcon,
  },
];
