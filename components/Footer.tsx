import { Heart } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { GITHUB_URL, SITE, SOCIALS } from "@/lib/constants";

async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <div className="flex flex-col items-center justify-center gap-3 pt-6 pb-4">
      <div className="flex items-center gap-3">
        {SOCIALS.map((social) => (
          <Link
            key={social.name}
            href={social.url}
            className="text-muted-foreground/50 transition-all duration-200 hover:scale-110 hover:text-foreground active:scale-95"
            target="_blank"
            aria-label={social.name}
          >
            <social.icon size={18} />
            <span className="sr-only">{social.name}</span>
          </Link>
        ))}
      </div>
      <p className="text-muted-foreground/80 text-xs">
        {t.rich("madeBy", {
          heart: () => (
            <Heart className="inline-block text-primary" size={14} />
          ),
          name: () => (
            <Link
              href={GITHUB_URL}
              className="font-medium text-primary/80 transition-colors duration-200 hover:text-primary"
            >
              {SITE.name}
            </Link>
          ),
        })}
      </p>
    </div>
  );
}

export default Footer;
