import { Link, Text, View } from "@react-pdf/renderer";
import type { CvData } from "@/lib/cv/cv-pdf.data";
import { styles } from "@/lib/cv/cv-pdf.styles";
import { BulletItem, Section, Sep } from "./CVPrimitives";

/* ── Header ───────────────────────────────────── */

export function Header({ data }: { data: CvData }) {
  const websiteText = data.website.replace(/^https?:\/\//, "");

  return (
    <View style={styles.header}>
      <Text style={styles.name}>{data.name}</Text>
      <Text style={styles.jobTitle}>{data.jobTitle}</Text>

      <View style={styles.contactRow}>
        <Text style={styles.contactItem}>{data.email}</Text>
        <Sep />
        <Text style={styles.contactItem}>{data.location}</Text>
      </View>
      <Link src={`https://${websiteText}`} style={styles.contactLink}>
        {websiteText}
      </Link>
    </View>
  );
}

/* ── Summary ──────────────────────────────────── */

export function SummarySection({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <Section title={title}>
      <Text style={styles.summary}>{summary}</Text>
    </Section>
  );
}

/* ── Experience ───────────────────────────────── */

export function ExperienceSection({
  title,
  experiences,
}: {
  title: string;
  experiences: CvData["experiences"];
}) {
  return (
    <Section title={title}>
      {experiences.map((exp) => (
        <View key={exp.slug} style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{exp.title}</Text>
            {exp.companyUrl && (
              <Link src={exp.companyUrl} style={styles.itemLink}>
                {exp.companyUrl.replace(/^https?:\/\/(www\.)?/, "")}
              </Link>
            )}
          </View>
          <Text style={styles.itemMeta}>
            {`${exp.freelanceLabel ? `${exp.freelanceLabel} · ` : ""}${exp.company} · ${exp.location} · ${exp.period}`}
          </Text>
          {exp.descriptions.map((desc) => (
            <BulletItem key={desc} text={desc} />
          ))}
        </View>
      ))}
    </Section>
  );
}

/* ── Skills ───────────────────────────────────── */

export function SkillsSection({
  title,
  skills,
}: {
  title: string;
  skills: CvData["skills"];
}) {
  return (
    <Section title={title}>
      <View style={styles.skillsGrid}>
        {skills.map((group) => (
          <View key={group.slug} style={styles.skillRow}>
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
  title,
  education,
}: {
  title: string;
  education: CvData["education"];
}) {
  return (
    <Section title={title}>
      {education.map((edu) => (
        <View key={edu.slug} style={styles.item}>
          <Text style={styles.itemTitle}>{edu.name}</Text>
          <Text style={styles.itemMeta}>
            {`${edu.location} · ${edu.period}`}
          </Text>
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
  title,
  projects,
}: {
  title: string;
  projects: CvData["projects"];
}) {
  return (
    <Section title={title}>
      {projects.map((project) => (
        <View key={project.slug} style={styles.projectItem}>
          <View style={styles.projectHeader}>
            <Text style={styles.projectName}>{`–  ${project.name}`}</Text>
            {project.url && (
              <Link src={project.url} style={styles.projectLink}>
                {project.url.replace(/^https?:\/\/(www\.)?/, "")}
              </Link>
            )}
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
  languagesTitle,
  linksTitle,
  languages,
  socials,
}: {
  languagesTitle: string;
  linksTitle: string;
  languages: CvData["languages"];
  socials: CvData["socials"];
}) {
  return (
    <View style={styles.bottomRow}>
      <View style={styles.bottomCol}>
        <Section title={languagesTitle}>
          {languages.map((lang) => (
            <Text key={lang.code} style={styles.langLine}>
              <Text style={styles.langBold}>{lang.name}</Text> - {lang.level}
            </Text>
          ))}
        </Section>
      </View>
      <View style={[styles.bottomCol, styles.bottomColRight]}>
        <Section title={linksTitle}>
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

/* ── Hobbies & Interests ──────────────────────── */

export function HobbiesSection({
  title,
  hobbies,
}: {
  title: string;
  hobbies: CvData["hobbies"];
}) {
  return (
    <Section title={title}>
      <Text style={styles.hobbiesText}>{hobbies.join("  ·  ")}</Text>
    </Section>
  );
}
