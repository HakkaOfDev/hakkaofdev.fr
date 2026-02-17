"use client";

import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { useCommands } from "./CommandsProvider";
import { Terminal } from "./Terminal";
import WelcomeHero from "./WelcomeHero";

const CommandItem = dynamic(() => import("./commands/CommandItem"), {
  loading: () => <Loader size={16} className="animate-spin" />,
});

function MainScreen() {
  const { showWelcome, commands } = useCommands();

  return (
    <Terminal>
      {showWelcome && <WelcomeHero className="pb-2" />}
      {commands.map((command) => (
        <CommandItem key={command.id} {...command} />
      ))}
    </Terminal>
  );
}

export default MainScreen;
