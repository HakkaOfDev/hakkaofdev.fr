"use client";

import CommandItem from "./commands/CommandItem";
import { useCommands } from "./providers/CommandsProvider";
import { TerminalProvider } from "./providers/TerminalProvider";
import { Terminal } from "./Terminal";
import WelcomeHero from "./WelcomeHero";

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
