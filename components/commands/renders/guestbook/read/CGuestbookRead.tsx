"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { Shortcut } from "@/components/ui/Shortcut";
import { GuestbookClientService } from "@/lib/services";
import { cn } from "@/lib/utils";
import type { GuestbookFilters } from "@/types/guestbook";
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
    queryFn: () => GuestbookClientService.fetchEntries(filters),
    staleTime: 30_000,
    retry: false,
  });

  if (isLoading) return <ReadSkeleton />;

  return (
    <AnimatedSpan className="gap-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-muted-foreground text-xs">
          <span className="font-semibold text-quinary">guestbook</span>
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
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-quinary/10 px-2 py-0.5 font-semibold text-quinary text-xs ring-1 ring-quinary/20 ring-inset transition-colors duration-200 hover:bg-quinary/20 disabled:cursor-not-allowed disabled:opacity-50"
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
        <p className="font-mono text-destructive text-xs">
          <span className="text-destructive/60">error:</span>{" "}
          {error instanceof Error
            ? error.message
            : "Failed to load guestbook entries."}
        </p>
      )}

      {/* Empty */}
      {data && data.length === 0 && (
        <p className="inline-flex flex-wrap items-center gap-1.5 font-mono text-muted-foreground text-xs">
          <span className="text-muted-foreground/40">~</span>
          {filters.country ? (
            <>
              No entries from{" "}
              <span className="font-semibold">
                {GuestbookClientService.countryToFlag(filters.country)}{" "}
                {filters.country}
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
                className="px-1.5 py-0 text-xs"
              />{" "}
              to be the first.
            </>
          )}
        </p>
      )}

      {/* Entry list */}
      {data && data.length > 0 && (
        <div className="terminal-scrollbar max-h-52 overflow-y-auto overflow-x-hidden pr-1">
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
