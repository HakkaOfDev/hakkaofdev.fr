"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Filter,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Select } from "@/components/ui/Select";
import { GuestbookClientService } from "@/lib/services";
import { cn } from "@/lib/utils";
import type { GuestbookFilters, SortOrder } from "@/types/guestbook";

type FilterProps = {
  filters: GuestbookFilters;
  onChangeFilters: (f: GuestbookFilters) => void;
  onClose?: () => void;
};

const SORT_OPTIONS: {
  value: SortOrder;
  slug: "newest" | "oldest";
  icon: typeof ArrowDownNarrowWide;
}[] = [
  { value: "desc", slug: "newest", icon: ArrowDownNarrowWide },
  { value: "asc", slug: "oldest", icon: ArrowUpNarrowWide },
];

function SortOrderFilter({ filters, onChangeFilters, onClose }: FilterProps) {
  const t = useTranslations("Guestbook.read.filter");
  return (
    <div className="grid gap-1.5">
      <span className="font-mono font-semibold text-quinary/70 text-xs uppercase tracking-wider">
        {t("sort")}
      </span>
      <div className="flex gap-1">
        {SORT_OPTIONS.map(({ value, slug, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              onChangeFilters({ ...filters, sort: value });
              onClose?.();
            }}
            className={cn(
              "inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md border px-2 py-1.5 font-semibold text-xs transition-colors duration-150",
              filters.sort === value
                ? "border-quinary/50 bg-quinary/20 text-quinary"
                : "border-border text-foreground/70 hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <Icon className="h-3 w-3" />
            {t(slug as never)}
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
  const t = useTranslations("Guestbook.read.filter");
  if (countries.length === 0) return null;

  return (
    <div className="grid gap-1.5">
      <span className="font-mono font-semibold text-quinary/70 text-xs uppercase tracking-wider">
        {t("country")}
      </span>
      <div className="flex gap-1">
        <Select
          wrapperClassName="flex-1"
          value={filters.country ?? ""}
          onChange={(event) => {
            onChangeFilters({
              ...filters,
              country: event.target.value || null,
            });
            onClose?.();
          }}
          className="h-7 border-border bg-muted/40 text-xs"
        >
          <option value="">{t("allCountries")}</option>
          {countries.map((code) => (
            <option key={code} value={code}>
              {GuestbookClientService.countryToFlag(code)} {code}
            </option>
          ))}
        </Select>
        {filters.country && (
          <button
            type="button"
            onClick={() => {
              onChangeFilters({ ...filters, country: null });
              onClose?.();
            }}
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-border text-foreground/70 transition-colors hover:bg-muted/60 hover:text-foreground"
            aria-label={t("clearCountry")}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export function FilterPopover({ filters, onChangeFilters }: FilterProps) {
  const t = useTranslations("Guestbook.read.filter");
  const [open, setOpen] = useState(false);

  const { data: countries } = useQuery({
    queryKey: ["guestbook-countries"],
    queryFn: GuestbookClientService.fetchCountries,
    staleTime: 60_000,
  });

  const hasActiveFilters = filters.sort !== "desc" || filters.country !== null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 font-semibold text-xs ring-1 ring-inset transition-colors duration-200",
            hasActiveFilters
              ? "bg-quinary/20 text-quinary ring-quinary/30"
              : "bg-quinary/10 text-quinary ring-quinary/20 hover:bg-quinary/20",
          )}
          aria-label={t("ariaLabel")}
        >
          <Filter className="h-2.5 w-2.5" />
          {t("label")}
          {hasActiveFilters && (
            <span className="ml-0.5 size-1.5 rounded-full bg-quinary" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="grid w-[200px] gap-2.5 rounded-lg border-quinary/40 bg-background/95 p-2.5 shadow-quinary/5 shadow-xl backdrop-blur-md"
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
