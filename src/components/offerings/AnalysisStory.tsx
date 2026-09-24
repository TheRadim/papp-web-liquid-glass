import { FileText, MapPinned, ChartNoAxesCombined } from "lucide-react";
import type { Locale } from "@/content/types";
import { Section } from "@/components/layout/Section";
import { MeetingRequest } from "@/components/contact/MeetingRequest";

// Report focused story for the Analysis and reports service page.
export function AnalysisStory({ locale }: { locale: Locale }) {
  const da = locale === "da";
  return <>
    <Section className="analysis-story">
      <div className="service-story-heading"><p className="eyebrow">{da ? "Spørgsmål fra virkeligheden" : "Questions from the real world"}</p><h2>{da ? "Et solidt grundlag for den næste beslutning." : "A sound basis for the next decision."}</h2></div>
      <div className="service-question-grid">{(da ? [
        ["Hvad bevæger sig, og hvad betyder det?", "Fra trafikmængder og fodgængerstrømme til parkeringsbehov, køretøjstyper og besøgendes oprindelse samler vi de målinger, spørgsmålet kræver, med kameraer, sensorer og eksisterende data."],
        ["Virker forsøget?", "Før- og eftermålinger gør det muligt at vurdere ændringer i parkering, trafik og brug af byrummet."],
        ["Hvor skal I sætte ind?", "Vi afdækker tilbagevendende mønstre og forklarer, hvad data kan, og ikke kan, sige om mulige tiltag."]
      ] : [
        ["What is moving, and what does it mean?", "From traffic volumes and pedestrian flows to parking demand, vehicle mix and visitor origins, we connect the measurements your question needs, using cameras, sensors and existing data."],
        ["Is the trial working?", "Before-and-after measurements help assess changes in parking, traffic and the use of public space."],
        ["Where should you intervene?", "We identify recurring patterns and explain what the evidence can, and cannot, say about possible actions."]
      ]).map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
    </Section>
    <Section className="report-section"><div className="report-layout">
      <div className="report-preview" aria-label={da ? "Rapportens opbygning" : "Report structure"}>
        <div className="report-preview__top"><span>Papp Mobility</span><FileText size={23} aria-hidden="true" /></div><p className="eyebrow">{da ? "Rapportstruktur" : "Report structure"}</p><h3>{da ? "Fra måling til anbefaling." : "From measurement to recommendation."}</h3>
        <div className="report-preview__chart" aria-hidden="true">{[36,54,73,86,66,44,28].map((value, index) => <i key={index} style={{ height: `${value}%` }} />)}</div>
        {(da ? ["01 Spørgsmål og metode", "02 Målinger og mønstre", "03 Konklusioner og begrænsninger", "04 Anbefalinger og næste skridt"] : ["01 Question and method", "02 Measurements and patterns", "03 Conclusions and limitations", "04 Recommendations and next steps"]).map(item => <p className="report-preview__line" key={item}>{item}</p>)}
      </div>
      <div><p className="eyebrow">{da ? "Det får I" : "What you receive"}</p><h2>{da ? "En rapport, der kan lægges på bordet." : "A report you can put on the table."}</h2><p>{da ? "Vi samler målingerne i en forståelig fortælling med kort, grafer og konkrete konklusioner. Et fælles grundlag for forvaltning, udvalg og politikere." : "We bring the measurements into a clear narrative with maps, charts and concrete conclusions. A shared basis for officers, committees and elected decision-makers."}</p>
        <ul className="service-deliverables"><li><MapPinned aria-hidden="true" /><span>{da ? "Hvor og hvornår presset opstår" : "Where and when pressure occurs"}</span></li><li><ChartNoAxesCombined aria-hidden="true" /><span>{da ? "Sammenligninger med en tydelig metode" : "Comparisons with a transparent method"}</span></li><li><FileText aria-hidden="true" /><span>{da ? "Anbefalinger med forbehold og næste skridt" : "Recommendations, caveats and next steps"}</span></li></ul>
      </div>
    </div></Section>
    <Section className="analysis-partnership">
      <div className="service-story-heading">
        <p className="eyebrow">{da ? "Samarbejde" : "Working together"}</p>
        <h2>{da ? "Sammen finder vi de rigtige værktøjer til jeres spørgsmål." : "Together, we find the right tools for your question."}</h2>
        <p>{da ? "Hver beslutning kræver sit eget grundlag. Tag spørgsmålet med, så finder vi sammen ud af, hvad der skal til for at besvare det: hvilke steder der skal måles, hvor længe, med hvilke sensorer, kameraer eller eksisterende data, og hvordan resultaterne skal formidles. I får en analyse, der er formet efter jeres behov, og en samarbejdspartner, der følger jer fra den første samtale til de endelige resultater." : "Every decision needs different evidence. Bring us the question and we will work out together what it takes to answer it: which places to measure, for how long, with which sensors, cameras or existing data, and how the results should be presented. You get an analysis shaped around your needs, and a partner who stays with you from the first conversation to the final findings."}</p>
      </div>
    </Section>
    <Section className="service-meeting-section"><div id="analysis-meeting"><MeetingRequest locale={locale} source="analysis" /></div></Section>
    <Section className="service-path"><h2>{da ? "Fra første spørgsmål til færdig rapport." : "From the first question to the final report."}</h2><ol>{(da ? [["Afgræns", "Vi aftaler spørgsmålet, stederne og måleperioden."], ["Mål", "Vi planlægger indsamlingen og kontrollerer datagrundlaget."], ["Analysér", "Vi sammenligner, fortolker og vurderer mulige handlinger."], ["Forklar", "Vi leverer rapporten og gennemgår resultaterne med jer."]] : [["Scope", "Agree the question, locations and measurement period."], ["Measure", "Plan collection and check the quality of the evidence."], ["Analyse", "Compare, interpret and assess possible actions."], ["Explain", "Deliver the report and walk through the findings together."]]).map(([title, body]) => <li key={title}><h3>{title}</h3><p>{body}</p></li>)}</ol></Section>
  </>;
}
