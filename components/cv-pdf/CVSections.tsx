import { Image, Link, Text, View } from "@react-pdf/renderer";
import { SOFT_SKILLS_SLUG } from "@/lib/constants/skills.constants";
import type { CvData } from "@/lib/cv/cv-pdf.data";
import { styles } from "@/lib/cv/cv-pdf.styles";
import { BulletItem, Section, Sep } from "./CVPrimitives";

/* ── Header ───────────────────────────────────── */

export function Header({ data }: { data: CvData }) {
  const websiteText = data.website.replace(/^https?:\/\//, "");

  return (
    <View style={styles.header}>
      {data.photo && <Image src={data.photo} style={styles.photo} />}
      <View style={styles.headerText}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.jobTitle}>{data.jobTitle}</Text>

        <View style={styles.contactRow}>
          <Text style={styles.contactItem}>{data.email}</Text>
          <Sep />
          <Text style={styles.contactItem}>{data.location}</Text>
          <Sep />
          <Link src={`https://${websiteText}`} style={styles.contactLink}>
            {websiteText}
          </Link>
        </View>
      </View>
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
  if (experiences.length === 0) return null;

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
            {`${exp.company} · ${exp.location} · ${exp.period}`}
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
  if (skills.length === 0) return null;

  const technical = skills.filter((group) => group.slug !== SOFT_SKILLS_SLUG);
  const soft = skills.find((group) => group.slug === SOFT_SKILLS_SLUG);

  return (
    <Section title={title}>
      <View style={styles.skillsGrid}>
        {technical.map((group) => (
          <View key={group.slug} style={styles.skillCell} wrap={false}>
            <Text style={styles.skillLabel}>{group.label}</Text>
            <Text style={styles.skillValues}>{group.values.join(", ")}</Text>
          </View>
        ))}
      </View>
      {soft && (
        <View style={styles.skillRow} wrap={false}>
          <Text style={styles.skillLabel}>{soft.label}</Text>
          <Text style={styles.skillValues}>{soft.values.join(", ")}</Text>
        </View>
      )}
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
    <Section title={title} keepTogether>
      {education.map((edu) => (
        <View key={edu.slug} style={styles.item}>
          <Text style={styles.itemTitle}>{edu.name}</Text>
          <Text style={styles.itemMeta}>
            {`${edu.location} · ${edu.period}`}
          </Text>
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
  if (projects.length === 0) return null;

  return (
    <Section title={title}>
      {projects.map((project) => (
        <View key={project.slug} style={styles.projectItem} wrap={false}>
          <View style={styles.projectHeader} wrap={false}>
            <Text style={styles.projectName}>{project.name}</Text>
            {project.url && (
              <Link src={project.url} style={styles.projectLink}>
                {project.url.replace(/^https?:\/\/(www\.)?/, "")}
              </Link>
            )}
            <Text style={styles.projectTags}>{project.tags.join("  •  ")}</Text>
          </View>
          <Text style={styles.projectDesc}>{project.description}</Text>
          {project.highlights.map((highlight) => (
            <BulletItem key={highlight} text={highlight} />
          ))}
        </View>
      ))}
    </Section>
  );
}

/* ── Info row: Languages + Links + Hobbies ────── */

export function InfoRow({
  languagesTitle,
  linksTitle,
  hobbiesTitle,
  languages,
  socials,
  hobbies,
}: {
  languagesTitle: string;
  linksTitle: string;
  hobbiesTitle: string;
  languages: CvData["languages"];
  socials: CvData["socials"];
  hobbies: CvData["hobbies"];
}) {
  return (
    <View style={styles.infoRow} wrap={false}>
      <View style={[styles.infoCol, styles.infoColLanguages]}>
        <Section title={languagesTitle}>
          {languages.map((lang) => (
            <Text key={lang.code} style={styles.langLine}>
              <Text style={styles.langBold}>{lang.name}</Text> - {lang.level}
            </Text>
          ))}
        </Section>
      </View>
      <View style={[styles.infoCol, styles.infoColLinks]}>
        <Section title={linksTitle}>
          {socials.map((social) => (
            <View key={social.name} style={styles.socialLine}>
              <Text style={styles.socialLabel}>{social.name}:</Text>
              {/* Render the full URL (with scheme) as visible text, not just
                  a link annotation: text-based ATS parsers extract the text
                  layer and need an https:// URL to detect a social profile. */}
              <Link src={social.url} style={styles.socialLink}>
                {social.url}
              </Link>
            </View>
          ))}
        </Section>
      </View>
      <View style={[styles.infoCol, styles.infoColHobbies]}>
        <Section title={hobbiesTitle}>
          <Text style={styles.hobbiesText}>{hobbies.join(" · ")}</Text>
        </Section>
      </View>
    </View>
  );
}
