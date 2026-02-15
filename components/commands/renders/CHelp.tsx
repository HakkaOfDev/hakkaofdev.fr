import { useCommands } from "@/components/CommandsProvider";
import { AnimatedSpan } from "@/components/Terminal";
import { COMMANDS } from "@/components/commands/registry";

function CHelp() {
  const { addCommand } = useCommands();

  return (
    <AnimatedSpan>
      <p className="mb-3 text-chart-1 underline underline-offset-4">
        Available commands:
      </p>
      <div className="flex flex-col w-full gap-1 max-w-full">
        {COMMANDS.map((command) => (
          <p key={command.command}>
            <span
              className="text-chart-2 hover:text-chart-2/80 transition-colors duration-200 cursor-pointer"
              onClick={() => addCommand(command.command)}
            >
              {command.command}
            </span>{" "}
            - {command.description}
          </p>
        ))}
      </div>
    </AnimatedSpan>
  );
}

export default CHelp;
