import { Document, Page, View } from "@react-pdf/renderer";
import type { CvData } from "@/lib/cv/cv-pdf.data";
import { styles } from "@/lib/cv/cv-pdf.styles";
import {
  EducationSection,
  ExperienceSection,
  Header,
  InfoRow,
  ProjectsSection,
  SkillsSection,
  SummarySection,
} from "./CVSections";

export function CVDocument({ data }: { data: CvData }) {
  return (
    <Document
      title={data.documentTitle}
      author={data.name}
      subject={data.subject}
      creator="hakkaofdev.fr"
      producer="react-pdf"
      language={data.language}
    >
      <Page size="A4" style={styles.page}>
        <Header data={data} />
        <View style={styles.sectionGap} />
        <SummarySection title={data.sections.summary} summary={data.summary} />
        <View style={styles.sectionGap} />
        <ExperienceSection
          title={data.sections.experience}
          experiences={data.experiences}
        />
        <View style={styles.sectionGap} />
        <SkillsSection title={data.sections.skills} skills={data.skills} />
        <View style={styles.sectionGap} />
        <EducationSection
          title={data.sections.education}
          education={data.education}
        />
        <View style={styles.sectionGap} />
        <InfoRow
          languagesTitle={data.sections.languages}
          linksTitle={data.sections.links}
          hobbiesTitle={data.sections.hobbies}
          languages={data.languages}
          socials={data.socials}
          hobbies={data.hobbies}
        />
      </Page>
      {data.projects.length > 0 && (
        <Page size="A4" style={styles.page}>
          <ProjectsSection
            title={data.sections.projects}
            projects={data.projects}
          />
        </Page>
      )}
    </Document>
  );
}
