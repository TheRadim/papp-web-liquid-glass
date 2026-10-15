import type { Locale, LocalisedText } from "@/content/types";

const locales: Locale[] = ["en", "da"];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function pick(locale: Locale, text: LocalisedText): string {
  return text[locale] || text.en;
}
