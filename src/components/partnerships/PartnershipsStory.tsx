import { Building2, Database, Store, type LucideIcon } from "lucide-react";
import type { Locale, LocalisedText } from "@/content/types";
import { pick } from "@/lib/i18n/locales";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { MeetingRequest } from "@/components/contact/MeetingRequest";
import { PartnerLogoLoop } from "@/components/social-proof/PartnerLogoLoop";

interface Audience {
  id: string;
  icon: LucideIcon;
  eyebrow: LocalisedText;
  title: LocalisedText;
  body: LocalisedText;
  points: LocalisedText[];
}

const audiences: Audience[] = [
  {
    id: "consultancies",
    icon: Building2,
    eyebrow: { en: "Consultancies", da: "Rådgivere" },
    title: { en: "We gather the intelligence for you.", da: "Vi indsamler indsigten for jer." },
    body: {
      en: "Your team designs the plan; we deliver the measurements behind it. Papp installs cameras and sensors, runs the counts and hands you clean, validated data for your report.",
      da: "Jeres team lægger planen; vi leverer målingerne bag den. Papp opsætter kameraer og sensorer, kører tællingerne og leverer rene, validerede data til jeres rapport."
    },
    points: [
      { en: "Traffic, parking and occupancy counts", da: "Trafik-, parkerings- og belægningstællinger" },
      { en: "Data delivered in Papp Insights or through the API", da: "Data leveret i Papp Insights eller via API" },
      { en: "White-label exports for your client deliverables", da: "Eksport uden Papp-branding til jeres kundeleverancer" }
    ]
  },
  {
    id: "retail",
    icon: Store,
    eyebrow: { en: "Retail sites", da: "Butikker" },
    title: { en: "Understand who visits, and when.", da: "Forstå, hvem der kommer, og hvornår." },
    body: {
      en: "ANPR cameras at your car park show how many customers arrive, how long they stay, how often they return and which areas they drive in from, anonymised and GDPR-compliant.",
      da: "ANPR-kameraer ved jeres parkering viser, hvor mange kunder der kommer, hvor længe de bliver, hvor ofte de vender tilbage, og hvilke områder de kommer fra, anonymiseret og GDPR-overholdende."
    },
    points: [
      { en: "Visits, dwell time and returning customers", da: "Besøg, opholdstid og tilbagevendende kunder" },
      { en: "Where customers come from, by municipality", da: "Hvor kunderne kommer fra, fordelt på kommuner" },
      { en: "Compare opening hours, campaigns and seasons", da: "Sammenlign åbningstider, kampagner og sæsoner" }
    ]
  },
  {
    id: "data",
    icon: Database,
    eyebrow: { en: "Data companies", da: "Datavirksomheder" },
    title: { en: "We collect it faster and better for you.", da: "Vi indsamler hurtigere og bedre for jer." },
    body: {
      en: "Papp already measures parking and traffic across Danish cities. Instead of building your own collection network, take a reliable feed from ours.",
      da: "Papp måler allerede parkering og trafik i danske byer. I stedet for at bygge jeres eget indsamlingsnetværk kan I få et pålideligt feed fra vores."
    },
    points: [
      { en: "Live and historical feeds through the Papp API", da: "Live og historiske feeds via Papp API" },
      { en: "New sites set up quickly with battery-powered cameras", da: "Nye steder sættes hurtigt op med batteridrevne kameraer" },
      { en: "Validated, consistent data across locations", da: "Validerede, ensartede data på tværs af lokationer" }
    ]
  }
];

const steps: LocalisedText[] = [
  { en: "A 30-minute call about what you need to measure and for whom.", da: "Et opkald på 30 minutter om, hvad I skal måle, og for hvem." },
  { en: "We propose sites, hardware and how the data reaches you.", da: "Vi foreslår steder, udstyr og hvordan data når frem til jer." },
  { en: "Papp installs and runs the measurement; you get the data.", da: "Papp installerer og driver målingen; I får data." }
];

export function PartnershipsStory({ locale }: { locale: Locale }) {
  const da = locale === "da";

  return (
    <>
      <section className="subpage-hero partnerships-hero">
        <div className="container">
          <div className="partnerships-hero__copy">
            <p className="eyebrow">{da ? "Partnerskaber" : "Partnerships"}</p>
            <h1>{da ? "I skaber værdien. Vi indsamler data." : "You deliver the value. We gather the data."}</h1>
            <p className="hero-lead">
              {da
                ? "Papp arbejder med rådgivere, butikker og datavirksomheder, der har brug for pålidelige mobilitetsdata uden selv at skulle måle."
                : "Papp works with consultancies, retailers and data companies that need reliable mobility data without measuring it themselves."}
            </p>
            <div className="partnerships-hero__actions">
              <Button href="#book">{da ? "Book et møde" : "Book a meeting"}</Button>
              <Button href={`/${locale}/products/api`} variant="text">{da ? "Se Papp API" : "See the Papp API"}</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="partnerships-proof" aria-label={da ? "Byer og partnere, der allerede bruger Papp" : "Cities and partners already using Papp"}>
        <p className="partnerships-proof__label">{da ? "Måler allerede for byer og partnere i hele Danmark" : "Already measuring for cities and partners across Denmark"}</p>
        <PartnerLogoLoop />
      </section>

      <Section>
        <SectionHeading
          eyebrow={da ? "Hvem vi arbejder med" : "Who we work with"}
          title={da ? "Tre måder at bruge Papp på." : "Three ways to work with Papp."}
          align="center"
        />
        <div className="audience-grid">
          {audiences.map((audience) => {
            const Icon = audience.icon;
            return (
              <article className="audience-card" key={audience.id}>
                <span className="audience-card__icon" aria-hidden="true"><Icon size={22} strokeWidth={1.8} /></span>
                <p className="eyebrow">{pick(locale, audience.eyebrow)}</p>
                <h3>{pick(locale, audience.title)}</h3>
                <p>{pick(locale, audience.body)}</p>
                <ul className="check-list">
                  {audience.points.map((point) => <li key={point.en}>{pick(locale, point)}</li>)}
                </ul>
              </article>
            );
          })}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeading eyebrow={da ? "Sådan kommer vi i gang" : "How we start"} title={da ? "Fra første samtale til data." : "From first call to data."} align="center" />
        <div className="process-grid">
          {steps.map((step, index) => (
            <article className="process-card" key={step.en}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{pick(locale, step)}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="service-meeting-section">
        <div id="book"><MeetingRequest locale={locale} source="partnerships" /></div>
      </Section>
    </>
  );
}
