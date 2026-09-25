import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { getHomepageContent } from "@/lib/content/accessors";
import { pageMetadata } from "@/lib/seo/metadata";
import { HomepageHero } from "@/components/hero/HomepageHero";
import { ProcessSection } from "@/components/positioning/ProcessSection";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HomeCategoryCards } from "@/components/home/HomeCategoryCards";
import { PartnerLogoLoop } from "@/components/social-proof/PartnerLogoLoop";
import { Button } from "@/components/ui/Button";
import { TestimonialsSection } from "@/components/social-proof/TestimonialsSection";
import { MeetingRequest } from "@/components/contact/MeetingRequest";
import { AppPromotion } from "@/components/app/AppPromotion";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    locale,
    {
      title: { en: "Papp Mobility | Mobility intelligence", da: "Papp Mobility | Mobilitetsindsigt" },
      description: {
        en: "Papp helps cities and operators understand movement, utilisation and parking through sensors, cameras, analytics and advisory services.",
        da: "Papp hjælper byer og operatører med at forstå bevægelse, udnyttelse og parkering gennem sensorer, kameraer, analyser og rådgivning."
      }
    },
    "/"
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const content = getHomepageContent(locale);

  return (
    <>
      <HomepageHero locale={locale} content={content.hero} />
      <ProcessSection content={content.process} locale={locale} />
      <TestimonialsSection locale={locale} />
      <Section id="solutions">
        <SectionHeading
          eyebrow={locale === "da" ? "Løsninger" : "Solutions"}
          title={locale === "da" ? "Teknologi og ekspertise i et samlet system." : "Technology and expertise in one connected system."}
          body={locale === "da" ? "Sensorer, kameraer, platform, analyse og rådgivning er bygget til at understøtte hinanden." : "Sensors, cameras, platform, analysis and consultancy are designed to support each other."}
          align="center"
        />
        <HomeCategoryCards locale={locale} />
      </Section>
      <Section className="partners-section">
        <SectionHeading
          eyebrow={locale === "da" ? "Samarbejder" : "Collaborations"}
          title={locale === "da" ? "Byer og partnere, der arbejder med bedre mobilitetsdata." : "Cities and partners working with better mobility data."}
          body={locale === "da" ? "Papp samarbejder med kommuner, operatører og rådgivere om at gøre bevægelse lettere at forstå." : "Papp works with municipalities, operators and advisors to make movement easier to understand."}
          align="center"
        />
        <PartnerLogoLoop />
      </Section>
      <Section tone="soft">
        <div className="feature-story">
          <div>
            <p className="eyebrow">{content.featured.eyebrow}</p>
            <h2>{content.featured.title}</h2>
            <p>{content.featured.body}</p>
          </div>
          <Button href={`/${locale}/projects`} variant="dark">{content.featured.cta}</Button>
        </div>
      </Section>
      <Section className="service-meeting-section home-meeting">
        <div id="contact"><MeetingRequest locale={locale} source="homepage" /></div>
      </Section>
      <AppPromotion locale={locale} content={content.app} />
    </>
  );
}
