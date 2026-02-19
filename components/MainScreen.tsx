"use client";

import dynamic from "next/dynamic";
import { useCommands } from "./providers/CommandsProvider";
import { TerminalProvider } from "./providers/TerminalProvider";
import { Terminal } from "./Terminal";
import WelcomeHero from "./WelcomeHero";

const CommandItem = dynamic(() => import("./commands/CommandItem"), {
  loading: () => (
    <div className="flex items-center gap-1.5">
      <div className="h-1 w-1 animate-pulse rounded-full bg-primary/60" />
      <div className="h-1 w-1 animate-pulse rounded-full bg-primary/40 [animation-delay:150ms]" />
      <div className="h-1 w-1 animate-pulse rounded-full bg-primary/20 [animation-delay:300ms]" />
    </div>
  ),
});

function MainScreen() {
  const { showWelcome, commands } = useCommands();

  return (
    <TerminalProvider>
      <Terminal>
        {showWelcome && <WelcomeHero className="pb-4" />}
        {commands.map((command) => (
          <CommandItem key={command.id} {...command} />
        ))}
      </Terminal>
    </TerminalProvider>
  );
}

export default MainScreen;
