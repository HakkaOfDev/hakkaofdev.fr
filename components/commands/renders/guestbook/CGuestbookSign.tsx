"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { Shortcut } from "@/components/ui/Shortcut";
import { GUESTBOOK_CONFIG } from "@/lib/constants/guestbook.constants";
import {
  buildGuestbookFormSchema,
  type GuestbookFormValues,
} from "@/lib/schemas/guestbook.schema";
import { cn } from "@/lib/utils";

type GuestbookCreateResponse = {
  ok: boolean;
  status: "published" | "pending_moderation";
};

type GuestbookApiError = {
  error?: string;
};

async function createGuestbookEntry(
  payload: GuestbookFormValues,
  fallbackError: string,
) {
  const response = await fetch("/api/guestbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await response.json()) as
    | GuestbookCreateResponse
    | GuestbookApiError;
  if (!response.ok) {
    throw new Error(
      "error" in json && json.error ? json.error : fallbackError,
    );
  }

  return json as GuestbookCreateResponse;
}

function CGuestbookSign() {
  const t = useTranslations("Guestbook.sign");
  const tValidation = useTranslations("Guestbook.validation");
  const queryClient = useQueryClient();
  const [submitMessage, setSubmitMessage] = useState<ReactNode | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const schema = useMemo(
    () => buildGuestbookFormSchema(tValidation),
    [tValidation],
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<GuestbookFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", message: "", website: "", company: "" },
    mode: "onChange",
  });

  const messageValue = watch("message");
  const messageLength = [...(messageValue ?? "")].length;

  const createMutation = useMutation({
    mutationFn: (values: GuestbookFormValues) =>
      createGuestbookEntry(values, t("submitFailed")),
    onSuccess: (result) => {
      setSubmitMessage(
        result.status === "pending_moderation" ? (
          t("submitPending")
        ) : (
          <span className="inline-flex flex-wrap items-center gap-1.5">
            {t("submitPublishedPrefix")}
            <Shortcut
              label="guestbook read"
              command="guestbook read"
              variant="pink"
              className="px-1.5 py-0 text-xs"
            />
          </span>
        ),
      );
      reset();
      queryClient.invalidateQueries({ queryKey: ["guestbook-entries"] });
    },
    onError: (error) => {
      setSubmitMessage(
        error instanceof Error ? error.message : t("submitFailed"),
      );
    },
  });

  const onSubmit = (data: GuestbookFormValues) => {
    setSubmitMessage(null);
    createMutation.mutate({
      ...data,
      company: honeypotRef.current?.value,
    });
  };

  const firstFieldError =
    errors.name?.message ?? errors.message?.message ?? errors.website?.message;

  return (
    <AnimatedSpan className="gap-3">
      <p className="text-muted-foreground text-xs">{t("intro")}</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-2 rounded-md border border-border/60 p-3"
      >
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <input
            {...register("name")}
            type="text"
            placeholder={t("namePlaceholder")}
            className={cn(
              "h-8 rounded-md border bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-primary/60",
              errors.name ? "border-destructive/60" : "border-border",
            )}
            maxLength={GUESTBOOK_CONFIG.MAX_NAME_LENGTH}
          />
          <input
            {...register("website")}
            type="text"
            placeholder={t("websitePlaceholder")}
            className={cn(
              "h-8 rounded-md border bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-primary/60",
              errors.website ? "border-destructive/60" : "border-border",
            )}
            maxLength={GUESTBOOK_CONFIG.MAX_WEBSITE_LENGTH}
          />
        </div>

        <textarea
          {...register("message")}
          placeholder={t("messagePlaceholder")}
          className={cn(
            "min-h-20 resize-y rounded-md border bg-transparent px-2 py-1.5 text-xs outline-none focus-visible:ring-1 focus-visible:ring-primary/60",
            errors.message ? "border-destructive/60" : "border-border",
          )}
          maxLength={GUESTBOOK_CONFIG.MAX_MESSAGE_LENGTH}
        />

        {/* Honeypot — invisible to users, catches bots that auto-fill every field */}
        <input
          ref={honeypotRef}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
          aria-hidden
        />

        <div className="flex items-center justify-between gap-3">
          <p
            className={cn(
              "text-xs",
              submitMessage
                ? createMutation.isError
                  ? "text-destructive"
                  : "text-primary"
                : firstFieldError
                  ? "text-destructive"
                  : "text-muted-foreground/70",
            )}
          >
            {submitMessage ?? firstFieldError ?? (
              <span
                className={
                  messageLength > GUESTBOOK_CONFIG.MAX_MESSAGE_LENGTH
                    ? "text-destructive"
                    : ""
                }
              >
                {messageLength}{" "}
                <span>/ {GUESTBOOK_CONFIG.MAX_MESSAGE_LENGTH}</span>
              </span>
            )}
          </p>
          <button
            type="submit"
            disabled={createMutation.isPending || !isValid}
            className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md bg-primary/10 px-2.5 py-1 font-semibold text-primary text-xs ring-1 ring-primary/20 ring-inset transition-colors duration-200 hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createMutation.isPending && (
              <Loader2 className="h-3 w-3 animate-spin" />
            )}
            {t("submit")}
          </button>
        </div>
      </form>
    </AnimatedSpan>
  );
}

export default CGuestbookSign;
