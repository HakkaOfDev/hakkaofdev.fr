import {
  EDUCATION,
  EXPERIENCES,
  LANGUAGES,
  PROJECTS,
  SITE,
  SKILLS,
  SOCIALS,
} from "@/lib/constants";

function toSkillGroups() {
  return Object.entries(SKILLS)
    .map(([label, values]) => ({ label, values }))
    .filter((group) => group.values.length > 0);
}

export const CV_FILE_NAME = "alexandre-gossard-cv.pdf";
export const CV_PREVIEW_URL = "/api/cv";
export const CV_DOWNLOAD_URL = "/api/cv?download=1";

export const CV_DATA = {
  fileName: CV_FILE_NAME,
  name: SITE.name,
  title: SITE.jobTitle,
  website: SITE.url,
  email: SITE.email,
  location: SITE.location,
  summary:
    "Software Engineer, nearly four years in. I freelance for my own clients, building web and mobile apps that ship to real users on the App Store and Google Play. React, Next.js and React Native are home turf, with a soft spot for clean architecture, quick feedback loops, and the occasional open-source side project. Based in France, working from wherever the laptop fits.",
  socials: SOCIALS.map((social) => ({
    name: social.name,
    url: social.url,
  })),
  projects: PROJECTS.slice(0, 5).map((project) => ({
    name: project.name,
    url: project.url,
    tags: project.tags,
    description: project.description,
  })),
  experiences: EXPERIENCES.map((experience) => ({
    period: experience.period,
    title: experience.name,
    company: experience.company,
    companyUrl: experience.companyUrl,
    location: experience.location,
    descriptions: experience.descriptions ?? [],
  })),
  education: EDUCATION.map((item) => ({
    period: item.period,
    name: item.name,
    location: item.location,
    descriptions: item.descriptions ?? [],
  })),
  skills: toSkillGroups(),
  languages: LANGUAGES.map((l) => ({
    ...l,
    lang: l.lang.substring(4).trim(),
  })),
};
