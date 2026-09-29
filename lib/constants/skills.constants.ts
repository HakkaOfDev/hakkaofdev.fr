export type SkillGroup = {
  /** Key under `CV.skillGroups.{slug}` for the translated label. */
  slug: string;
  values: string[];
};

export const SOFT_SKILLS_SLUG = "softSkills";

export const SKILLS: ReadonlyArray<SkillGroup> = [
  {
    slug: "frameworks",
    values: [
      "React",
      "Next.js",
      "React Native",
      "Expo",
      "Vue.js",
      "Astro",
      "Django",
      "Flask",
      "FastAPI",
    ],
  },
  {
    slug: "stateData",
    values: ["TanStack Query", "GraphQL", "Zustand", "Redux", "Zod"],
  },
  {
    slug: "languages",
    values: ["TypeScript", "JavaScript", "Python", "HTML/CSS"],
  },
  { slug: "uiStyling", values: ["Tailwind", "shadcn/ui", "Motion", "Figma"] },
  { slug: "tooling", values: ["Biome", "Bun"] },
  { slug: "testing", values: ["Vitest", "Playwright", "Cypress", "Jest"] },
  {
    slug: "databases",
    values: ["PostgreSQL", "Supabase", "Convex", "MongoDB", "Redis", "Prisma"],
  },
  {
    slug: "devops",
    values: ["Docker", "Kubernetes", "RabbitMQ", "CI/CD", "Git", "GitLab"],
  },
  { slug: "cloud", values: ["Vercel", "AWS"] },
  { slug: "automation", values: ["n8n", "OpenClaw", "Claude", "Codex"] },
  {
    slug: SOFT_SKILLS_SLUG,
    values: [
      "Technical Leadership",
      "Mentoring",
      "Ownership",
      "Project Planning",
      "Decision-Making",
      "Critical Thinking",
    ],
  },
];
