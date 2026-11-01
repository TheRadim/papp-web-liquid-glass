import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { ApiProduct } from "@/components/offerings/ApiProduct";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    locale,
    {
      title: { en: "Papp API | Papp Mobility", da: "Papp API | Papp Mobility" },
      description: {
        en: "Live and historical parking and traffic data from Papp cameras and sensors, delivered to your own systems through a secure API.",
        da: "Live og historiske parkerings- og trafikdata fra Papps kameraer og sensorer, leveret til jeres egne systemer via et sikkert API."
      }
    },
    "/products/api"
  );
}

export default async function ApiPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <ApiProduct locale={locale} />;
}
