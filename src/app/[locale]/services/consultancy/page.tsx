import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/types";
import { getOfferingBySlug } from "@/lib/content/accessors";
import { ServiceStory } from "@/components/offerings/ServiceStory";
import { OfferingPage } from "@/components/offerings/OfferingPage";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const offering = getOfferingBySlug(locale, "consultancy");
  if (!offering) return {};
  return pageMetadata(locale, offering.seo, "/services/consultancy");
}

export default async function ConsultancyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const offering = getOfferingBySlug(locale, "consultancy");
  if (!offering) notFound();
  return <OfferingPage locale={locale} offering={offering} hideDetailSections afterHero={<ServiceStory locale={locale} kind="consultancy" />} />;
}
