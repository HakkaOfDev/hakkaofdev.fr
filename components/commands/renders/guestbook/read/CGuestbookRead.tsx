"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Guestbook.read");
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
          <span className="font-semibold text-quinary">{t("headerLabel")}</span>
          <span className="text-muted-foreground/40"> — </span>
          {data ? t("entry", { count: data.length }) : t("unavailable")}
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
            aria-label={t("refreshAria")}
          >
            <RefreshCcw
              className={cn("h-2.5 w-2.5", isFetching && "animate-spin")}
            />
            {t("refresh")}
          </button>
        </div>
      </div>

      {/* Error */}
      {isError && (
        <p className="font-mono text-destructive text-xs">
          <span className="text-destructive/60">{t("errorPrefix")}</span>{" "}
          {error instanceof Error ? error.message : t("errorFallback")}
        </p>
      )}

      {/* Empty */}
      {data && data.length === 0 && (
        <p className="inline-flex flex-wrap items-center gap-1.5 font-mono text-muted-foreground text-xs">
          <span className="text-muted-foreground/40">~</span>
          {filters.country ? (
            <>
              {t("noneFromCountryPrefix")}{" "}
              <span className="font-semibold">
                {GuestbookClientService.countryToFlag(filters.country)}{" "}
                {filters.country}
              </span>
              {t("noneFromCountrySuffix")}
            </>
          ) : (
            <>
              {t("noneYetPrefix")}{" "}
              <Shortcut
                label="guestbook sign"
                command="guestbook sign"
                variant="pink"
                className="px-1.5 py-0 text-xs"
              />{" "}
              {t("noneYetSuffix")}
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
