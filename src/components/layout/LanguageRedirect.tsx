"use client";

import { useEffect } from "react";
import { preferredLocale } from "@/lib/i18n/locales";
import { siteBasePath, withBasePath } from "@/lib/site/basePath";

/** Sends visitors of the bare domain to /da or /en, based on their browser language. */
export function LanguageRedirect() {
  useEffect(() => {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    const locale = preferredLocale(languages);
    // The GitHub Pages export uses trailing slashes.
    window.location.replace(withBasePath(`/${locale}${siteBasePath ? "/" : ""}`));
  }, []);

  return (
    <noscript>
      <p style={{ textAlign: "center", marginTop: "30vh", fontFamily: "sans-serif" }}>
        <a href={withBasePath("/da/")}>Dansk</a> · <a href={withBasePath("/en/")}>English</a>
      </p>
    </noscript>
  );
}
