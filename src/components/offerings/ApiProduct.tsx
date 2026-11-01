import type { Locale, LocalisedText } from "@/content/types";
import { pick } from "@/lib/i18n/locales";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { MeetingRequest } from "@/components/contact/MeetingRequest";

interface Group {
  title: LocalisedText;
  intro: LocalisedText;
  items: { title: LocalisedText; body: LocalisedText }[];
}

// What the API offers, grouped the way people use it.
const groups: Group[] = [
  {
    title: { en: "Live", da: "Live" },
    intro: { en: "What is happening on site right now.", da: "Det, der sker på stedet lige nu." },
    items: [
      {
        title: { en: "Occupancy", da: "Belægning" },
        body: { en: "Free and occupied spaces per site, zone or single bay, updated as cars arrive and leave.", da: "Ledige og optagne pladser pr. område, zone eller enkelt bås, opdateret når biler kommer og kører." }
      },
      {
        title: { en: "Counts and flow", da: "Tællinger og flow" },
        body: { en: "Entries and exits, vehicles, bikes and pedestrians, and direction of travel.", da: "Ind- og udkørsler, biler, cykler og fodgængere samt kørselsretning." }
      }
    ]
  },
  {
    title: { en: "History", da: "Historik" },
    intro: { en: "Everything measured, ready for your own analysis.", da: "Alt, der er målt, klar til jeres egne analyser." },
    items: [
      {
        title: { en: "Time series", da: "Tidsserier" },
        body: { en: "Hourly, daily and weekly series for utilisation, peaks and average stay.", da: "Time-, dags- og ugeserier for udnyttelse, spidsbelastning og gennemsnitlig opholdstid." }
      },
      {
        title: { en: "Visitor origins", da: "Besøgendes oprindelse" },
        body: { en: "Where visitors come from, aggregated by municipality or postcode, never by vehicle.", da: "Hvor besøgende kommer fra, samlet pr. kommune eller postnummer, aldrig pr. køretøj." }
      }
    ]
  },
  {
    title: { en: "Integration", da: "Integration" },
    intro: { en: "Built to sit inside the systems you already run.", da: "Bygget til at passe ind i de systemer, I allerede bruger." },
    items: [
      {
        title: { en: "Webhooks", da: "Webhooks" },
        body: { en: "A message to your system when a zone is nearly full or a threshold is crossed.", da: "Besked til jeres system, når en zone er ved at være fuld, eller en grænse overskrides." }
      },
      {
        title: { en: "Exports", da: "Eksport" },
        body: { en: "CSV and JSON for BI tools such as Power BI, or for open-data portals.", da: "CSV og JSON til BI-værktøjer som Power BI eller til åbne dataportaler." }
      }
    ]
  }
];

// Illustrative endpoints; the full reference is shared at onboarding.
const endpoints: { method: string; path: string; description: LocalisedText }[] = [
  { method: "GET", path: "/v1/sites", description: { en: "Your sites and their zones", da: "Jeres steder og deres zoner" } },
  { method: "GET", path: "/v1/sites/{id}/occupancy", description: { en: "Live occupancy", da: "Live belægning" } },
  { method: "GET", path: "/v1/sites/{id}/counts", description: { en: "Entries, exits and flow for a period", da: "Ind- og udkørsler og flow for en periode" } },
  { method: "GET", path: "/v1/sites/{id}/origins", description: { en: "Visitor origins by area", da: "Besøgendes oprindelse pr. område" } },
  { method: "POST", path: "/v1/webhooks", description: { en: "Subscribe to events", da: "Abonnér på hændelser" } }
];

