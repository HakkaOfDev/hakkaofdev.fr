import { Heart } from "lucide-react";
import Link from "next/link";
import { GITHUB_URL, SITE, SOCIALS } from "@/lib/constants";

function Footer() {
  return (
    <div className="flex flex-col justify-center items-center gap-3 pt-6 pb-4">
      <div className="flex gap-3 items-center">
        {SOCIALS.map((social) => (
          <Link
            key={social.name}
            href={social.url}
            className="text-muted-foreground/50 hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95"
            target="_blank"
            aria-label={social.name}
          >
            <social.icon size={18} />
            <span className="sr-only">{social.name}</span>
          </Link>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground/80">
        Made with <Heart className="inline-block text-chart-1" size={14} /> by{" "}
        <Link
          href={GITHUB_URL}
          className="text-chart-1/80 hover:text-chart-1 font-medium transition-colors duration-200"
        >
          {SITE.name}
        </Link>
      </p>
    </div>
  );
}

export default Footer;
