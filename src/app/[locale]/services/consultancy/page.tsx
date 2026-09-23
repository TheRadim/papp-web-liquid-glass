import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/types";
import { getOfferingBySlug } from "@/lib/content/accessors";
import { MeetingRequest } from "@/components/contact/MeetingRequest";
import { Section } from "@/components/layout/Section";
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
  return <OfferingPage locale={locale} offering={offering} afterHero={<Section className="service-meeting-section"><MeetingRequest locale={locale} source="consultancy" /></Section>} />;
}
