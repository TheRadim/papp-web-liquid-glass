import { ScanLine, ChartNoAxesCombined, Compass } from "lucide-react";
import type { Locale } from "@/content/types";

export function SolutionOutcomes({ locale }: { locale: Locale }) {
  const da = locale === "da";
  const items = [
    { icon: ScanLine, title: da ? "Mål det, der betyder noget." : "Measure what matters.", body: da ? "Trafik, mennesker, parkering og bevægelse. Den rigtige måling til jeres spørgsmål." : "Traffic, people, parking and movement. The right measurement for your question." },
    { icon: ChartNoAxesCombined, title: da ? "Se mønstrene." : "See the patterns.", body: da ? "Find ledig kapacitet, forstå besøgende og følg ændringer over tid." : "Reveal spare capacity, understand visitors and track change over time." },
    { icon: Compass, title: da ? "Vælg næste skridt." : "Choose the next step.", body: da ? "Et overblik, en rapport eller en workshop. Indsigt, der kan bruges i praksis." : "A dashboard, a report or a workshop. Insight you can put to work." }
  ];
  return <div className="solution-outcomes">
    <div className="solution-outcomes__lead"><p className="eyebrow">{da ? "Fra spørgsmål til handling" : "From question to action"}</p><h2>{da ? "Én klarere vej frem." : "One clearer way forward."}</h2></div>
    <div className="solution-outcomes__grid">{items.map(({ icon: Icon, title, body }) => <article key={title}><Icon size={28} aria-hidden="true" /><h3>{title}</h3><p>{body}</p></article>)}</div>
    <p className="solution-outcomes__deployment">{da ? "Midlertidigt eller permanent. Mobilt eller fast. Batteri eller netstrøm. Tilpasset jeres sted." : "Temporary or permanent. Mobile or fixed. Battery or mains. Adapted to your site."}</p>
  </div>;
}
