"use client";

import CommandItem from "./commands/CommandItem";
import CWelcome from "./commands/renders/CWelcome";
import { useCommands } from "./CommandsProvider";
import { Terminal } from "./Terminal";

function MainScreen() {
  const { showWelcome, commands } = useCommands();

  return (
      <Terminal>
        {showWelcome && <CWelcome className="pb-2" />}
      {commands.map((command) => (
        <CommandItem key={command.id} {...command} />
      ))}
    </Terminal>
  );
}

export default MainScreen;
