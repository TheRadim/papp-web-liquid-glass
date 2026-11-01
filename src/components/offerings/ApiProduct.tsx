import { Activity, Bell, Car, Clock, Download, KeyRound, MapPinned, CircleParking, type LucideIcon } from "lucide-react";
import type { Locale, LocalisedText } from "@/content/types";
import { pick } from "@/lib/i18n/locales";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { MeetingRequest } from "@/components/contact/MeetingRequest";

interface Capability {
  icon: LucideIcon;
  title: LocalisedText;
  body: LocalisedText;
}

const capabilities: Capability[] = [
  {
    icon: CircleParking,
    title: { en: "Live occupancy", da: "Live belægning" },
    body: {
      en: "Free and occupied spaces per site, zone or single bay, updated as cars arrive and leave.",
      da: "Ledige og optagne pladser pr. område, zone eller enkelt bås, opdateret når biler kommer og kører."
    }
  },
  {
    icon: Car,
    title: { en: "Counts and flow", da: "Tællinger og flow" },
    body: {
      en: "Entries and exits, vehicles, bikes and pedestrians, and direction of travel from our cameras.",
      da: "Ind- og udkørsler, biler, cykler og fodgængere samt kørselsretning fra vores kameraer."
    }
  },
  {
    icon: Clock,
    title: { en: "History and aggregates", da: "Historik og aggregeringer" },
    body: {
      en: "Hourly, daily and weekly series for utilisation, peaks and average stay, ready for your own analysis.",
      da: "Time-, dags- og ugeserier for udnyttelse, spidsbelastning og gennemsnitlig opholdstid, klar til jeres egne analyser."
    }
  },
  {
    icon: MapPinned,
    title: { en: "Visitor origins", da: "Besøgendes oprindelse" },
    body: {
      en: "Where visitors come from, aggregated by municipality or postcode, never by individual vehicle.",
      da: "Hvor besøgende kommer fra, samlet pr. kommune eller postnummer, aldrig pr. køretøj."
    }
  },
  {
    icon: Bell,
    title: { en: "Webhooks", da: "Webhooks" },
    body: {
      en: "Get notified when a zone is nearly full, a threshold is crossed or a device needs attention.",
      da: "Få besked, når en zone er ved at være fuld, en grænse overskrides eller en enhed kræver opmærksomhed."
    }
  },
  {
    icon: Download,
    title: { en: "Exports", da: "Eksport" },
    body: {
      en: "CSV and JSON exports for BI tools such as Power BI, or for open-data portals.",
      da: "CSV- og JSON-eksport til BI-værktøjer som Power BI eller til åbne dataportaler."
    }
  }
];

const uses: LocalisedText[] = [
  { en: "Feed digital parking signs and guidance systems", da: "Fød digitale parkeringsskilte og p-henvisningssystemer" },
  { en: "Show live availability in your own app or website", da: "Vis live ledighed i jeres egen app eller på jeres hjemmeside" },
  { en: "Combine Papp data with your own data in BI dashboards", da: "Kombinér Papp-data med jeres egne data i BI-dashboards" },
  { en: "Deliver measurements to consultancy and planning tools", da: "Lever målinger til rådgivnings- og planlægningsværktøjer" }
];

// Illustrative response only; the real schema is shared during onboarding.
const sampleResponse = `{
  "site": "herning-centrum",
  "updated": "2026-11-01T13:05:00Z",
  "capacity": 80,
  "occupied": 53,
  "free": 27,
  "zones": [
    { "id": "north", "free": 12 },
    { "id": "south", "free": 15 }
  ]
}`;

export function ApiProduct({ locale }: { locale: Locale }) {
  const da = locale === "da";

  return (
    <>
      <section className="subpage-hero api-hero">
        <div className="container">
          <div className="subpage-hero__grid">
            <div>
              <p className="eyebrow">{da ? "Produkt" : "Product"}</p>
              <h1>Papp API</h1>
              <p className="hero-lead">
                {da
                  ? "Live og historiske mobilitetsdata direkte i jeres egne systemer."
                  : "Live and historical mobility data, straight into your own systems."}
              </p>
              <p>
                {da
                  ? "Alt, hvad Papp måler med kameraer og sensorer, er også tilgængeligt via et sikkert REST API, så I kan bygge videre på det i jeres egne værktøjer."
                  : "Everything Papp measures with cameras and sensors is also available through a secure REST API, so you can build on it in your own tools."}
              </p>
              <Button href="#book">{da ? "Få API-adgang" : "Request API access"}</Button>
            </div>
            <figure className="api-sample" aria-label={da ? "Eksempel på et API-svar" : "Example API response"}>
              <figcaption>
                <span className="api-sample__method">GET</span>
                <code>/v1/sites/herning-centrum/occupancy</code>
              </figcaption>
              <pre><code>{sampleResponse}</code></pre>
            </figure>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading eyebrow={da ? "Hvad API'et giver" : "What the API gives you"} title={da ? "Samme data som Papp Insights, i jeres egne systemer." : "The same data as Papp Insights, in your own systems."} align="center" />
        <div className="api-capabilities">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <article key={capability.title.en}>
                <span className="audience-card__icon" aria-hidden="true"><Icon size={20} strokeWidth={1.8} /></span>
                <h3>{pick(locale, capability.title)}</h3>
                <p>{pick(locale, capability.body)}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <Section tone="soft">
        <div className="offering-benefits api-uses">
          <div>
            <SectionHeading eyebrow={da ? "Typiske anvendelser" : "Typical uses"} title={da ? "Byg videre på jeres data." : "Build on your data."} />
            <ul className="check-list check-list--large">
              {uses.map((use) => <li key={use.en}>{pick(locale, use)}</li>)}
            </ul>
          </div>
          <div className="api-security">
            <span className="audience-card__icon" aria-hidden="true"><KeyRound size={20} strokeWidth={1.8} /></span>
            <h3>{da ? "Sikker adgang" : "Secure access"}</h3>
            <p>
              {da
                ? "Adgang med API-nøgler pr. organisation, kun til jeres egne lokationer. Data er anonymiseret og GDPR-overholdende."
                : "Access with API keys per organisation, limited to your own locations. Data is anonymised and GDPR-compliant."}
            </p>
            <span className="api-security__note"><Activity size={16} aria-hidden="true" /> {da ? "Dokumentation deles ved opstart" : "Documentation shared at onboarding"}</span>
          </div>
        </div>
      </Section>

      <Section className="service-meeting-section">
        <div id="book"><MeetingRequest locale={locale} source="api" /></div>
      </Section>
    </>
  );
}
