"use client";

import { ArrowRight } from "lucide-react";
import { useCommands } from "./CommandsProvider";
import { COMMANDS } from "@/lib/constants";
import { useState } from "react";

function TerminalInput() {
  const { addCommand } = useCommands();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addCommand(value);
    setValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCommand(value);
      setValue("");
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type 'help' or your command here..."
          className="outline-none bg-transparent border w-full h-10 p-2 pr-10 rounded-md text-sm"
          onKeyDown={handleKeyPress}
          autoComplete="off"
          list={value.length > 0 ? "commands-autocomplete" : undefined}
        />
        <datalist id="commands-autocomplete">
          {COMMANDS.map((command) => (
            <option
              key={command.command}
              value={command.command}
              className="px-2 py-1 hover:bg-accent cursor-pointer text-sm"
            >
              {command.description}
            </option>
          ))}
        </datalist>

        <button
          type="submit"
          className="absolute right-2 top-1/2 hover:bg-accent rounded-full aspect-square w-7 transition-colors duration-200 cursor-pointer flex items-center justify-center -translate-y-1/2"
        >
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}

export default TerminalInput;
