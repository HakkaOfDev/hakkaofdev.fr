export type CommandDescriptor = {
  command: string;
  description: string;
};

export const COMMANDS: CommandDescriptor[] = [
  {
    command: "about",
    description: "Learn more about my background, interests and career goals",
  },
  {
    command: "clear",
    description: "Clear all previous commands and output from the terminal",
  },
  {
    command: "education",
    description: "See my academic background and qualifications",
  },
  {
    command: "experiences",
    description: "Explore my professional work history and accomplishments",
  },
  {
    command: "help",
    description: "Display a list of available commands and their descriptions",
  },
  {
    command: "projects",
    description:
      "Browse through my portfolio of personal and professional projects",
  },
  {
    command: "reset",
    description: "Reset the terminal to the initial state",
  },
  {
    command: "skills",
    description: "View my technical skills, tools and technologies I work with",
  },
  {
    command: "spotify",
    description: "Display the help for the spotify commands",
  },
];

export type SpotifyCommandDescriptor = {
  command: "now" | "top" | "history";
  description: string;
};

export const SPOTIFY_COMMANDS: SpotifyCommandDescriptor[] = [
  {
    command: "history",
    description: "Display my listening history",
  },
  {
    command: "now",
    description: "Display the currently playing song",
  },
  {
    command: "top",
    description: "Display my top tracks",
  },
];
