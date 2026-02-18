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
      {/* Timeline dot */}
      <div className="absolute -left-[5px] top-[5px] size-2 rounded-full bg-pink-500 dark:bg-pink-400" />

      {/* Author line */}
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

      {/* Message */}
      <p className="mt-0.5 text-xs text-muted-foreground whitespace-pre-wrap break-words leading-relaxed">
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
          className="border-l-2 border-muted/40 pl-4 relative pb-3 animate-pulse"
        >
          <div className="absolute -left-[5px] top-[5px] size-2 rounded-full bg-muted" />
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-6 rounded bg-muted" />
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-2.5 w-28 rounded bg-muted ml-auto" />
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
          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset transition-colors duration-200 cursor-pointer",
          hasActiveFilters
            ? "bg-pink-500/20 text-pink-500 dark:text-pink-400 ring-pink-500/30"
            : "bg-pink-500/10 text-pink-500 dark:text-pink-400 ring-pink-500/20 hover:bg-pink-500/20",
        )}
        aria-label="Filter guestbook entries"
      >
        <Filter className="h-2.5 w-2.5" />
        filter
        {hasActiveFilters && (
          <span className="ml-0.5 size-1.5 rounded-full bg-pink-500 dark:bg-pink-400" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-md border border-border/60 bg-background/95 backdrop-blur-sm shadow-lg p-2 grid gap-2">
          {/* Sort order */}
          <div className="grid gap-1">
            <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">
              sort
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onChangeFilters({ ...filters, sort: "desc" })}
                className={cn(
                  "flex-1 inline-flex items-center justify-center gap-1 rounded px-2 py-1 text-[10px] font-semibold transition-colors duration-150 cursor-pointer",
                  filters.sort === "desc"
                    ? "bg-pink-500/20 text-pink-500 dark:text-pink-400 ring-1 ring-inset ring-pink-500/30"
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
                  "flex-1 inline-flex items-center justify-center gap-1 rounded px-2 py-1 text-[10px] font-semibold transition-colors duration-150 cursor-pointer",
                  filters.sort === "asc"
                    ? "bg-pink-500/20 text-pink-500 dark:text-pink-400 ring-1 ring-inset ring-pink-500/30"
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
              <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">
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
                  className="flex-1 h-6 rounded border border-border bg-transparent px-1.5 text-[10px] text-foreground outline-none focus-visible:ring-1 focus-visible:ring-pink-500/60 cursor-pointer appearance-none"
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
                    className="inline-flex items-center justify-center size-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
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
              className="text-[10px] font-mono text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer text-left"
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
