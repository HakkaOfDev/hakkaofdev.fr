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
