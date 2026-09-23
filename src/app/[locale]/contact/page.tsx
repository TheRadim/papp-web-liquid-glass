import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { pageMetadata } from "@/lib/seo/metadata";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFloatingBalls } from "@/components/contact/ContactFloatingBalls";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    locale,
    {
      title: { en: "Contact | Papp Mobility", da: "Kontakt | Papp Mobility" },
      description: { en: "Contact Papp Mobility about sensors, camera analytics, Insights, analysis or consultancy.", da: "Kontakt Papp Mobility om sensorer, kameraanalyse, Insights, analyse eller rådgivning." }
    },
    "/contact"
  );
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const mapQuery = encodeURIComponent("Papp Headquarters, Rytoften 5, 8210 Aarhus, Denmark");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <Section className="contact-page-section">
      <ContactFloatingBalls />
      <div className="contact-page-grid">
        <div>
          <SectionHeading
            eyebrow={locale === "da" ? "Kontakt" : "Contact"}
            title={locale === "da" ? "Fortæl os, hvad I har brug for at forstå." : "Tell us what you need to understand."}
            body={locale === "da" ? "Del området, spørgsmålet eller beslutningen, I arbejder med. Så finder vi den rigtige måde at måle og analysere på." : "Share the site, question or decision you are working on. We will help shape the right way to measure and analyse it."}
          />
          <div className="contact-page-details" aria-label={locale === "da" ? "Virksomhedsoplysninger" : "Company details"}>
            <p>
              <strong>{locale === "da" ? "Adresse" : "Address"}</strong>
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                Papp Headquarters · Rytoften 5, 2 sal · 8210 Aarhus
              </a>
            </p>
          </div>
          <div className="contact-map" aria-label={locale === "da" ? "Kort til Papp Mobility" : "Map to Papp Mobility"}>
            <iframe
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              title={locale === "da" ? "Papp Mobility adresse" : "Papp Mobility address"}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <ContactForm locale={locale} />
      </div>
    </Section>
  );
}
