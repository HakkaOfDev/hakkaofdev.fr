import { SITE } from "./site.constants";

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
    company: "Kabila",
    companyUrl: "https://kabila.app",
    location: "Madrid, Spain",
    descriptions: [
      "Lead a frontend team building production web apps with React and Next.js",
      "Own the technical roadmap, sprint planning, and architecture decisions",
      "Mentor junior developers and run code reviews",
      "Build and maintain the shared component library and internal design system",
      "Ship companion mobile apps with React Native and Expo",
    ],
  },
  {
    period: "Since July 2022",
    name: "Freelance",
    company: "Alexandre GOSSARD",
    companyUrl: SITE.url,
    location: "Châlons-en-Champagne, France",
    descriptions: [
      "Build full-stack web apps with React and Next.js for direct clients",
      "Ship cross-platform mobile apps to the App Store and Google Play",
      "Set up CI/CD pipelines and automated deployment workflows",
      "Advise on architecture, tech choices, and project scoping",
      "Handle client communication and delivery timelines on every project",
    ],
  },
  {
    period: "September 2022 - August 2023",
    name: "Apprenticeship",
    company: "Arche MC2",
    companyUrl: "https://arche-mc2.fr",
    location: "Châlons-en-Champagne, France",
    descriptions: [
      "Built GitLab CI/CD pipelines for automated testing and deployment",
      "Containerized internal applications and services with Docker",
      "Automated routine sysadmin tasks with shell scripts",
      "Monitored system health and improved infrastructure resilience",
    ],
  },
];

export const LANGUAGES = [
  {
    lang: "🇫🇷 French",
    level: "Native",
  },
  {
    lang: "🇬🇧 English",
    level: "C1",
  },
  {
    lang: "🇷🇺 Russian",
    level: "A2",
  },
  {
    lang: "🇪🇸 Spanish",
    level: "A2",
  },
];

export const HOBBIES = [
  "Motorcycles",
  "Cars",
  "Weightlifting",
  "Calisthenics",
  "Traveling",
  "Manga",
  "Gaming",
];
