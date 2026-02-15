"use client";

import type { ReactNode } from "react";
import CHelp from "./renders/CHelp";
import CClear from "./renders/CClear";
import CReset from "./renders/CReset";
import CWelcome from "./renders/CWelcome";
import CProjects from "./renders/CProjects";
import CSkills from "./renders/CSkills";
import CAbout from "./renders/CAbout";
import CEducation from "./renders/CEducation";
import CExperiences from "./renders/CExperiences";

export type CommandDescriptor = {
  command: string;
  description: string;
};

type CommandDef = CommandDescriptor & {
  render: () => ReactNode;
};

export const COMMAND_DEFS: CommandDef[] = [
  {
    command: "welcome",
    description: "Display a welcome message and introduction",
    render: () => <CWelcome />,
  },
  {
    command: "help",
    description: "Display a list of available commands and their descriptions",
    render: () => <CHelp />,
  },
  {
    command: "clear",
    description: "Clear all previous commands and output from the terminal",
    render: () => <CClear />,
  },
  {
    command: "reset",
    description: "Reset the terminal to the initial state",
    render: () => <CReset />,
  },
  {
    command: "projects",
    description:
      "Browse through my portfolio of personal and professional projects",
    render: () => <CProjects />,
  },
  {
    command: "skills",
    description: "View my technical skills, tools and technologies I work with",
    render: () => <CSkills />,
  },
  {
    command: "about",
    description: "Learn more about my background, interests and career goals",
    render: () => <CAbout />,
  },
  {
    command: "education",
    description: "See my academic background and qualifications",
    render: () => <CEducation />,
  },
  {
    command: "experiences",
    description: "Explore my professional work history and accomplishments",
    render: () => <CExperiences />,
  },
];

export const COMMANDS: CommandDescriptor[] = COMMAND_DEFS.map(
  ({ command, description }) => ({ command, description })
);

export const COMMAND_RENDERERS: Record<string, () => ReactNode> =
  Object.fromEntries(COMMAND_DEFS.map((c) => [c.command, c.render]));

