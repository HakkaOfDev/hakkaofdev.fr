import { Document, Page } from "@react-pdf/renderer";
import { CV_DATA } from "@/lib/cv/cv-pdf.data";
import { styles } from "@/lib/cv/cv-pdf.styles";
import {
  BottomSection,
  EducationSection,
  ExperienceSection,
  Header,
  ProjectsSection,
  SkillsSection,
  SummarySection,
} from "./CVSections";

export function CVDocument() {
  return (
    <Document
      title={`${CV_DATA.name} - CV`}
      author={CV_DATA.name}
      subject="CV"
      creator="hakkaofdev.fr"
      producer="react-pdf"
      language="en-US"
    >
      <Page size="A4" style={styles.page}>
        <Header data={CV_DATA} />
        <SummarySection summary={CV_DATA.summary} />
        <ExperienceSection experiences={CV_DATA.experiences} />
        <SkillsSection skills={CV_DATA.skills} />
        <EducationSection education={CV_DATA.education} />
        <ProjectsSection projects={CV_DATA.projects} />
        <BottomSection
          languages={CV_DATA.languages}
          socials={CV_DATA.socials}
        />
      </Page>
    </Document>
  );
}
