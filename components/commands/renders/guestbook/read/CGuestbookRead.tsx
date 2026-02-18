"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { Shortcut } from "@/components/ui/Shortcut";
import {
  countryToFlag,
  fetchGuestbookEntries,
} from "@/lib/services/guestbook-client";
import type { GuestbookFilters } from "@/lib/types/guestbook";
import { cn } from "@/lib/utils";
import { FilterPopover } from "./FilterPopover";
import { GuestbookEntryRow } from "./GuestbookEntryRow";
import { ReadSkeleton } from "./ReadSkeleton";

function CGuestbookRead() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<GuestbookFilters>({
    sort: "desc",
    country: null,
  });

  const { data, error, isLoading, isFetching, isError } = useQuery({
    queryKey: ["guestbook-entries", filters],
    queryFn: () => fetchGuestbookEntries(filters),
    staleTime: 30_000,
    retry: false,
  });

  if (isLoading) return <ReadSkeleton />;

  return (
    <AnimatedSpan className="gap-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground font-mono">
          <span className="text-pink-500 dark:text-pink-400 font-semibold">
            guestbook
          </span>
          <span className="text-muted-foreground/40"> — </span>
          {data
            ? `${data.length} ${data.length === 1 ? "entry" : "entries"}`
            : "unavailable"}
        </p>
        <div className="flex items-center gap-1.5">
          <FilterPopover filters={filters} onChangeFilters={setFilters} />
          <button
            type="button"
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["guestbook-entries"],
              })
            }
            disabled={isFetching}
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold bg-pink-500/10 text-pink-500 dark:text-pink-400 ring-1 ring-inset ring-pink-500/20 hover:bg-pink-500/20 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh guestbook entries"
          >
            <RefreshCcw
              className={cn("h-2.5 w-2.5", isFetching && "animate-spin")}
            />
            refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {isError && (
        <p className="text-xs font-mono text-destructive">
          <span className="text-destructive/60">error:</span>{" "}
          {error instanceof Error
            ? error.message
            : "Failed to load guestbook entries."}
        </p>
      )}

      {/* Empty */}
      {data && data.length === 0 && (
        <p className="text-xs text-muted-foreground font-mono inline-flex items-center gap-1.5 flex-wrap">
          <span className="text-muted-foreground/40">~</span>
          {filters.country ? (
            <>
              No entries from{" "}
              <span className="font-semibold">
                {countryToFlag(filters.country)} {filters.country}
              </span>
              .
            </>
          ) : (
            <>
              No entries yet. Run
              <Shortcut
                label="guestbook sign"
                command="guestbook sign"
                variant="pink"
                className="text-[10px] py-0 px-1.5"
              />{" "}
              to be the first.
            </>
          )}
        </p>
      )}

      {/* Entry list */}
      {data && data.length > 0 && (
        <div className="max-h-52 overflow-y-auto overflow-x-hidden terminal-scrollbar pr-1">
          {data.map((entry, idx) => (
            <GuestbookEntryRow
              key={entry.id}
              entry={entry}
              index={idx}
              isLast={idx === data.length - 1}
            />
          ))}
        </div>
      )}
    </AnimatedSpan>
  );
}

export default CGuestbookRead;
