"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Filter,
  RefreshCcw,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { Shortcut } from "@/components/ui/Shortcut";
import { cn } from "@/lib/utils";

type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  website: string | null;
  country: string | null;
  created_at: string;
};

type GuestbookListResponse = {
  entries: GuestbookEntry[];
};

type GuestbookApiError = {
  error?: string;
};

type SortOrder = "desc" | "asc";

type GuestbookFilters = {
  sort: SortOrder;
  country: string | null;
};

async function fetchGuestbookEntries(filters: GuestbookFilters) {
  const params = new URLSearchParams({ limit: "12", sort: filters.sort });
  if (filters.country) params.set("country", filters.country);

  const response = await fetch(`/api/guestbook?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  const json = (await response.json()) as
    | GuestbookListResponse
    | GuestbookApiError;
  if (!response.ok) {
    throw new Error(
      "error" in json && json.error
        ? json.error
        : "Failed to fetch guestbook entries.",
    );
  }

  return (json as GuestbookListResponse).entries;
}

async function fetchCountries(): Promise<string[]> {
  const response = await fetch("/api/guestbook/countries", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return [];
  const json = (await response.json()) as { countries: string[] };
  return json.countries ?? [];
}

function countryToFlag(code: string | null) {
  if (!code || code.length !== 2) return null;
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...[...upper].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

function formatEntryDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function GuestbookEntryRow({
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
        "relative ml-1 min-w-0 border-quinary/30 border-l-2 pl-4",
        isLast ? "pb-0" : "pb-3",
      )}
    >
      {/* Timeline dot */}
      <div className="absolute top-[5px] -left-[5px] size-2 rounded-full bg-quinary" />

      {/* Author line */}
      <div className="flex items-baseline gap-2">
        <span className="shrink-0 font-mono text-muted-foreground/50 text-xs">
          #{String(index + 1).padStart(3, "0")}
        </span>
        {nameElement}
        {entry.country && (
          <span className="shrink-0 text-xs leading-none" title={entry.country}>
            {countryToFlag(entry.country)}
          </span>
        )}
        <span className="ml-auto whitespace-nowrap font-mono text-muted-foreground/40 text-xs">
          {formatEntryDate(entry.created_at)}
        </span>
      </div>

      {/* Message */}
      <p className="mt-0.5 whitespace-pre-wrap break-words text-muted-foreground text-xs leading-relaxed">
        {entry.message}
      </p>
    </div>
  );
}

function ReadSkeleton() {
  return (
    <AnimatedSpan className="gap-0">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative animate-pulse border-muted/40 border-l-2 pb-3 pl-4"
        >
          <div className="absolute top-[5px] -left-[5px] size-2 rounded-full bg-muted" />
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-6 rounded bg-muted" />
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="ml-auto h-2.5 w-28 rounded bg-muted" />
          </div>
          <div className="mt-1.5 h-3 w-3/4 rounded bg-muted" />
        </div>
      ))}
    </AnimatedSpan>
  );
}

function FilterPopover({
  filters,
  onChangeFilters,
}: {
  filters: GuestbookFilters;
  onChangeFilters: (f: GuestbookFilters) => void;
}) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { data: countries } = useQuery({
    queryKey: ["guestbook-countries"],
    queryFn: fetchCountries,
    staleTime: 60_000,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node))
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const hasActiveFilters = filters.sort !== "desc" || filters.country !== null;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 font-semibold text-xs ring-1 ring-inset transition-colors duration-200",
          hasActiveFilters
            ? "bg-quinary/20 text-quinary ring-quinary/30"
            : "bg-quinary/10 text-quinary ring-quinary/20 hover:bg-quinary/20",
        )}
        aria-label="Filter guestbook entries"
      >
        <Filter className="h-2.5 w-2.5" />
        filter
        {hasActiveFilters && (
          <span className="ml-0.5 size-1.5 rounded-full bg-quinary" />
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-1 grid min-w-[180px] gap-2 rounded-md border border-border/60 bg-background/95 p-2 shadow-lg backdrop-blur-sm">
          {/* Sort order */}
          <div className="grid gap-1">
            <span className="font-mono text-muted-foreground/60 text-xs uppercase tracking-wider">
              sort
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onChangeFilters({ ...filters, sort: "desc" })}
                className={cn(
                  "inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded px-2 py-1 font-semibold text-xs transition-colors duration-150",
                  filters.sort === "desc"
                    ? "bg-quinary/20 text-quinary ring-1 ring-quinary/30 ring-inset"
                    : "text-muted-foreground hover:bg-muted/50",
                )}
              >
                <ArrowDownNarrowWide className="h-2.5 w-2.5" />
                newest
              </button>
              <button
                type="button"
                onClick={() => onChangeFilters({ ...filters, sort: "asc" })}
                className={cn(
                  "inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded px-2 py-1 font-semibold text-xs transition-colors duration-150",
                  filters.sort === "asc"
                    ? "bg-quinary/20 text-quinary ring-1 ring-quinary/30 ring-inset"
                    : "text-muted-foreground hover:bg-muted/50",
                )}
              >
                <ArrowUpNarrowWide className="h-2.5 w-2.5" />
                oldest
              </button>
            </div>
          </div>

          {/* Country filter */}
          {countries && countries.length > 0 && (
            <div className="grid gap-1">
              <span className="font-mono text-muted-foreground/60 text-xs uppercase tracking-wider">
                country
              </span>
              <div className="flex gap-1">
                <select
                  value={filters.country ?? ""}
                  onChange={(e) =>
                    onChangeFilters({
                      ...filters,
                      country: e.target.value || null,
                    })
                  }
                  className="h-6 flex-1 cursor-pointer appearance-none rounded border border-border bg-transparent px-1.5 text-foreground text-xs outline-none focus-visible:ring-1 focus-visible:ring-quinary/60"
                >
                  <option value="">All countries</option>
                  {countries.map((code) => (
                    <option key={code} value={code}>
                      {countryToFlag(code)} {code}
                    </option>
                  ))}
                </select>
                {filters.country && (
                  <button
                    type="button"
                    onClick={() =>
                      onChangeFilters({ ...filters, country: null })
                    }
                    className="inline-flex size-6 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                    aria-label="Clear country filter"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Reset all */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => onChangeFilters({ sort: "desc", country: null })}
              className="cursor-pointer text-left font-mono text-muted-foreground/60 text-xs transition-colors hover:text-foreground"
            >
              reset filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

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
