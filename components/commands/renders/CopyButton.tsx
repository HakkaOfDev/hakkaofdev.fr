"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const t = useTranslations("Commands.clipboard");
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }

    setTimeout(() => setStatus("idle"), 2000);
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-primary/10 px-2 py-1 font-medium text-primary text-xs ring-1 ring-primary/20 ring-inset transition-colors duration-200 hover:bg-primary/20"
      aria-label={
        status === "copied"
          ? t("copiedAria")
          : status === "failed"
            ? t("copyFailedAria")
            : t("copyAria")
      }
    >
      {status === "copied" ? <Check size={12} /> : <Copy size={12} />}
      {status === "copied" && t("copiedNotice")}
      {status === "failed" && t("copyFailedNotice")}
      {status === "idle" && t("copy")}
    </button>
  );
}
