"use client";

import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";

export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      className={cn(
        "size-7 min-w-7 relative hover:bg-accent transition-colors flex items-center justify-center rounded-full cursor-pointer duration-200 px-0",
        className,
      )}
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    >
      <SunIcon
        size={15}
        className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <MoonIcon
        size={15}
        className="absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
