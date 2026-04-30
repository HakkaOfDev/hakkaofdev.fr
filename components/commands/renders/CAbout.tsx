"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { HOBBIES, LANGUAGES, SITE } from "@/lib/constants";

const BIRTH_DATE = new Date("2002-12-24");

function CAbout() {
  const t = useTranslations("Commands.about");
  const tMeta = useTranslations("Metadata");
  const ageYears = Math.floor(
    (Date.now() - BIRTH_DATE.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
  );

  return (
    <AnimatedSpan className="gap-1">
      <Info title={t("firstName")} value="Alexandre" />
      <Info title={t("lastName")} value="Gossard" />
      <Info title={t("age")} value={t("yearsOld", { years: ageYears })} />
      <Info title={t("location")} value={tMeta("location")} />
      <p className="text-muted-foreground">
        {t("email")}:{" "}
        <Link
          href={`mailto:${SITE.email}`}
          className="font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
        >
          {SITE.email}
        </Link>
      </p>
      <Info
        title={t("languages")}
        value={LANGUAGES.map((lang) => `${lang.lang} (${lang.level})`).join(
          ", ",
        )}
      />
      <Info title={t("hobbies")} value={HOBBIES.join(", ")} />
    </AnimatedSpan>
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
