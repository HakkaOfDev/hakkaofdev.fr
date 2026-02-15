"use client";

import { useCommands } from "@/components/CommandsProvider";
import { AnimatedSpan } from "@/components/Terminal";

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
            <span
              className="text-chart-2 hover:text-chart-2/80 transition-colors duration-200 cursor-pointer"
              onClick={() => addCommand(`${prefix}${item.command}`)}
            >
              {prefix}
              {item.command}
            </span>{" "}
            - {item.description}
          </p>
        ))}
      </div>
    </AnimatedSpan>
  );
}

