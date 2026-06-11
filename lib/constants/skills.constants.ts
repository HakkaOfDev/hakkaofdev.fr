export type SkillGroup = {
  /** Key under `CV.skillGroups.{slug}` for the translated label. */
  slug: string;
  values: string[];
};

export const SKILLS: ReadonlyArray<SkillGroup> = [
  {
    slug: "softSkills",
    values: [
      "Technical Leadership",
      "Mentoring",
      "Ownership",
      "Project Planning",
      "Decision-Making",
      "Critical Thinking",
    ],
  },
  { slug: "languages", values: ["Javascript", "Typescript", "Python"] },
  {
    slug: "frameworks",
    values: [
      "Next.js",
      "Vue.js",
      "React",
      "React Native",
      "Expo",
      "Astro",
      "Flask",
      "Django",
    ],
  },
  {
    slug: "stateData",
    values: ["TanStack Query", "GraphQL", "Zustand", "Redux", "Zod"],
  },
  { slug: "uiStyling", values: ["Tailwind", "shadcn/ui", "Motion", "Figma"] },
  { slug: "tooling", values: ["Biome", "Bun"] },
  { slug: "testing", values: ["Vitest", "Playwright"] },
  { slug: "databases", values: ["PostgreSQL", "Supabase", "MongoDB", "Redis"] },
  { slug: "cloud", values: ["Vercel", "AWS"] },
  { slug: "vcs", values: ["Git", "Gitlab"] },
  { slug: "orm", values: ["Prisma"] },
  { slug: "devops", values: ["Docker", "k8s"] },
  { slug: "automation", values: ["n8n", "openclaw"] },
  { slug: "ai", values: ["Codex", "Claude"] },
];
