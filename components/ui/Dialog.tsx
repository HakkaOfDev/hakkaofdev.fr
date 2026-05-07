"use client";

import { AnimatePresence, cubicBezier, m, useIsPresent } from "motion/react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  headerActions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const DIALOG_TRANSITION = {
  duration: 0.18,
  ease: cubicBezier(0.25, 0.1, 0.25, 1),
};

function Dialog({
  open,
  onOpenChange,
  title,
  description,
  headerActions,
  className,
  style,
  children,
}: DialogProps) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <DialogOverlay
          key="dialog"
          onOpenChange={onOpenChange}
          titleId={titleId}
          descriptionId={descriptionId}
          title={title}
          description={description}
          headerActions={headerActions}
          className={className}
          style={style}
        >
          {children}
        </DialogOverlay>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function DialogOverlay({
  onOpenChange,
  titleId,
  descriptionId,
  title,
  description,
  headerActions,
  className,
  style,
  children,
}: Omit<DialogProps, "open"> & {
  titleId: string;
  descriptionId: string;
}) {
  const isPresent = useIsPresent();

  return (
    <m.div
      className={cn("fixed inset-0 z-100", !isPresent && "pointer-events-none")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={DIALOG_TRANSITION}
    >
      <m.button
        type="button"
        className="absolute inset-0 bg-background/4 backdrop-blur-xs"
        aria-label="Close dialog backdrop"
        onClick={() => onOpenChange(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={DIALOG_TRANSITION}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <m.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            "terminal-scrollbar pointer-events-auto max-h-[calc(100dvh-4rem)] w-full max-w-md overflow-auto rounded-2xl border border-border/50 bg-background p-4 shadow-2xl dark:border-overlay-medium dark:bg-background",
            className,
          )}
          style={style}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={DIALOG_TRANSITION}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2
                id={titleId}
                className="font-semibold text-foreground text-sm"
              >
                {title}
              </h2>
              {description ? (
                <p id={descriptionId} className="text-muted-foreground text-xs">
                  {description}
                </p>
              ) : null}
            </div>
            {headerActions ? (
              <div className="flex items-center gap-1">{headerActions}</div>
            ) : null}
          </div>

          {children}
        </m.div>
      </div>
    </m.div>
  );
}

export { Dialog };
