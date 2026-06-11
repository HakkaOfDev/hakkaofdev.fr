"use client";

import Link from "next/link";
import { useFormatter } from "next-intl";
import { GuestbookClientService } from "@/lib/services";
import { cn } from "@/lib/utils";
import type { GuestbookEntry } from "@/types/guestbook";

export function GuestbookEntryRow({
  entry,
  index,
  isLast,
}: {
  entry: GuestbookEntry;
  index: number;
  isLast: boolean;
}) {
  const format = useFormatter();
  const date = new Date(entry.created_at);
  const formattedDate = Number.isNaN(date.getTime())
    ? entry.created_at
    : format.dateTime(date, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  const nameElement = entry.website ? (
    <Link
      href={entry.website}
      target="_blank"
      className="cursor-pointer truncate font-semibold text-foreground text-xs transition-colors duration-200 hover:text-quinary"
    >
      {entry.name}
    </Link>
  ) : (
    <span className="truncate font-semibold text-foreground text-xs">
      {entry.name}
    </span>
  );

  return (
    <div
      className={cn(
        "relative ms-1 min-w-0 border-quinary/30 border-s-2 ps-4",
        isLast ? "pb-0" : "pb-3",
      )}
    >
      <div className="absolute inset-s-[-5px] top-[5px] size-2 rounded-full bg-quinary" />

      <div className="flex items-baseline gap-2">
        <span className="shrink-0 font-mono text-muted-foreground/50 text-xs">
          #{String(index + 1).padStart(3, "0")}
        </span>
        {nameElement}
        {entry.country && (
          <span className="shrink-0 text-xs leading-none" title={entry.country}>
            {GuestbookClientService.countryToFlag(entry.country)}
          </span>
        )}
        <span className="ms-auto whitespace-nowrap font-mono text-muted-foreground/40 text-xs">
          {formattedDate}
        </span>
      </div>

      <p className="mt-0.5 whitespace-pre-wrap break-words text-muted-foreground text-xs leading-relaxed">
        {entry.message}
      </p>
    </div>
  );
}
