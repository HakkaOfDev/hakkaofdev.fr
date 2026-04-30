"use client";

import { useTranslations } from "next-intl";
import { THEME_COLOR_KEYS } from "@/types/theme";

interface ThemeCreateJSONFormProps {
  defaultJSON: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ThemeCreateJSONForm({
  defaultJSON,
  onSubmit,
}: ThemeCreateJSONFormProps) {
  const t = useTranslations("Theme.create");
  return (
    <form onSubmit={onSubmit} className="grid max-w-md gap-2">
      <p className="text-muted-foreground/50 text-xs">{t("jsonHint")}</p>
      <textarea
        name="json"
        rows={16}
        defaultValue={defaultJSON}
        className="terminal-scrollbar w-full resize-y rounded-md border border-border bg-muted/30 px-3 py-2 font-mono text-foreground text-xs outline-none placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/50"
        required
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-primary/10 px-4 py-1.5 font-semibold text-primary text-xs ring-1 ring-primary/20 ring-inset transition-colors hover:bg-primary/20"
        >
          {t("submit")}
        </button>
        <span className="text-muted-foreground/40 text-xs">
          {t("jsonRequired", { count: THEME_COLOR_KEYS.length })}
        </span>
      </div>
    </form>
  );
}
