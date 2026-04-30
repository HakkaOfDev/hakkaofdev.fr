import {
  de,
  enUS,
  es,
  fr,
  it,
  ja,
  pt,
  zhCN,
  type Locale as DateFnsLocale,
} from "date-fns/locale";
import type { Locale } from "./routing";

export const dateLocaleMap: Record<Locale, DateFnsLocale> = {
  en: enUS,
  fr,
  es,
  de,
  pt,
  it,
  zh: zhCN,
  ja,
};
