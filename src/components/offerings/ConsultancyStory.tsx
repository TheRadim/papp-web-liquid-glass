import Image from "next/image";
import Link from "next/link";
import { Building2, CalendarCheck, ClipboardList, Coins, FileText, Lightbulb, MonitorPlay, Route, Store, Users } from "lucide-react";
import type { Locale } from "@/content/types";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { MeetingRequest } from "@/components/contact/MeetingRequest";
import { withBasePath } from "@/lib/site/basePath";

// Illustrative weekday occupancy for the hero "workshop board", in % of capacity from 06:00 to 22:00.
const boardOccupancy = [6, 14, 38, 71, 92, 98, 97, 95, 90, 84, 66, 52, 44, 40, 33, 22, 12];

export function ConsultancyStory({ locale }: { locale: Locale }) {
  const da = locale === "da";
  const t = (en: string, dk: string) => (da ? dk : en);

  const questions = [
    { icon: Store, title: t("How do customers use our site?", "Hvordan bruger kunderne vores område?"), body: t("When they arrive, how long they stay and where the pressure builds. A shared picture before anyone argues about solutions.", "Hvornår de kommer, hvor længe de bliver, og hvor presset opstår. Et fælles billede, før I diskuterer løsninger.") },
    { icon: Coins, title: t("What should we know before investing?", "Hvad skal vi vide, før vi investerer?"), body: t("New spaces, chargers, pricing or a new location. We test the assumptions behind the business case with real activity.", "Nye pladser, ladere, prissætning eller en ny placering. Vi afprøver antagelserne bag business casen med reel aktivitet.") },
    { icon: Route, title: t("How do we turn data into action?", "Hvordan omsætter vi data til handling?"), body: t("You may already have numbers. We help you read them, agree what matters and decide what to try first.", "Måske har I allerede tal. Vi hjælper jer med at læse dem, blive enige om det vigtige og vælge, hvad I prøver først.") }
  ];

  const agenda = [
    { icon: Users, title: t("Understand the situation", "Forstå situationen"), body: t("Who uses the site, what works today and which decision is ahead. We bring your team’s perspectives together.", "Hvem bruger området, hvad fungerer i dag, og hvilken beslutning står I overfor. Vi samler perspektiver fra jeres team.") },
    { icon: MonitorPlay, title: t("Explore the evidence", "Undersøg datagrundlaget"), body: t("We review what you already know alongside Papp Insights, find the gaps and judge whether new measurements would help.", "Vi gennemgår det, I allerede ved, sammen med Papp Insights, finder hullerne og vurderer, om nye målinger vil hjælpe.") },
    { icon: ClipboardList, title: t("Agree the actions", "Aftal handlingerne"), body: t("Prioritise the options, define practical next steps and make clear what to test first.", "Vi prioriterer mulighederne, afklarer praktiske næste skridt og gør det tydeligt, hvad der skal afprøves først.") }
  ];

  const included = [
    { icon: CalendarCheck, text: t("A short call beforehand to agree the question", "En kort samtale på forhånd, hvor vi afklarer spørgsmålet") },
    { icon: Building2, text: t("A working session with your team, on site or online", "En arbejdssession med jeres team, hos jer eller online") },
    { icon: MonitorPlay, text: t("A walkthrough of relevant data in Papp Insights", "En gennemgang af relevante data i Papp Insights") },
    { icon: FileText, text: t("A written summary with priorities and next steps", "Et skriftligt resumé med prioriteter og næste skridt") }
  ];

  const outcomes = [
    { icon: Users, title: t("Shared understanding", "Fælles forståelse"), body: t("A clear problem your team agrees to solve.", "Et klart problem, som teamet er enige om at løse.") },
    { icon: Lightbulb, title: t("Better questions", "Bedre spørgsmål"), body: t("Clarity on what you know and which evidence is missing.", "Overblik over, hvad I ved, og hvilke data der mangler.") },
    { icon: Route, title: t("Practical next steps", "Praktiske næste skridt"), body: t("A prioritised route to measurement, a trial or action.", "En prioriteret vej til måling, forsøg eller handling.") }
  ];

  return <>
    <section className="subpage-hero consultancy-hero">
      <div className="container">
        <div className="consultancy-hero__grid">
          <div className="consultancy-hero__copy">
            <p className="eyebrow">{t("Consultancy for businesses", "Rådgivning til virksomheder")}</p>
            <h1>{t("A clearer view of your next decision.", "Et klarere blik på jeres næste beslutning.")}</h1>
            <p className="hero-lead">{t("When parking, visitors or movement affect your business, we help you understand the situation and decide what comes next.", "Når parkering, besøgende eller bevægelse påvirker jeres forretning, hjælper vi jer med at forstå situationen og beslutte, hvad der skal ske.")}</p>
            <p>{t("Practical workshops, shared analysis and advice grounded in measured activity, not guesswork.", "Praktiske workshops, fælles analyse og rådgivning baseret på målt aktivitet, ikke gætværk.")}</p>
            <div className="consultancy-hero__actions">
              <Button href="#consultancy-meeting">{t("Book a conversation", "Book en samtale")}</Button>
              <Button href="#consultancy-workshop" variant="text">{t("How a workshop works", "Sådan foregår en workshop")}</Button>
            </div>
          </div>
          <WorkshopBoard locale={locale} />
        </div>
      </div>
    </section>

    <Section className="consultancy-questions">
      <div className="service-story-heading"><p className="eyebrow">{t("Typical questions", "Typiske spørgsmål")}</p><h2>{t("Start with the decision, not the data.", "Start med beslutningen, ikke med data.")}</h2></div>
      <div className="consultancy-question-grid">{questions.map(({ icon: Icon, title, body }) => <article key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{body}</p></article>)}</div>
    </Section>

    <Section className="consultancy-workshop" id="consultancy-workshop">
      <div className="consultancy-workshop__grid">
        <div className="consultancy-workshop__media">
          <Image src={withBasePath("/images/corporate/insights-meeting-city.jpg")} alt={t("Reviewing mobility data together", "Fælles gennemgang af mobilitetsdata")} width={1672} height={941} sizes="(max-width: 992px) 100vw, 46vw" />
          <div className="consultancy-included">
            <h3>{t("What’s included", "Det er inkluderet")}</h3>
            <ul>{included.map(({ icon: Icon, text }) => <li key={text}><Icon aria-hidden="true" /><span>{text}</span></li>)}</ul>
          </div>
        </div>
        <div className="consultancy-workshop__copy">
          <p className="eyebrow">{t("The workshop", "Workshoppen")}</p>
          <h2>{t("Your challenge. Our shared working session.", "Jeres udfordring. Vores fælles arbejdsbord.")}</h2>
          <p>{t("For businesses, property teams and operators. We start with what you know and work out together what is missing.", "For virksomheder, ejendomme og operatører. Vi starter med det, I ved, og finder sammen ud af, hvad der mangler.")}</p>
          <ol className="consultancy-agenda">{agenda.map(({ icon: Icon, title, body }) => <li key={title}><span aria-hidden="true"><Icon /></span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
        </div>
      </div>
    </Section>

    <Section className="service-meeting-section consultancy-meeting"><div id="consultancy-meeting"><MeetingRequest locale={locale} source="consultancy" /></div></Section>

    <Section className="workshop-outcomes"><h2>{t("Leave with a direction.", "I går derfra med retning.")}</h2><div className="service-question-grid">{outcomes.map(({ icon: Icon, title, body }) => <article key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{body}</p></article>)}</div></Section>

    <Section className="workshop-platform"><div className="service-story-heading"><p className="eyebrow">Papp Insights</p><h2>{t("Explore the patterns yourself. Make sense of them with us.", "Se mønstrene selv. Forstå dem sammen med os.")}</h2><p>{t("Our workshops are grounded in Papp Insights, our platform for measurements, comparisons and patterns. Explore the data yourself, with our team alongside you to interpret the findings and turn them into practical decisions.", "Vores workshops tager afsæt i Papp Insights, platformen der samler målinger, sammenligninger og mønstre. I kan selv udforske data, mens vi hjælper med at fortolke resultaterne og omsætte dem til beslutninger.")}</p><Link className="papp-button papp-button--secondary" href={`/${locale}/products/insights`}>{t("Explore Papp Insights", "Udforsk Papp Insights")}</Link></div></Section>
  </>;
}

// A small, static "workshop board": one chart, what it shows and what to try next.
function WorkshopBoard({ locale }: { locale: Locale }) {
  const da = locale === "da";
  const t = (en: string, dk: string) => (da ? dk : en);
  const x = (index: number) => 40 + index * (420 / (boardOccupancy.length - 1));
  const y = (value: number) => 170 - value * 1.25;
  const line = boardOccupancy.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  const notes = [
    { label: t("Finding", "Fund"), text: t("Full from 10:00 to 14:00", "Fuldt fra kl. 10 til 14") },
    { label: t("Question", "Spørgsmål"), text: t("Who parks before 09:00?", "Hvem parkerer før kl. 9?") },
    { label: t("Next step", "Næste skridt"), text: t("Trial staff parking off site", "Afprøv personaleparkering et andet sted") }
  ];
  return <figure className="workshop-board" aria-label={t("Workshop board: a car park is full from 10:00 to 14:00 with room in the afternoon", "Workshopbræt: en parkeringsplads er fuld fra kl. 10 til 14 med plads om eftermiddagen")}>
    <header><span className="workshop-board__dot" aria-hidden="true" /><strong>{t("Customer car park", "Kundeparkering")}</strong><span className="workshop-board__tag">{t("Weekdays", "Hverdage")}</span></header>
    <svg viewBox="0 0 480 200" aria-hidden="true">
      <defs><linearGradient id="board-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2a7fc0" stopOpacity=".26" /><stop offset="1" stopColor="#2a7fc0" stopOpacity=".02" /></linearGradient></defs>
      <rect x={x(4) - 6} y="20" width={x(8) - x(4) + 12} height="150" rx="8" fill="#fde9e8" />
      {[0, 50, 100].map((value) => <g key={value}><line x1="40" x2="460" y1={y(value)} y2={y(value)} stroke="#e6edf1" /><text x="32" y={y(value) + 4} textAnchor="end">{value}%</text></g>)}
      <polygon points={`40,170 ${line} 460,170`} fill="url(#board-area)" />
      <polyline points={line} fill="none" stroke="#2a7fc0" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(5)} cy={y(98)} r="5" fill="#f77f87" stroke="#fff" strokeWidth="2" />
      <text x={x(6)} y="36" textAnchor="middle" className="workshop-board__label workshop-board__label--coral">{t("Full", "Fuldt")}</text>
      <text x={x(13)} y={y(40) - 14} textAnchor="middle" className="workshop-board__label">{t("Room to spare", "Ledig plads")}</text>
      {["06", "10", "14", "18", "22"].map((label, index) => <text key={label} x={x(index * 4)} y="192" textAnchor="middle">{label}:00</text>)}
    </svg>
    <ul>{notes.map((note) => <li key={note.label}><span>{note.label}</span><strong>{note.text}</strong></li>)}</ul>
  </figure>;
}
