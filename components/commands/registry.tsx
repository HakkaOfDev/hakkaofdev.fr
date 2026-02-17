"use client";

import type { ReactNode } from "react";
import CAbout from "./renders/CAbout";
import CClear from "./renders/CClear";
import CEducation from "./renders/CEducation";
import CExperiences from "./renders/CExperiences";
import CHelp from "./renders/CHelp";
import CProjects from "./renders/CProjects";
import CReset from "./renders/CReset";
import CSkills from "./renders/CSkills";

export type { CommandDescriptor } from "./command-descriptors";
export { COMMANDS } from "./command-descriptors";

export const COMMAND_RENDERERS: Record<string, () => ReactNode> = {
  help: () => <CHelp />,
  clear: () => <CClear />,
  reset: () => <CReset />,
  projects: () => <CProjects />,
  skills: () => <CSkills />,
  about: () => <CAbout />,
  education: () => <CEducation />,
  experiences: () => <CExperiences />,
};
