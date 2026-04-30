"use client";

import { Check, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const triggerClass =
  "flex size-7 min-w-7 cursor-pointer items-center justify-center rounded-md transition-colors duration-200 hover:bg-muted/60 dark:hover:bg-overlay-medium";

function LocaleSwitcher() {
  const t = useTranslations("Lang");
  const tNames = useTranslations("Lang.names");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleSelect = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={triggerClass}
          aria-label={t("switcher.ariaLabel")}
          title={t("switcher.title")}
        >
          <Languages size={13} className="text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="grid min-w-[150px] gap-0.5 rounded-lg border-border/60 bg-background/95 p-1 shadow-xl backdrop-blur-md"
      >
        {routing.locales.map((code) => {
          const isActive = code === locale;
          return (
            <button
              key={code}
              type="button"
              onClick={() => handleSelect(code)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs transition-colors duration-150",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-muted-foreground/60 text-xs uppercase">
                  {code}
                </span>
                <span>{tNames(code as never)}</span>
              </span>
              {isActive && <Check size={12} />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export { LocaleSwitcher };
