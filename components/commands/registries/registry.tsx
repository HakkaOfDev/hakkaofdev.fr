"use client";

import type { ReactNode } from "react";
import CAbout from "../renders/CAbout";
import CClear from "../renders/CClear";
import CContact from "../renders/CContact";
import CCv from "../renders/CCv";
import CEducation from "../renders/CEducation";
import CExperiences from "../renders/CExperiences";
import CHelp from "../renders/CHelp";
import CProjects from "../renders/CProjects";
import CRepo from "../renders/CRepo";
import CReset from "../renders/CReset";
import CSkills from "../renders/CSkills";
import CStats from "../renders/CStats";

export type { CommandDescriptor } from "../../../lib/command-descriptors";
export { COMMANDS } from "../../../lib/command-descriptors";

export const COMMAND_RENDERERS: Record<string, () => ReactNode> = {
  help: () => <CHelp />,
  clear: () => <CClear />,
  contact: () => <CContact />,
  cv: () => <CCv />,
  reset: () => <CReset />,
  projects: () => <CProjects />,
  repo: () => <CRepo />,
  skills: () => <CSkills />,
  about: () => <CAbout />,
  education: () => <CEducation />,
  experiences: () => <CExperiences />,
  stats: () => <CStats />,
};
