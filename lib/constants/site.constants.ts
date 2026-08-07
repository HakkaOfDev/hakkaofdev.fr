import {
  type BrandIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/icons/brand";

export const SITE = {
  version: "1.16.0", // x-release-please-version
  url: "https://hakkaofdev.fr",
  repositoryUrl: "https://github.com/hakkaofdev/hakkaofdev.fr",
  title: "Alexandre Gossard | Product Engineer & Digital Nomad",
  name: "Alexandre Gossard",
  handle: "hakkaofdev",
  email: "alexandre.gossard.pro@gmail.com",
  location: "Châlons-en-Champagne, France",
  description:
    "Product Engineer & digital nomad building web & mobile products end-to-end with React, Next.js, React Native & Expo. Shipping from anywhere.",
  jobTitle: "Product Engineer",
  employer: {
    name: "Alexandre Gossard",
    url: "https://hakkaofdev.fr",
  },
  keywords: [
    "Alexandre Gossard",
    "Product Engineer",
    "Digital Nomad",
    "React",
    "Next.js",
    "React Native",
    "TypeScript",
    "Web3",
    "hakkaofdev",
    "Kabila",
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