const uses: LocalisedText[] = [
  { en: "Feed digital parking signs and guidance systems", da: "Fød digitale parkeringsskilte og p-henvisningssystemer" },
  { en: "Show live availability in your own app or website", da: "Vis live ledighed i jeres egen app eller på jeres hjemmeside" },
  { en: "Combine Papp data with your own in BI dashboards", da: "Kombinér Papp-data med jeres egne i BI-dashboards" },
  { en: "Deliver measurements into consultancy and planning tools", da: "Lever målinger til rådgivnings- og planlægningsværktøjer" }
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
    <div className="api-page">
      <section className="subpage-hero api-hero">
        <div className="container">
          <div className="subpage-hero__grid">
            <div>
              <h1>Papp API</h1>
              <p className="hero-lead">
                {da ? "Live og historiske mobilitetsdata direkte i jeres egne systemer." : "Live and historical mobility data, straight into your own systems."}
              </p>
              <p>
                {da
                  ? "Alt, hvad Papp måler med kameraer og sensorer, er også tilgængeligt via et sikkert REST API, så I kan bygge videre på det i jeres egne værktøjer."
                  : "Everything Papp measures with cameras and sensors is also available through a secure REST API, so you can build on it in your own tools."}
              </p>
              <div className="pp-hero__actions">
                <Button href="#book">{da ? "Få API-adgang" : "Request API access"}</Button>
                <Button href={`/${locale}/partnerships`} variant="text">{da ? "Bliv partner" : "Partner with us"}</Button>
              </div>
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

      <Section className="pp-section">
        <div className="api-groups">
          <div className="api-groups__intro">
            <h2>{da ? "Samme data som Papp Insights." : "The same data as Papp Insights."}</h2>
            <p>
              {da
                ? "API'et giver adgang til alt det, dashboardet viser, fra det enkelte øjeblik til flere års historik. I henter det, I har brug for, når I har brug for det."
                : "The API gives you everything the dashboard shows, from this minute to years of history. Fetch what you need, when you need it."}
            </p>
          </div>
          <div className="api-groups__list">
            {groups.map((group) => (
              <section className="api-group" key={group.title.en} aria-label={pick(locale, group.title)}>
                <div className="api-group__head">
                  <h3>{pick(locale, group.title)}</h3>
                  <p>{pick(locale, group.intro)}</p>
                </div>
                <dl>
                  {group.items.map((item) => (
                    <div key={item.title.en}>
                      <dt>{pick(locale, item.title)}</dt>
                      <dd>{pick(locale, item.body)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pp-section" tone="soft">
        <div className="api-reference">
          <div>
            <h2>{da ? "Enkelt at komme i gang med." : "Simple to start with."}</h2>
            <p>
              {da
                ? "Et lille sæt forudsigelige endpoints, JSON-svar og API-nøgler pr. organisation. Den fulde dokumentation deles ved opstart."
                : "A small set of predictable endpoints, JSON responses and API keys per organisation. The full reference is shared at onboarding."}
            </p>
          </div>
          <table className="api-endpoints">
            <caption className="visually-hidden">{da ? "Eksempler på endpoints" : "Example endpoints"}</caption>
            <tbody>
              {endpoints.map((endpoint) => (
                <tr key={endpoint.path}>
                  <td><span className={`api-method api-method--${endpoint.method.toLowerCase()}`}>{endpoint.method}</span></td>
                  <td><code>{endpoint.path}</code></td>
                  <td>{pick(locale, endpoint.description)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <section className="pp-commitments api-uses">
        <div className="container api-uses__grid">
          <div>
            <h2>{da ? "Byg videre på jeres data." : "Build on your data."}</h2>
            <ul className="api-uses__list">
              {uses.map((use) => <li key={use.en}>{pick(locale, use)}</li>)}
            </ul>
          </div>
          <div className="api-uses__security">
            <h3>{da ? "Sikker adgang" : "Secure access"}</h3>
            <p>
              {da
                ? "Adgang med API-nøgler pr. organisation, kun til jeres egne lokationer. Data er anonymiseret og GDPR-overholdende, og ingen enkelte køretøjer kan følges."
                : "Access with API keys per organisation, limited to your own locations. Data is anonymised and GDPR-compliant, and no single vehicle can be followed."}
            </p>
          </div>
        </div>
      </section>

      <Section className="service-meeting-section">
        <div id="book"><MeetingRequest locale={locale} source="api" /></div>
      </Section>
    </div>
  );
}
