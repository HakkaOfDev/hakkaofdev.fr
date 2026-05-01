export type SkillGroup = {
  /** Key under `CV.skillGroups.{slug}` for the translated label. */
  slug: string;
  values: string[];
};

export const SKILLS: ReadonlyArray<SkillGroup> = [
  { slug: "languages", values: ["Javascript", "Typescript", "Python"] },
  {
    slug: "frameworks",
    values: [
      "Next.js",
      "Vue.js",
      "React",
      "React Native",
      "Expo",
      "Flask",
      "Django",
    ],
  },
  { slug: "uiStyling", values: ["Tailwind", "shadcn/ui", "Motion"] },
  { slug: "tooling", values: ["Biome", "Bun"] },
  { slug: "databases", values: ["PostgreSQL", "Supabase", "MongoDB", "Redis"] },
  { slug: "cloud", values: ["Vercel", "AWS"] },
  { slug: "vcs", values: ["Git", "Gitlab"] },
  { slug: "orm", values: ["Prisma"] },
  { slug: "devops", values: ["Docker", "k8s"] },
  { slug: "automation", values: ["n8n", "openclaw"] },
  { slug: "ai", values: ["Codex", "Claude"] },
];
