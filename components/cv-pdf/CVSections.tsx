import { Link, Text, View } from "@react-pdf/renderer";
import type { CvData } from "@/lib/cv/cv-pdf.data";
import { styles } from "@/lib/cv/cv-pdf.styles";
import { BulletItem, Section, Sep } from "./CVPrimitives";

/* ── Header ───────────────────────────────────── */

export function Header({ data }: { data: CvData }) {
  const github = data.socials.find((s) => s.name === "GitHub");
  const linkedin = data.socials.find((s) => s.name === "LinkedIn");

  return (
    <View style={styles.header}>
      <Text style={styles.name}>{data.name}</Text>
      <Text style={styles.jobTitle}>{data.jobTitle}</Text>

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
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>{exp.title}</Text>
            <Text style={styles.itemPeriod}>{exp.period}</Text>
          </View>
          <View style={styles.itemSubRow}>
            <View style={styles.itemCompanyGroup}>
              <Text style={styles.itemCompany}>{exp.company}</Text>
              {exp.companyUrl && (
                <Link src={exp.companyUrl} style={styles.itemCompanyLink}>
                  {exp.companyUrl.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
              )}
            </View>
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
            <Text style={styles.projectName}>{project.name}</Text>
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
