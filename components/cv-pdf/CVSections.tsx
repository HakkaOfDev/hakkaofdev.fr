import { Link, Text, View } from "@react-pdf/renderer";
import type { CV_DATA } from "@/lib/cv/cv-pdf.data";
import { styles } from "@/lib/cv/cv-pdf.styles";
import { BulletItem, Section, Sep } from "./CVPrimitives";

type CVData = typeof CV_DATA;

/* ── Header ───────────────────────────────────── */

export function Header({ data }: { data: CVData }) {
  const github = data.socials.find((s) => s.name === "GitHub");
  const linkedin = data.socials.find((s) => s.name === "LinkedIn");

  return (
    <View style={styles.header}>
      <Text style={styles.name}>{data.name}</Text>
      <Text style={styles.jobTitle}>{data.title}</Text>

      <View style={styles.contactRow}>
        <Text style={styles.contactItem}>{data.email}</Text>
        <Sep />
        <Text style={styles.contactItem}>{data.location}</Text>
        <Sep />
        <Link
          src={`https://${data.website.replace(/^https?:\/\//, "")}`}
          style={styles.contactLink}
        >
          {data.website.replace(/^https?:\/\//, "")}
        </Link>
        {linkedin && (
          <>
            <Sep />
            <Link src={linkedin.url} style={styles.contactLink}>
              {linkedin.url.replace(/^https?:\/\/(www\.)?/, "")}
            </Link>
          </>
        )}
        {github && (
          <>
            <Sep />
            <Link src={github.url} style={styles.contactLink}>
              {github.url.replace(/^https?:\/\/(www\.)?/, "")}
            </Link>
          </>
        )}
      </View>
    </View>
  );
}

/* ── Summary ──────────────────────────────────── */

export function SummarySection({ summary }: { summary: string }) {
  return (
    <Section title="Professional Summary">
      <Text style={styles.summary}>{summary}</Text>
    </Section>
  );
}

/* ── Experience ───────────────────────────────── */

export function ExperienceSection({
  experiences,
}: {
  experiences: CVData["experiences"];
}) {
  return (
    <Section title="Experience">
      {experiences.map((exp) => (
        <View key={`${exp.title}-${exp.company}`} style={styles.item}>
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>{exp.title}</Text>
            <Text style={styles.itemPeriod}>{exp.period}</Text>
          </View>
          <View style={styles.itemSubRow}>
            <Text style={styles.itemCompany}>{exp.company}</Text>
            <Text style={styles.itemLocation}>{exp.location}</Text>
          </View>
          {exp.descriptions.map((desc) => (
            <BulletItem key={desc} text={desc} />
          ))}
        </View>
      ))}
    </Section>
  );
}

/* ── Technical Skills ─────────────────────────── */

export function SkillsSection({ skills }: { skills: CVData["skills"] }) {
  return (
    <Section title="Technical Skills">
      <View style={styles.skillsGrid}>
        {skills.map((group) => (
          <View key={group.label} style={styles.skillRow}>
            <Text style={styles.skillLabel}>{group.label}:</Text>
            <Text style={styles.skillValues}>{group.values.join(", ")}</Text>
          </View>
        ))}
      </View>
    </Section>
  );
}

/* ── Education ────────────────────────────────── */

export function EducationSection({
  education,
}: {
  education: CVData["education"];
}) {
  return (
    <Section title="Education">
      {education.map((edu) => (
        <View key={`${edu.name}-${edu.period}`} style={styles.item}>
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>{edu.name}</Text>
            <Text style={styles.itemPeriod}>{edu.period}</Text>
          </View>
          <Text style={styles.itemCompany}>{edu.location}</Text>
          {edu.descriptions.map((desc) => (
            <BulletItem key={desc} text={desc} />
          ))}
        </View>
      ))}
    </Section>
  );
}

/* ── Selected Projects ────────────────────────── */

export function ProjectsSection({
  projects,
}: {
  projects: CVData["projects"];
}) {
  return (
    <Section title="Selected Projects">
      {projects.map((project) => (
        <View key={project.name} style={styles.projectItem}>
          <View style={styles.projectHeader}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Link src={project.url} style={styles.projectLink}>
              {project.url.replace(/^https?:\/\/(www\.)?/, "")}
            </Link>
          </View>
          <Text style={styles.projectTags}>{project.tags.join("  ·  ")}</Text>
          <Text style={styles.projectDesc}>{project.description}</Text>
        </View>
      ))}
    </Section>
  );
}

/* ── Bottom: Languages + Links ────────────────── */

export function BottomSection({
  languages,
  socials,
}: {
  languages: CVData["languages"];
  socials: CVData["socials"];
}) {
  return (
    <View style={styles.bottomRow}>
      <View style={styles.bottomCol}>
        <Section title="Languages">
          {languages.map((lang) => (
            <Text key={lang.lang} style={styles.langLine}>
              <Text style={styles.langBold}>{lang.lang}</Text> — {lang.level}
            </Text>
          ))}
        </Section>
      </View>
      <View style={[styles.bottomCol, styles.bottomColRight]}>
        <Section title="Links">
          {socials.map((social) => (
            <View key={social.name} style={styles.socialLine}>
              <Text style={styles.socialLabel}>{social.name}:</Text>
              <Link src={social.url} style={styles.socialLink}>
                {social.url.replace(/^https?:\/\/(www\.)?/, "")}
              </Link>
            </View>
          ))}
        </Section>
      </View>
    </View>
  );
}
