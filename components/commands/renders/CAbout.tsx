"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatedSpan, TypeLines } from "@/components/AnimatedComponents";
import { useGrep, useGrepRaw } from "@/components/providers/PipelineProvider";
import { HOBBIES, LANGUAGES, SITE } from "@/lib/constants";
import { matchesGrep } from "@/lib/utils/grep.utils";

const BIRTH_DATE = new Date("2002-12-24");

function CAbout() {
  const t = useTranslations("Commands.about");
  const tCommands = useTranslations("Commands");
  const tMeta = useTranslations("Metadata");
  const tHobbies = useTranslations("CV.hobbies");
  const tLanguages = useTranslations("CV.spokenLanguages");
  const tLevels = useTranslations("CV.languageLevels");
  const grep = useGrep();
  const grepRaw = useGrepRaw();

  const ageYears = Math.floor(
    (Date.now() - BIRTH_DATE.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
  );

  const hobbies = HOBBIES.map((slug) => tHobbies(slug as never)).join(", ");
  const languages = LANGUAGES.map((lang) => {
    const name = tLanguages(lang.code as never);
    const level = tLevels(lang.levelSlug as never);
    return `${lang.flag} ${name} (${level})`;
  }).join(", ");

  const rows: Array<{ key: string; title: string; value: string }> = [
    { key: "firstName", title: t("firstName"), value: "Alexandre" },
    { key: "lastName", title: t("lastName"), value: "Gossard" },
    {
      key: "age",
      title: t("age"),
      value: t("yearsOld", { years: ageYears }),
    },
    { key: "location", title: t("location"), value: tMeta("location") },
    { key: "email", title: t("email"), value: SITE.email },
    { key: "languages", title: t("languages"), value: languages },
    { key: "hobbies", title: t("hobbies"), value: hobbies },
  ];

  const visible = grep
    ? rows.filter((row) => matchesGrep(`${row.title} ${row.value}`, grep))
    : rows;

  if (grep && visible.length === 0) {
    return (
      <AnimatedSpan>
        <p className="text-muted-foreground text-xs">
          {tCommands("noMatches", { pattern: grepRaw })}
        </p>
      </AnimatedSpan>
    );
  }

  return (
    <TypeLines
      className="gap-1"
      lines={visible.map((row) =>
        row.key === "email" ? (
          <p key={row.key} className="text-muted-foreground">
            {row.title}:{" "}
            <Link
              href={`mailto:${SITE.email}`}
              className="font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
            >
              {SITE.email}
            </Link>
          </p>
        ) : (
          <Info key={row.key} title={row.title} value={row.value} />
        ),
      )}
    />
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <p className="text-muted-foreground">
      {title}: <span className="font-semibold text-foreground">{value}</span>
    </p>
  );
}

export default CAbout;
