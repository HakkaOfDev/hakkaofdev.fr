"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  ChevronDown,
  Filter,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { countryToFlag, fetchCountries } from "@/lib/services/guestbook-client";
import type { GuestbookFilters, SortOrder } from "@/lib/types/guestbook";
import { cn } from "@/lib/utils";

type FilterProps = {
  filters: GuestbookFilters;
  onChangeFilters: (f: GuestbookFilters) => void;
  onClose?: () => void;
};

const SORT_OPTIONS: {
  value: SortOrder;
  label: string;
  icon: typeof ArrowDownNarrowWide;
}[] = [
  { value: "desc", label: "newest", icon: ArrowDownNarrowWide },
  { value: "asc", label: "oldest", icon: ArrowUpNarrowWide },
];

function SortOrderFilter({ filters, onChangeFilters, onClose }: FilterProps) {
  return (
    <div className="grid gap-1.5">
      <span className="text-[10px] font-mono text-pink-500/70 dark:text-pink-400/70 uppercase tracking-wider font-semibold">
        sort
      </span>
      <div className="flex gap-1">
        {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              onChangeFilters({ ...filters, sort: value });
              onClose?.();
            }}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[10px] font-semibold transition-colors duration-150 cursor-pointer border",
              filters.sort === value
                ? "bg-pink-500/20 text-pink-500 dark:text-pink-400 border-pink-500/50"
                : "text-foreground/70 border-border hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CountryFilter({
  countries,
  filters,
  onChangeFilters,
  onClose,
}: FilterProps & { countries: string[] }) {
  if (countries.length === 0) return null;

  return (
    <div className="grid gap-1.5">
      <span className="text-[10px] font-mono text-pink-500/70 dark:text-pink-400/70 uppercase tracking-wider font-semibold">
        country
      </span>
      <div className="flex gap-1">
        <div className="relative flex-1">
          <select
            value={filters.country ?? ""}
            onChange={(e) => {
              onChangeFilters({
                ...filters,
                country: e.target.value || null,
              });
              onClose?.();
            }}
            className="w-full h-7 appearance-none rounded-md border border-border bg-muted/40 pl-2 pr-6 text-[11px] text-foreground outline-none cursor-pointer"
          >
            <option value="">All countries</option>
            {countries.map((code) => (
              <option key={code} value={code}>
                {countryToFlag(code)} {code}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-foreground/50" />
        </div>
        {filters.country && (
          <button
            type="button"
            onClick={() => {
              onChangeFilters({ ...filters, country: null });
              onClose?.();
            }}
            className="inline-flex items-center justify-center size-7 rounded-md border border-border text-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            aria-label="Clear country filter"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export function FilterPopover({ filters, onChangeFilters }: FilterProps) {
  const [open, setOpen] = useState(false);

  const { data: countries } = useQuery({
    queryKey: ["guestbook-countries"],
    queryFn: fetchCountries,
    staleTime: 60_000,
  });

  const hasActiveFilters = filters.sort !== "desc" || filters.country !== null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
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
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-[200px] rounded-lg border-pink-500/40 bg-background/95 backdrop-blur-md shadow-xl shadow-pink-500/5 p-2.5 grid gap-2.5"
      >
        <SortOrderFilter
          filters={filters}
          onChangeFilters={onChangeFilters}
          onClose={() => setOpen(false)}
        />

        {countries && (
          <CountryFilter
            countries={countries}
            filters={filters}
            onChangeFilters={onChangeFilters}
            onClose={() => setOpen(false)}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
