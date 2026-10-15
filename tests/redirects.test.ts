import { describe, expect, it } from "vitest";
import { getProjects } from "@/lib/content/accessors";
import { serviceTopics } from "@/content/services/service-topics";
import { legacyRedirects, legacySourceVariants } from "@/lib/site/legacyRedirects";
import { preferredLocale } from "@/lib/i18n/locales";

const staticPages = ["", "/about", "/app", "/contact", "/privacy", "/projects", "/solutions", "/products/sensors", "/products/cameras", "/products/insights", "/services/analysis", "/services/consultancy"];

function pageExists(path: string) {
  const match = path.match(/^\/(da|en)(\/.*)?$/);
  if (!match) return false;
  const rest = match[2] ?? "";
  if (staticPages.includes(rest)) return true;
  const project = rest.match(/^\/projects\/([^/]+)$/);
  if (project) return getProjects("da").some((item) => item.slug === project[1]);
  const service = rest.match(/^\/services\/([^/]+)$/);
  if (service) return serviceTopics.some((topic) => topic.slug === service[1]);
  return false;
}

describe("legacy Wix redirects", () => {
  it("send every old address to a page that exists", () => {
    for (const { from, to } of legacyRedirects) {
      expect(pageExists(to), `${from} -> ${to}`).toBe(true);
    }
  });

  it("cover all eight old project pages", () => {
    expect(legacyRedirects.filter(({ from }) => from.startsWith("/projekter/"))).toHaveLength(8);
  });

  it("match encoded and unencoded forms of Danish letters", () => {
    expect(legacySourceVariants("/rådgivning")).toEqual(["/rådgivning", "/r%C3%A5dgivning", "/r%c3%a5dgivning"]);
  });
});

describe("browser language on the bare domain", () => {
  it("picks the first Danish or English preference", () => {
    expect(preferredLocale(["da-DK", "en-US"])).toBe("da");
    expect(preferredLocale(["en-GB", "da"])).toBe("en");
    expect(preferredLocale(["de-DE", "da"])).toBe("da");
    expect(preferredLocale(["fr-FR"])).toBe("en");
  });
});
