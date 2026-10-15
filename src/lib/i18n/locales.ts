import type { Locale, LocalisedText } from "@/content/types";

const locales: Locale[] = ["en", "da"];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function pick(locale: Locale, text: LocalisedText): string {
  return text[locale] || text.en;
}

/**
 * Picks the site language from the browser's preferred languages, in order:
 * the first Danish or English entry wins. Anything else falls back to English.
 */
export function preferredLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const primary = language.toLowerCase().split("-")[0];
    if (isLocale(primary)) return primary;
  }
  return "en";
}
