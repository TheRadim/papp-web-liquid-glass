import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/types";
import { getOfferingBySlug } from "@/lib/content/accessors";
import { InsightsDataLab } from "@/components/offerings/InsightsDataLab";
import { OfferingPage } from "@/components/offerings/OfferingPage";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const offering = getOfferingBySlug(locale, "insights");
  if (!offering) return {};
  return pageMetadata(locale, offering.seo, "/products/insights");
}

export default async function InsightsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const offering = getOfferingBySlug(locale, "insights");
  if (!offering) notFound();
  return <OfferingPage locale={locale} offering={offering} primaryCtaHref="#insights-meeting" afterHero={<InsightsDataLab locale={locale} />} hideDetailSections />;
}
