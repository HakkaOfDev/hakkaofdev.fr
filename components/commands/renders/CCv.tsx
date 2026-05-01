"use client";

import { Download, Eye } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { CV_DOWNLOAD_URL, CV_PREVIEW_URL } from "@/lib/cv/cv-pdf.data";

function CCv() {
  const t = useTranslations("Commands.cv");
  return (
    <AnimatedSpan className="gap-2">
      <div className="flex flex-wrap gap-2">
        <Link
          href={CV_PREVIEW_URL}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-md bg-secondary/10 px-2.5 py-1 font-semibold text-secondary text-xs ring-1 ring-secondary/20 ring-inset transition-colors duration-200 hover:bg-secondary/20"
        >
          <Eye className="h-3.5 w-3.5" />
          {t("openPreview")}
        </Link>
        <Link
          href={CV_DOWNLOAD_URL}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 font-semibold text-primary text-xs ring-1 ring-primary/20 ring-inset transition-colors duration-200 hover:bg-primary/20"
        >
          <Download className="h-3.5 w-3.5" />
          {t("downloadPdf")}
        </Link>
      </div>
      <p className="text-muted-foreground/70 text-xs">
        {t("endpointsLabel")}{" "}
        <span className="font-mono">{CV_PREVIEW_URL}</span> {t("endpointsAnd")}{" "}
        <span className="font-mono">{CV_DOWNLOAD_URL}</span>
      </p>
    </AnimatedSpan>
  );
}

export default CCv;
