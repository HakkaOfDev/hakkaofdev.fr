"use client";

import { AnimatedSpan } from "@/components/AnimatedComponents";

interface ThemeCreateSuccessProps {
  themeName: string;
}

export function ThemeCreateSuccess({ themeName }: ThemeCreateSuccessProps) {
  return (
    <AnimatedSpan className="gap-1">
      <p className="text-muted-foreground">
        Custom theme{" "}
        <span className="font-semibold text-foreground">{themeName}</span>{" "}
        created and applied.
      </p>
      <p className="text-[10px] text-muted-foreground/50">
        It will persist in your browser&apos;s localStorage.
      </p>
    </AnimatedSpan>
  );
}

interface ThemeCreateErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

export function ThemeCreateError({
  errorMessage,
  onRetry,
}: ThemeCreateErrorProps) {
  return (
    <AnimatedSpan className="gap-2">
      <p className="text-destructive">{errorMessage}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex w-fit cursor-pointer items-center gap-1 rounded-md bg-primary/10 px-3 py-1 font-semibold text-[11px] text-primary ring-1 ring-primary/20 ring-inset transition-colors hover:bg-primary/20"
      >
        Try Again
      </button>
    </AnimatedSpan>
  );
}
