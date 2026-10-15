import data from "@/config/legacy-redirects.json";

export interface LegacyRedirect {
  from: string;
  to: string;
}

export const legacyRedirects: LegacyRedirect[] = data.redirects;

/**
 * Every form an old address can arrive in: as written (ø), and percent-encoded
 * with upper- or lower-case hex (%C3%B8 / %c3%b8, Wix used both).
 */
export function legacySourceVariants(path: string): string[] {
  const encoded = encodeURI(path);
  return [...new Set([path, encoded, encoded.replace(/%[0-9A-F]{2}/g, (hex) => hex.toLowerCase())])];
}
