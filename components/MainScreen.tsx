"use client";

import dynamic from "next/dynamic";
import { useCommands } from "./CommandsProvider";
import { Terminal } from "./Terminal";
import { TerminalProvider } from "./TerminalProvider";
import WelcomeHero from "./WelcomeHero";

const CommandItem = dynamic(() => import("./commands/CommandItem"), {
  loading: () => (
    <div className="flex items-center gap-1.5">
      <div className="h-1 w-1 rounded-full bg-chart-1/60 animate-pulse" />
      <div className="h-1 w-1 rounded-full bg-chart-1/40 animate-pulse [animation-delay:150ms]" />
      <div className="h-1 w-1 rounded-full bg-chart-1/20 animate-pulse [animation-delay:300ms]" />
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
