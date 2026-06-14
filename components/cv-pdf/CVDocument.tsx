import { Document, Page } from "@react-pdf/renderer";
import type { CvData } from "@/lib/cv/cv-pdf.data";
import { styles } from "@/lib/cv/cv-pdf.styles";
import {
  BottomSection,
  EducationSection,
  ExperienceSection,
  Header,
  HobbiesSection,
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
        <SummarySection title={data.sections.summary} summary={data.summary} />
        <ExperienceSection
          title={data.sections.experience}
          experiences={data.experiences}
        />
        <SkillsSection title={data.sections.skills} skills={data.skills} />
        <EducationSection
          title={data.sections.education}
          education={data.education}
        />
        <ProjectsSection
          title={data.sections.projects}
          projects={data.projects}
        />
        <BottomSection
          languagesTitle={data.sections.languages}
          linksTitle={data.sections.links}
          languages={data.languages}
          socials={data.socials}
        />
        <HobbiesSection title={data.sections.hobbies} hobbies={data.hobbies} />
      </Page>
    </Document>
  );
}
