"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { SITE, SOCIALS } from "@/lib/constants";
import { filterByGrep, matchesGrep } from "@/lib/utils/grep.utils";

function getDisplayLink(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "");
}

function CContact() {
  const t = useTranslations("Commands.contact");
  const tCommands = useTranslations("Commands");
  const tMeta = useTranslations("Metadata");
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const visibleSocials = filterByGrep(SOCIALS, grep, (s) => [s.name, s.url]);

  const showIntro = !grep || matchesGrep(t("intro"), grep);
  const showEmail =
    !grep || matchesGrep(`${t("primaryEmail")} ${SITE.email}`, grep);
  const showLocation =
    !grep || matchesGrep(`${t("location")} ${tMeta("location")}`, grep);
  const showSocialsHeader =
    !grep ||
    matchesGrep(t("socialProfiles"), grep) ||
    visibleSocials.length > 0;

  const anythingVisible =
    showIntro || showEmail || showLocation || visibleSocials.length > 0;

  if (grep && !anythingVisible) {
    return (
      <AnimatedSpan>
        <p className="text-muted-foreground text-xs">
          {tCommands("noMatches", { pattern: grepRaw })}
        </p>
      </AnimatedSpan>
    );
  }

  return (
    <AnimatedSpan className="gap-2">
      {showIntro && <p className="text-muted-foreground">{t("intro")}</p>}

      {showEmail && (
        <p className="text-muted-foreground">
          {t("primaryEmail")}{" "}
          <Link
            href={`mailto:${SITE.email}`}
            dir="ltr"
            className="font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
          >
            {SITE.email}
          </Link>
        </p>
      )}
      {showLocation && (
        <p className="text-muted-foreground">
          {t("location")}{" "}
          <span className="font-semibold text-foreground">
            {tMeta("location")}
          </span>
        </p>
      )}

      {showSocialsHeader && visibleSocials.length > 0 && (
        <>
          <p className="text-muted-foreground">{t("socialProfiles")}</p>
          <ul className="grid list-disc gap-1 ps-4">
            {visibleSocials.map((social) => (
              <li key={social.name}>
                <Link
                  href={social.url}
                  target="_blank"
                  className="font-semibold text-secondary transition-colors duration-200 hover:text-secondary/80"
                >
                  {social.name}
                </Link>
                <span className="text-muted-foreground" dir="ltr">
                  {" "}
                  · {getDisplayLink(social.url)}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </AnimatedSpan>
  );
}

export default CContact;
