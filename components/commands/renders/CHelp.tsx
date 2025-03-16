import { AnimatedSpan } from "@/components/Terminal";
import { COMMANDS } from "@/lib/constants";

function CHelp() {
  return (
    <AnimatedSpan>
      <p className="mb-3 text-chart-1 underline underline-offset-4">
        Available commands:
      </p>
      <div className="flex flex-col w-full gap-1 max-w-full">
        {COMMANDS.map((command) => (
          <p key={command.command}>
            <span className="text-chart-2">{command.command}</span> -{" "}
            {command.description}
          </p>
        ))}
      </div>
    </AnimatedSpan>
  );
}

export default CHelp;
