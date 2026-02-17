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
  summary: SITE.description,
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
