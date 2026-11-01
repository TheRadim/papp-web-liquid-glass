import Image from "next/image";
import type { Locale, LocalisedText } from "@/content/types";
import { pick } from "@/lib/i18n/locales";
import { withBasePath } from "@/lib/site/basePath";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { MeetingRequest } from "@/components/contact/MeetingRequest";
import { PartnerLogoLoop } from "@/components/social-proof/PartnerLogoLoop";

interface Deliverable {
  title: LocalisedText;
  body: LocalisedText;
  examples: LocalisedText;
}

// From raw data to a finished report, and anything in between.
const deliverables: Deliverable[] = [
  {
    title: { en: "Data", da: "Data" },
    body: {
      en: "Validated counts, occupancy and dwell times as exports or a live feed through the Papp API.",
      da: "Validerede tællinger, belægning og opholdstider som eksport eller live feed via Papp API."
    },
    examples: { en: "CSV, JSON, API", da: "CSV, JSON, API" }
  },
  {
    title: { en: "Insights", da: "Indsigt" },
    body: {
      en: "Dashboards in Papp Insights that you and your client can open, filter and share during the project.",
      da: "Dashboards i Papp Insights, som I og jeres kunde kan åbne, filtrere og dele undervejs i projektet."
    },
    examples: { en: "Live views, comparisons", da: "Livevisninger, sammenligninger" }
  },
  {
    title: { en: "Reports", da: "Rapporter" },
    body: {
      en: "Analysis and written findings, ready to go into your deliverable or straight to the decision-makers.",
      da: "Analyser og skriftlige konklusioner, klar til jeres leverance eller direkte til beslutningstagerne."
    },
    examples: { en: "Analysis, recommendations", da: "Analyser, anbefalinger" }
  }
];

interface Audience {
  id: string;
  name: LocalisedText;
  title: LocalisedText;
  body: LocalisedText;
  points: LocalisedText[];
}

const audiences: Audience[] = [
  {
    id: "consultancies",
    name: { en: "Consultancies", da: "Rådgivere" },
    title: { en: "We gather the intelligence for you.", da: "Vi indsamler indsigten for jer." },
    body: {
      en: "Your team owns the plan and the client. We install the cameras and sensors, run the counts and hand over clean, validated data for your report.",
      da: "Jeres team ejer planen og kunden. Vi opsætter kameraer og sensorer, kører tællingerne og leverer rene, validerede data til jeres rapport."
    },
    points: [
      { en: "Traffic, parking and occupancy counts", da: "Trafik-, parkerings- og belægningstællinger" },
      { en: "Data in Papp Insights or through the API", da: "Data i Papp Insights eller via API" },
      { en: "Exports without Papp branding for your deliverable", da: "Eksport uden Papp-branding til jeres leverance" }
    ]
  },
  {
    id: "retail",
    name: { en: "Retail sites", da: "Butikker" },
    title: { en: "Understand who visits, and when.", da: "Forstå, hvem der kommer, og hvornår." },
    body: {
      en: "ANPR cameras at your car park show how many customers arrive, how long they stay, how often they return and where they come from, anonymised and GDPR-compliant.",
      da: "ANPR-kameraer ved jeres parkering viser, hvor mange kunder der kommer, hvor længe de bliver, hvor ofte de vender tilbage, og hvor de kommer fra, anonymiseret og GDPR-overholdende."
    },
    points: [
      { en: "Visits, dwell time and returning customers", da: "Besøg, opholdstid og tilbagevendende kunder" },
      { en: "Catchment by municipality", da: "Opland fordelt på kommuner" },
      { en: "Compare opening hours, campaigns and seasons", da: "Sammenlign åbningstider, kampagner og sæsoner" }
    ]
  },
  {
    id: "data",
    name: { en: "Data companies", da: "Datavirksomheder" },
    title: { en: "We collect it faster and better for you.", da: "Vi indsamler hurtigere og bedre for jer." },
    body: {
      en: "Papp already measures parking and traffic in Danish cities. Instead of building your own collection network, take a reliable feed from ours.",
      da: "Papp måler allerede parkering og trafik i danske byer. I stedet for at bygge jeres eget indsamlingsnetværk kan I få et pålideligt feed fra vores."
    },
    points: [
      { en: "Live and historical feeds through the Papp API", da: "Live og historiske feeds via Papp API" },
      { en: "New sites set up with battery-powered cameras", da: "Nye steder sættes op med batteridrevne kameraer" },
      { en: "Consistent, validated data across locations", da: "Ensartede, validerede data på tværs af lokationer" }
    ]
  }
];

const steps: { title: LocalisedText; body: LocalisedText }[] = [
  {
    title: { en: "Scope", da: "Afgrænsning" },
    body: { en: "A call about the project, the sites and what your client needs to decide.", da: "En samtale om projektet, stederne og hvad jeres kunde skal beslutte." }
  },
  {
    title: { en: "Install", da: "Opsætning" },
    body: { en: "We choose and install the hardware, and handle permits and privacy.", da: "Vi vælger og installerer udstyret og håndterer tilladelser og privatliv." }
  },
  {
    title: { en: "Measure", da: "Måling" },
    body: { en: "Papp runs and checks the measurement for the agreed period.", da: "Papp driver og kontrollerer målingen i den aftalte periode." }
  },
  {
    title: { en: "Deliver", da: "Levering" },
    body: { en: "You receive data, dashboards or a report, in the form your project needs.", da: "I får data, dashboards eller en rapport, i den form jeres projekt har brug for." }
  }
];

