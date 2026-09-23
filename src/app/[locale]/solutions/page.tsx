import type { Metadata } from "next";
import type { Locale, Offering } from "@/content/types";
import { getOfferings } from "@/lib/content/accessors";
import { pageMetadata } from "@/lib/seo/metadata";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SolutionOutcomes } from "@/components/offerings/SolutionOutcomes";
import { OfferingFeature } from "@/components/offerings/OfferingFeature";
import { MobilityCityVisual } from "@/components/hero/MobilityCityVisual";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    locale,
    {
      title: { en: "Solutions | Papp Mobility", da: "Løsninger | Papp Mobility" },
      description: {
        en: "Explore Papp Mobility solutions for sensors, cameras, insights, analysis and advisory.",
        da: "Udforsk Papp Mobilitys løsninger til sensorer, kameraer, indsigter, analyse og rådgivning."
      }
    },
    "/solutions"
  );
}

export default async function SolutionsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const order = ["insights", "cameras", "sensors", "analysis", "consultancy"];
  const offerings = [...getOfferings()].sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));

  const app: Offering = { ...offerings[0], slug: "app", name: { en: "Papp App", da: "Papp App" }, eyebrow: { en: "For drivers", da: "Til bilister" }, heroImage: "/images/app/feature-1.webp", introduction: { en: "Help drivers find available parking before they arrive. A public view of the places where Papp measures occupancy.", da: "Hjælp bilister med at finde ledig parkering, før de ankommer. Et offentligt overblik over de steder, hvor Papp måler belægning." }, benefits: [{ en: "Live availability at participating locations", da: "Aktuel ledighed på tilknyttede lokationer" }, { en: "Available for iPhone and Android", da: "Til iPhone og Android" }] };
  offerings.splice(3, 0, app);

  return (
    <>
      <Section className="solutions-overview">
        <div className="solutions-hero-grid">
          <SectionHeading
            eyebrow={locale === "da" ? "Løsninger" : "Solutions"}
            title={locale === "da" ? "Fra måling til næste beslutning." : "From measurement to the next decision."}
            body={
              locale === "da"
                ? "Forstå, hvordan steder bruges, find ledig kapacitet og omsæt målt adfærd til et klart næste skridt."
                : "Understand how places are used, uncover capacity and turn measured behaviour into a clear next step."
            }
            align="center"
          />
        </div>
        <div className="solutions-city-panel">
          <MobilityCityVisual locale={locale} className="mobility-city--solutions" />
        </div>
      </Section>
      <Section className="solutions-outcomes-section"><SolutionOutcomes locale={locale} /></Section>
      <Section className="solutions-listing" tone="soft">
        <div className="offerings-stack">
          {offerings.map((offering, index) => (
            <OfferingFeature key={offering.slug} offering={offering} locale={locale} index={index} />
          ))}
        </div>
      </Section>
    </>
  );
}
