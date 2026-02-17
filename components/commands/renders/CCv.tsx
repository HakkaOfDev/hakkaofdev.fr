import { Download, Eye } from "lucide-react";
import Link from "next/link";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { CV_DOWNLOAD_URL, CV_PREVIEW_URL } from "@/lib/cv/cv-pdf.data";

function CCv() {
  return (
    <AnimatedSpan className="gap-2">
      <div className="flex flex-wrap gap-2">
        <Link
          href={CV_PREVIEW_URL}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset bg-chart-2/10 text-chart-2 ring-chart-2/20 hover:bg-chart-2/20 transition-colors duration-200"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview CV
        </Link>
        <Link
          href={CV_DOWNLOAD_URL}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset bg-chart-1/10 text-chart-1 ring-chart-1/20 hover:bg-chart-1/20 transition-colors duration-200"
        >
          <Download className="h-3.5 w-3.5" />
          Download CV
        </Link>
      </div>
    </AnimatedSpan>
  );
}

export default CCv;
