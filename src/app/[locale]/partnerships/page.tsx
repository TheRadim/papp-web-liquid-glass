import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { PartnershipsStory } from "@/components/partnerships/PartnershipsStory";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    locale,
    {
      title: { en: "Partnerships | Papp Mobility", da: "Partnerskaber | Papp Mobility" },
      description: {
        en: "Papp gathers parking and traffic data for consultancies, retailers and data companies. Book a meeting to talk about a partnership.",
        da: "Papp indsamler parkerings- og trafikdata for rådgivere, butikker og datavirksomheder. Book et møde om et partnerskab."
      }
    },
    "/partnerships"
  );
}

export default async function PartnershipsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <PartnershipsStory locale={locale} />;
}
