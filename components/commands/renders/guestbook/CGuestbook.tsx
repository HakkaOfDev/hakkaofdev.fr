"use client";

import {
  GUESTBOOK_COMMAND_RENDERERS,
  GUESTBOOK_COMMANDS,
} from "@/components/commands/registries/guestbook.registry";
import SubCommandRouter from "../SubCommandRouter";

function CGuestbook({ input }: { input: string }) {
  return (
    <SubCommandRouter
      input={input}
      commands={GUESTBOOK_COMMANDS}
      prefix="guestbook"
      title="Guestbook commands"
      variant="pink"
      renderValid={(subcommand) => {
        const renderer =
          GUESTBOOK_COMMAND_RENDERERS[
            subcommand as keyof typeof GUESTBOOK_COMMAND_RENDERERS
          ];
        return renderer();
      }}
    />
  );
}

export default CGuestbook;
