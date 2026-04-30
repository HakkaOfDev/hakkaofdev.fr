"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import CommandItem from "./commands/CommandItem";
import { useCommands } from "./providers/CommandsProvider";
import { TerminalProvider, useTerminal } from "./providers/TerminalProvider";
import { Terminal } from "./terminal/Terminal";
import WelcomeHero from "./WelcomeHero";

function MainScreenContent() {
  const { commands, sessionSnapshots, activeSessionId } = useCommands();
  const { outputQuery } = useTerminal();
  const normalizedQuery = outputQuery.trim().toLowerCase();

  const matchingCommandIds = useMemo(() => {
    if (!normalizedQuery) return null;
    return new Set(
      commands
        .filter((command) => command.input.includes(normalizedQuery))
        .map((command) => command.id),
    );
  }, [commands, normalizedQuery]);

  const renderSession = (
    session: (typeof sessionSnapshots)[number],
    isActive: boolean,
  ) => {
    const shouldFilter = isActive && normalizedQuery.length > 0;
    const hasMatch =
      !shouldFilter ||
      session.commands.some((command) =>
        command.input.includes(normalizedQuery),
      );

    return (
      <>
        {session.showWelcome && !shouldFilter && (
          <WelcomeHero className="pb-4" />
        )}

        {shouldFilter && session.commands.length > 0 && !hasMatch && (
          <p className="mb-3 pl-5 font-mono text-muted-foreground/70 text-xs">
            No command matches "{normalizedQuery}".
          </p>
        )}

        {session.commands.map((command) => {
          const isVisible =
            !shouldFilter || matchingCommandIds?.has(command.id) === true;

          return (
            <div
              key={command.id}
              className={cn(!isVisible && "hidden")}
              aria-hidden={!isVisible}
            >
              <CommandItem {...command} />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <Terminal>
      {sessionSnapshots.map((session) => {
        const isActive = session.id === activeSessionId;

        return (
          <div
            key={session.id}
            className={cn(!isActive && "hidden")}
            aria-hidden={!isActive}
          >
            {renderSession(session, isActive)}
          </div>
        );
      })}
    </Terminal>
  );
}

function MainScreen() {
  return (
    <TerminalProvider>
      <MainScreenContent />
    </TerminalProvider>
  );
}

export default MainScreen;
