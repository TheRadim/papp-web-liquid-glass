import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/types";
import { getServiceTopic, serviceTopics } from "@/content/services/service-topics";
import { ServiceTopicPage } from "@/components/offerings/ServiceTopicPage";
import { pageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return serviceTopics.flatMap((topic) => [
    { locale: "en", slug: topic.slug },
    { locale: "da", slug: topic.slug }
  ]);
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const topic = getServiceTopic(slug);
  if (!topic) return {};
  return pageMetadata(locale, topic.seo, `/services/${topic.slug}`);
}

export default async function ServiceTopicRoute({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const topic = getServiceTopic(slug);
  if (!topic) notFound();
  return <ServiceTopicPage locale={locale} topic={topic} />;
}
