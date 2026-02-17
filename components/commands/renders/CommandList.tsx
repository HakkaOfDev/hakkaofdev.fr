"use client";

import { AnimatedSpan } from "@/components/AnimatedComponents";
import { useCommands } from "@/components/CommandsProvider";

type Item = {
  command: string;
  description: string;
};

export default function CommandList({
  title = "Available commands:",
  items,
  prefix = "",
}: {
  title?: string;
  items: Item[];
  prefix?: string;
}) {
  const { addCommand } = useCommands();

  return (
    <AnimatedSpan>
      <p className="mb-3 text-chart-1 underline underline-offset-4">{title}</p>
      <div className="flex flex-col w-full gap-1 max-w-full">
        {items.map((item) => (
          <p key={`${prefix}${item.command}`}>
            <button
              type="button"
              aria-label={`Run command: ${prefix}${item.command}`}
              className="text-chart-2 hover:text-chart-2/80 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 font-inherit"
              onClick={() => addCommand(`${prefix}${item.command}`)}
            >
              {prefix}
              {item.command}
            </button>{" "}
            - {item.description}
          </p>
        ))}
      </div>
    </AnimatedSpan>
  );
}
