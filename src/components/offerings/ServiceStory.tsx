import Image from "next/image";
import { FileText, MapPinned, ChartNoAxesCombined, Users, Lightbulb, Route } from "lucide-react";
import type { Locale } from "@/content/types";
import { Section } from "@/components/layout/Section";
import { MeetingRequest } from "@/components/contact/MeetingRequest";
import { withBasePath } from "@/lib/site/basePath";

export function ServiceStory({ locale, kind }: { locale: Locale; kind: "analysis" | "consultancy" }) {
  const da = locale === "da";
  if (kind === "analysis") return <>
    <Section className="analysis-story">
      <div className="service-story-heading"><p className="eyebrow">{da ? "Spørgsmål fra virkeligheden" : "Questions from the real world"}</p><h2>{da ? "Et solidt grundlag for den næste beslutning." : "A sound basis for the next decision."}</h2></div>
      <div className="service-question-grid">{(da ? [
        ["Mangler der pladser — eller overblik?", "Vi sammenligner belægning og opholdstid på tværs af steder og tidspunkter, så eksisterende kapacitet bliver synlig."],
        ["Virker forsøget?", "Før- og eftermålinger gør det muligt at vurdere ændringer i parkering, trafik og brug af byrummet."],
        ["Hvor skal I sætte ind?", "Vi afdækker tilbagevendende mønstre og forklarer, hvad data kan — og ikke kan — sige om mulige tiltag."]
      ] : [
        ["More spaces — or better use of them?", "We compare occupancy and length of stay across locations and periods to make existing capacity visible."],
        ["Is the trial working?", "Before-and-after measurements help assess changes in parking, traffic and the use of public space."],
        ["Where should you intervene?", "We identify recurring patterns and explain what the evidence can — and cannot — say about possible actions."]
      ]).map(([title, body], index) => <article key={title}><span className="eyebrow">0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
    </Section>
    <Section className="report-section"><div className="report-layout">
      <div className="report-preview" aria-label={da ? "Eksempel på rapportens opbygning" : "Illustrative report structure"}>
        <div className="report-preview__top"><span>Papp Mobility</span><FileText size={23} aria-hidden="true" /></div><p className="eyebrow">{da ? "Rapportstruktur · eksempel" : "Report structure · example"}</p><h3>{da ? "Fra måling til anbefaling." : "From measurement to recommendation."}</h3>
        <div className="report-preview__chart" aria-hidden="true">{[36,54,73,86,66,44,28].map((value, index) => <i key={index} style={{ height: `${value}%` }} />)}</div>
        {(da ? ["01 Spørgsmål og metode", "02 Målinger og mønstre", "03 Konklusioner og begrænsninger", "04 Anbefalinger og næste skridt"] : ["01 Question and method", "02 Measurements and patterns", "03 Conclusions and limitations", "04 Recommendations and next steps"]).map(item => <p className="report-preview__line" key={item}>{item}</p>)}
      </div>
      <div><p className="eyebrow">{da ? "Det får I" : "What you receive"}</p><h2>{da ? "En rapport, der kan lægges på bordet." : "A report you can put on the table."}</h2><p>{da ? "Vi samler målingerne i en forståelig fortælling med kort, grafer og konkrete konklusioner. Et fælles grundlag for forvaltning, udvalg og politikere." : "We bring the measurements into a clear narrative with maps, charts and concrete conclusions. A shared basis for officers, committees and elected decision-makers."}</p>
        <ul className="service-deliverables"><li><MapPinned aria-hidden="true" /><span>{da ? "Hvor og hvornår presset opstår" : "Where and when pressure occurs"}</span></li><li><ChartNoAxesCombined aria-hidden="true" /><span>{da ? "Sammenligninger med en tydelig metode" : "Comparisons with a transparent method"}</span></li><li><FileText aria-hidden="true" /><span>{da ? "Anbefalinger med forbehold og næste skridt" : "Recommendations, caveats and next steps"}</span></li></ul>
      </div>
    </div></Section>
    <Section className="service-path"><h2>{da ? "Fra første spørgsmål til færdig rapport." : "From the first question to the final report."}</h2><ol>{(da ? [["Afgræns", "Vi aftaler spørgsmålet, stederne og måleperioden."], ["Mål", "Vi planlægger indsamlingen og kontrollerer datagrundlaget."], ["Analysér", "Vi sammenligner, fortolker og vurderer mulige handlinger."], ["Forklar", "Vi leverer rapporten og gennemgår resultaterne med jer."]] : [["Scope", "Agree the question, locations and measurement period."], ["Measure", "Plan collection and check the quality of the evidence."], ["Analyse", "Compare, interpret and assess possible actions."], ["Explain", "Deliver the report and walk through the findings together."]]).map(([title, body]) => <li key={title}><h3>{title}</h3><p>{body}</p></li>)}</ol></Section>
    <Section className="service-meeting-section"><MeetingRequest locale={locale} source={kind} /></Section>
  </>;
  return <>
    <Section className="workshop-story"><div className="workshop-story__intro"><p className="eyebrow">{da ? "Arbejd med os" : "Work with us"}</p><h2>{da ? "Jeres udfordring. Vores fælles arbejdsbord." : "Your challenge. Our shared working session."}</h2><p>{da ? "For virksomheder, ejendomme og operatører, der skal forstå parkering, besøgende eller bevægelse. Vi starter med det, I ved, og finder sammen ud af, hvad der mangler." : "For businesses, property teams and operators who need to understand parking, visitors or movement. We start with what you know and work out together what is missing."}</p></div><Image className="workshop-story__image" src={withBasePath("/images/corporate/insights-meeting-city.jpg")} alt={da ? "Fælles gennemgang af mobilitetsdata" : "Reviewing mobility data together"} width={1672} height={941} sizes="(max-width: 768px) 100vw, 1000px" />
      <div className="workshop-agenda"><div><p className="eyebrow">{da ? "På workshoppen" : "In the workshop"}</p><h3>{da ? "Fra antagelser til en plan." : "From assumptions to a plan."}</h3></div><div>{(da ? [
        ["Forstå situationen", "Hvem bruger området? Hvad fungerer i dag, og hvilken beslutning skal I træffe? Vi samler perspektiver fra jeres team."],
        ["Undersøg mulighederne", "Vi gennemgår eksisterende information, finder videnshuller og vurderer, om nye målinger vil hjælpe."],
        ["Aftal handlingerne", "Vi prioriterer muligheder, afklarer næste skridt og gør det tydeligt, hvad der skal undersøges eller afprøves først."]
      ] : [
        ["Understand the situation", "Who uses the site? What works today, and what decision is ahead? We bring your team’s perspectives together."],
        ["Explore the options", "Review existing information, identify gaps and assess whether new measurements would help answer the question."],
        ["Agree the actions", "Prioritise options, define practical next steps and make clear what to investigate or test first."]
      ]).map(([title, body], index) => <article key={title}><span>0{index + 1}</span><div><h4>{title}</h4><p>{body}</p></div></article>)}</div></div>
    </Section>
    <Section className="workshop-outcomes"><h2>{da ? "I går derfra med retning." : "Leave with a direction."}</h2><div className="service-question-grid">{[
      { icon: Users, title: da ? "Fælles forståelse" : "Shared understanding", body: da ? "Et klart problem, som teamet er enige om at løse." : "A clear problem your team agrees to solve." },
      { icon: Lightbulb, title: da ? "Bedre spørgsmål" : "Better questions", body: da ? "Overblik over, hvad I ved, og hvilke data der mangler." : "Clarity on what you know and which evidence is missing." },
      { icon: Route, title: da ? "Praktiske næste skridt" : "Practical next steps", body: da ? "En prioriteret vej til måling, forsøg eller handling." : "A prioritised route to measurement, a trial or action." }
    ].map(({icon: Icon,title,body}) => <article key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{body}</p></article>)}</div></Section>
    <Section className="service-meeting-section"><MeetingRequest locale={locale} source={kind} /></Section>
  </>;
}
