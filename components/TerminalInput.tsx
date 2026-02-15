"use client";

import { ArrowRight } from "lucide-react";
import { useCommands } from "./CommandsProvider";
import {
  COMMANDS,
  SPOTIFY_COMMANDS,
} from "@/components/commands/command-descriptors";
import { useState } from "react";

function TerminalInput() {
  const { addCommand } = useCommands();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value === "") return;
    addCommand(value);
    setValue("");
    if (window.innerWidth <= 768) {
      (document.activeElement as HTMLElement)?.blur();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value === "") return;
      addCommand(value);
      setValue("");
      if (window.innerWidth <= 768) {
        e.currentTarget.blur();
      }
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase())}
          placeholder="Type 'help' or your command here..."
          className="outline-none bg-transparent border w-full h-10 p-2 pr-10 rounded-md text-sm"
          onKeyDown={handleKeyPress}
          autoComplete="off"
          list={
            value.length > 0
              ? value.startsWith("spotify")
                ? "spotify-commands-autocomplete"
                : "commands-autocomplete"
              : undefined
          }
        />
        <datalist id="commands-autocomplete">
          {COMMANDS.map((command) => (
            <option key={command.command} value={command.command}>
              {command.description}
            </option>
          ))}
        </datalist>
        <datalist id="spotify-commands-autocomplete">
          {SPOTIFY_COMMANDS.map((command) => (
            <option key={command.command} value={`spotify ${command.command}`}>
              {command.description}
            </option>
          ))}
        </datalist>

        <button
          type="submit"
          className="absolute right-2 top-1/2 hover:bg-accent rounded-full aspect-square w-7 transition-colors duration-200 cursor-pointer flex items-center justify-center -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Submit Command"
          disabled={value.length === 0}
        >
          <ArrowRight size={16} />
          <span className="sr-only">Submit Command</span>
        </button>
      </form>
    </div>
  );
}

export default TerminalInput;
