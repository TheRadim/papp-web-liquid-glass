import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content/accessors";
import { serviceTopics } from "@/content/services/service-topics";

export const dynamic = "force-static";

const baseUrl = "https://www.pappmobility.com";
const staticPaths = [
  "",
  "/solutions",
  "/products/sensors",
  "/products/cameras",
  "/products/insights",
  "/services/analysis",
  "/services/consultancy",
  ...serviceTopics.map((topic) => `/services/${topic.slug}`),
  "/projects",
  "/app",
  "/about",
  "/contact",
  "/privacy"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["en", "da"].flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7
    }))
  );

  const projects = ["en", "da"].flatMap((locale) =>
    getProjects(locale as "en" | "da").map((project) => ({
      url: `${baseUrl}/${locale}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  );

  return [...pages, ...projects];
}
