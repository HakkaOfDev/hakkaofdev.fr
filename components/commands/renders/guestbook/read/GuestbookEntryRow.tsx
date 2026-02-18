import Link from "next/link";
import { countryToFlag } from "@/lib/services/guestbook-client";
import type { GuestbookEntry } from "@/lib/types/guestbook";
import { cn, formatEntryDate } from "@/lib/utils";

export function GuestbookEntryRow({
  entry,
  index,
  isLast,
}: {
  entry: GuestbookEntry;
  index: number;
  isLast: boolean;
}) {
  const nameElement = entry.website ? (
    <Link
      href={entry.website}
      target="_blank"
      className="text-xs font-semibold text-foreground truncate hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-200 cursor-pointer"
    >
      {entry.name}
    </Link>
  ) : (
    <span className="text-xs font-semibold text-foreground truncate">
      {entry.name}
    </span>
  );

  return (
    <div
      className={cn(
        "border-l-2 border-pink-500/30 dark:border-pink-400/20 pl-4 ml-1 relative min-w-0",
        isLast ? "pb-0" : "pb-3",
      )}
    >
      <div className="absolute -left-[5px] top-[5px] size-2 rounded-full bg-pink-500 dark:bg-pink-400" />

      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[10px] text-muted-foreground/50 shrink-0">
          #{String(index + 1).padStart(3, "0")}
        </span>
        {nameElement}
        {entry.country && (
          <span
            className="text-[11px] leading-none shrink-0"
            title={entry.country}
          >
            {countryToFlag(entry.country)}
          </span>
        )}
        <span className="text-[10px] text-muted-foreground/40 font-mono whitespace-nowrap ml-auto">
          {formatEntryDate(entry.created_at)}
        </span>
      </div>

      <p className="mt-0.5 text-xs text-muted-foreground whitespace-pre-wrap break-words leading-relaxed">
        {entry.message}
      </p>
    </div>
  );
}
