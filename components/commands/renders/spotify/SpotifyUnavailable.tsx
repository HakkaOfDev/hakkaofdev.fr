"use client";

import { useTranslations } from "next-intl";

export default function SpotifyUnavailable() {
  const t = useTranslations("Spotify");
  return <p className="text-destructive">{t("unavailable")}</p>;
}