const commitments: { title: LocalisedText; body: LocalisedText }[] = [
  {
    title: { en: "One contact person", da: "Én kontaktperson" },
    body: { en: "A named project manager at Papp from first call to final delivery.", da: "En navngiven projektleder hos Papp fra første samtale til endelig levering." }
  },
  {
    title: { en: "Our own hardware", da: "Vores eget udstyr" },
    body: { en: "We install, maintain and remove the cameras and sensors ourselves.", da: "Vi installerer, vedligeholder og nedtager selv kameraer og sensorer." }
  },
  {
    title: { en: "Data you can stand behind", da: "Data, I kan stå inde for" },
    body: { en: "Every measurement is checked before it reaches your project.", da: "Alle målinger kontrolleres, før de når jeres projekt." }
  },
  {
    title: { en: "Privacy built in", da: "Privatliv indbygget" },
    body: { en: "Anonymised, GDPR-compliant collection, with documentation for your client.", da: "Anonymiseret, GDPR-overholdende indsamling med dokumentation til jeres kunde." }
  }
];

export function PartnershipsStory({ locale }: { locale: Locale }) {
  const da = locale === "da";

  return (
    <div className="partner-page">
      <section className="pp-hero">
        <div className="container pp-hero__grid">
          <div className="pp-hero__copy">
            <h1>
              {da ? "Jeres projekter." : "Your projects."} <span className="pp-hero__line">{da ? "Vores dataindsamling." : "Our data collection."}</span>
            </h1>
            <p className="pp-lead">
              {da
                ? "Papp er målepartner for rådgivere, butikker og datavirksomheder. Vi installerer, driver og validerer kameraer og sensorer og leverer de data, den indsigt eller den rapport, jeres projekt har brug for."
                : "Papp is the measurement partner for consultancies, retailers and data companies. We install, run and validate cameras and sensors, and deliver the data, insights or report your project needs."}
            </p>
            <div className="pp-hero__actions">
              <Button href="#book">{da ? "Book et partnermøde" : "Book a partner meeting"}</Button>
              <Button href={`/${locale}/products/api`} variant="text">{da ? "Se Papp API" : "See the Papp API"}</Button>
            </div>
          </div>
          <figure className="pp-hero__picture">
            <Image src={withBasePath("/images/partnerships/site-review.webp")} alt={da ? "Papp gennemgår målinger med en partner på en parkeringsplads" : "Papp reviewing measurements with a partner at a car park"} width={1600} height={1067} priority sizes="(max-width: 992px) 100vw, 50vw" />
          </figure>
        </div>
      </section>

      <section className="pp-proof" aria-label={da ? "Byer og partnere, der allerede bruger Papp" : "Cities and partners already using Papp"}>
        <p>{da ? "Måler allerede for byer og partnere i hele Danmark" : "Already measuring for cities and partners across Denmark"}</p>
        <PartnerLogoLoop />
      </section>

      <Section className="pp-section">
        <div className="pp-split">
          <div className="pp-split__intro">
            <h2>{da ? "Fra rådata til færdig rapport." : "From raw data to a finished report."}</h2>
            <p>
              {da
                ? "I vælger, hvor meget vi tager os af. Nogle partnere vil kun have data, andre vil have hele analysen. De fleste ligger et sted midt imellem."
                : "You choose how much we take on. Some partners only want the data, others want the whole analysis. Most land somewhere in between."}
            </p>
          </div>
          <ol className="pp-spectrum">
            {deliverables.map((item) => (
              <li key={item.title.en}>
                <h3>{pick(locale, item.title)}</h3>
                <p>{pick(locale, item.body)}</p>
                <span>{pick(locale, item.examples)}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section className="pp-section pp-section--soft" tone="soft">
        <h2 className="pp-heading">{da ? "Hvem vi arbejder med" : "Who we work with"}</h2>
        <div className="pp-audiences">
          {audiences.map((audience) => (
            <article className="pp-audience" key={audience.id}>
              <p className="pp-audience__name">{pick(locale, audience.name)}</p>
              <div>
                <h3>{pick(locale, audience.title)}</h3>
                <p>{pick(locale, audience.body)}</p>
              </div>
              <ul className="check-list">
                {audience.points.map((point) => <li key={point.en}>{pick(locale, point)}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section className="pp-section">
        <div className="pp-process">
          <figure className="pp-process__picture">
            <Image src={withBasePath("/images/partnerships/installation.webp")} alt={da ? "Papp installerer et kamera" : "Papp installing a camera"} width={1600} height={1066} sizes="(max-width: 992px) 100vw, 42vw" />
          </figure>
          <div>
            <h2>{da ? "Sådan forløber et samarbejde." : "How a partnership runs."}</h2>
            <p className="pp-process__intro">
              {da ? "Vi tager feltarbejdet, så jeres team kan bruge tiden på kunden og konklusionerne." : "We take on the fieldwork, so your team can spend its time on the client and the conclusions."}
            </p>
            <ol className="pp-steps">
              {steps.map((step) => (
                <li key={step.title.en}>
                  <h3>{pick(locale, step.title)}</h3>
                  <p>{pick(locale, step.body)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <section className="pp-commitments">
        <div className="container">
          <h2>{da ? "Hvad I kan regne med." : "What you can count on."}</h2>
          <div className="pp-commitments__grid">
            {commitments.map((item) => (
              <div key={item.title.en}>
                <h3>{pick(locale, item.title)}</h3>
                <p>{pick(locale, item.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section className="service-meeting-section">
        <div id="book"><MeetingRequest locale={locale} source="partnerships" /></div>
      </Section>
    </div>
  );
}
