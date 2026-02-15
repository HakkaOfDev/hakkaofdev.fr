"use client";

import type { ReactNode } from "react";
import CHelp from "./renders/CHelp";
import CClear from "./renders/CClear";
import CReset from "./renders/CReset";
import CProjects from "./renders/CProjects";
import CSkills from "./renders/CSkills";
import CAbout from "./renders/CAbout";
import CEducation from "./renders/CEducation";
import CExperiences from "./renders/CExperiences";

export { COMMANDS } from "./command-descriptors";
export type { CommandDescriptor } from "./command-descriptors";

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
