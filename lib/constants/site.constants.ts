import {
  type BrandIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/icons/brand";

export const SITE = {
  version: "1.10.0", // x-release-please-version
  url: "https://hakkaofdev.fr",
  repositoryUrl: "https://github.com/hakkaofdev/hakkaofdev.fr",
  title: "Alexandre Gossard | Digital Nomad & Software Engineer",
  name: "Alexandre Gossard",
  handle: "hakkaofdev",
  email: "alexandre.gossard.pro@gmail.com",
  location: "Châlons-en-Champagne, France",
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
