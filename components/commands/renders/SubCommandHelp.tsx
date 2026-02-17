"use client";

import { Info } from "lucide-react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { ShortcutSection } from "@/components/ShortcutSection";
import { Shortcut, type ShortcutProps } from "@/components/ui/Shortcut";

type Item = {
  command: string;
  description: string;
};

export default function SubCommandHelp({
  title,
  items,
  prefix = "",
  variant = "default",
}: {
  title: string;
  items: Item[];
  prefix?: string;
  variant?: ShortcutProps["variant"];
}) {
  return (
    <AnimatedSpan className="gap-4">
      <div className="flex items-center gap-2">
        <Info className="h-3.5 w-3.5 text-chart-1 shrink-0" />
        <p className="text-chart-1 font-semibold">{title}</p>
      </div>

      <ShortcutSection title="Sub-commands">
        <div className="grid gap-1.5">
          {items.map((item) => (
            <div
              key={item.command}
              className="grid grid-cols-[140px_1fr] gap-3 items-center"
            >
              <Shortcut
                label={`${prefix}${item.command}`}
                command={`${prefix}${item.command}`}
                variant={variant}
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </ShortcutSection>
    </AnimatedSpan>
  );
}
