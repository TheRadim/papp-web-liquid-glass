import type { Metadata } from "next";
import type { Locale, SeoContent } from "@/content/types";
import { pick } from "@/lib/i18n/locales";

const siteUrl = "https://theradim.github.io/papp-web-liquid-glass";
const socialImage = `${siteUrl}/images/social/papp-mobility.png`;

export function pageMetadata(locale: Locale, seo: SeoContent, path: string): Metadata {
  const title = pick(locale, seo.title);
  const description = pick(locale, seo.description);
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${siteUrl}/${locale}${cleanPath === "/" ? "" : cleanPath}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en${cleanPath === "/" ? "" : cleanPath}`,
        da: `${siteUrl}/da${cleanPath === "/" ? "" : cleanPath}`
      }
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Papp Mobility",
      locale,
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Papp Mobility" }]
    },
    twitter: { card: "summary_large_image", title, description, images: [socialImage] }
  };
}
