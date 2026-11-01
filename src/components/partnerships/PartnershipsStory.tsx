import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Locale, LocalisedText } from "@/content/types";
import { pick } from "@/lib/i18n/locales";
import { withBasePath } from "@/lib/site/basePath";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { MeetingRequest } from "@/components/contact/MeetingRequest";
import { PartnerLogoLoop } from "@/components/social-proof/PartnerLogoLoop";
import { DeliverableSwitcher } from "@/components/partnerships/DeliverableSwitcher";

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
      { en: "Traffic and parking counts", da: "Trafik- og parkeringstællinger" },
      { en: "Exports without our branding", da: "Eksport uden vores branding" }
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
      { en: "Visits and returning customers", da: "Besøg og tilbagevendende kunder" },
      { en: "Catchment by municipality", da: "Opland pr. kommune" }
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
      { en: "Live and historical feeds", da: "Live og historiske feeds" },
      { en: "New sites set up quickly", da: "Nye steder sat hurtigt op" }
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
    body: { en: "Data, dashboards or a report, in the form your project needs.", da: "Data, dashboards eller en rapport, i den form jeres projekt har brug for." }
  }
];

const commitments: { title: LocalisedText; body: LocalisedText }[] = [
  {
    title: { en: "One contact person", da: "Én kontaktperson" },
    body: { en: "A named project manager from first call to final delivery.", da: "En navngiven projektleder fra første samtale til endelig levering." }
  },
  {
    title: { en: "Our own hardware", da: "Vores eget udstyr" },
    body: { en: "We install, maintain and remove the cameras and sensors ourselves.", da: "Vi installerer, vedligeholder og nedtager selv kameraer og sensorer." }
  },
  {
    title: { en: "Checked data", da: "Kontrollerede data" },
    body: { en: "Every measurement is validated before it reaches your project.", da: "Alle målinger valideres, før de når jeres projekt." }
  },
  {
    title: { en: "Privacy built in", da: "Privatliv indbygget" },
    body: { en: "Anonymised, GDPR-compliant collection, documented for your client.", da: "Anonymiseret, GDPR-overholdende indsamling, dokumenteret til jeres kunde." }
  }
];

export function PartnershipsStory({ locale }: { locale: Locale }) {
  const da = locale === "da";

  return (
    <div className="partner-page">
      {/* Hero: a large photograph with the message on a glass panel. */}
      <section className="pp-stage">
        <div className="container">
          <div className="pp-stage__frame">
            <Image
              className="pp-stage__photo"
              src={withBasePath("/images/partnerships/site-review.webp")}
              alt={da ? "Papp gennemgår målinger med en partner på en parkeringsplads" : "Papp reviewing measurements with a partner at a car park"}
              width={1600}
              height={1067}
              priority
              sizes="(max-width: 1320px) 100vw, 1240px"
            />
            <div className="pp-stage__panel">
              <p className="pp-stage__kicker">{da ? "Partnerskaber" : "Partnerships"}</p>
              <h1>{da ? "Jeres projekter. Vores dataindsamling." : "Your projects. Our data collection."}</h1>
              <p className="pp-lead">
                {da
                  ? "Vi er målepartner for rådgivere, butikker og datavirksomheder: vi installerer, driver og validerer målingen og leverer data, indsigt eller en færdig rapport."
                  : "We are the measurement partner for consultancies, retailers and data companies: we install, run and validate the measurement, and deliver data, insights or a finished report."}
              </p>
              <div className="pp-hero__actions">
                <Button href="#book">{da ? "Book et partnermøde" : "Book a partner meeting"}</Button>
                <Button href={`/${locale}/products/api`} variant="text">{da ? "Se Papp API" : "See the Papp API"}</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pp-proof" aria-label={da ? "Byer og partnere, der allerede bruger Papp" : "Cities and partners already using Papp"}>
        <div className="container">
          <p>{da ? "Måler allerede for byer og partnere i hele Danmark" : "Already measuring for cities and partners across Denmark"}</p>
          <div className="pp-proof__strip">
            <PartnerLogoLoop />
          </div>
        </div>
      </section>

      <Section className="pp-section">
        <div className="pp-intro">
          <h2>{da ? "Fra rådata til færdig rapport." : "From raw data to a finished report."}</h2>
          <p>
            {da
              ? "I vælger, hvor meget vi tager os af. Nogle partnere vil kun have data, andre hele analysen. De fleste ligger et sted midt imellem."
              : "You choose how much we take on. Some partners only want the data, others want the whole analysis. Most land somewhere in between."}
          </p>
        </div>
        <DeliverableSwitcher locale={locale} />
      </Section>

      <Section className="pp-section pp-who">
        <div className="pp-intro">
          <h2>{da ? "Hvem vi arbejder med." : "Who we work with."}</h2>
        </div>
        <div className="pp-who__list">
          {audiences.map((audience) => (
            <article className="pp-who__row" key={audience.id}>
              <p className="pp-who__name">{pick(locale, audience.name)}</p>
              <h3>{pick(locale, audience.title)}</h3>
              <div className="pp-who__detail">
                <p>{pick(locale, audience.body)}</p>
                <p className="pp-who__points">{audience.points.map((point) => pick(locale, point)).join(" · ")}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="pp-section pp-flow-section">
        <div className="pp-intro pp-intro--center">
          <h2>{da ? "Sådan forløber et samarbejde." : "How a partnership runs."}</h2>
          <p>{da ? "Vi tager feltarbejdet, så jeres team kan bruge tiden på kunden og konklusionerne." : "We take on the fieldwork, so your team can spend its time on the client and the conclusions."}</p>
        </div>
        <ol className="pp-flow">
          {steps.map((step, index) => (
            <li key={step.title.en}>
              <div className="pp-flow__pill">
                <span>{pick(locale, step.title)}</span>
                {index < steps.length - 1 ? <ArrowRight aria-hidden="true" size={16} /> : null}
              </div>
              <p>{pick(locale, step.body)}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Commitments on glass, over the installation photograph. */}
      <section className="pp-promise">
        <div className="container">
          <div className="pp-promise__frame">
            <Image
              className="pp-promise__photo"
              src={withBasePath("/images/partnerships/installation.webp")}
              alt=""
              width={1600}
              height={1066}
              sizes="(max-width: 1320px) 100vw, 1240px"
            />
            <div className="pp-promise__content">
              <h2>{da ? "Hvad I kan regne med." : "What you can count on."}</h2>
              <div className="pp-promise__grid">
                {commitments.map((item) => (
                  <div className="pp-promise__card" key={item.title.en}>
                    <h3>{pick(locale, item.title)}</h3>
                    <p>{pick(locale, item.body)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section className="service-meeting-section">
        <div id="book"><MeetingRequest locale={locale} source="partnerships" /></div>
      </Section>
    </div>
  );
}
