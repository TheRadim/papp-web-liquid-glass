import type { Locale } from "@/content/types";

export function SolutionOutcomes({ locale }: { locale: Locale }) {
  const da = locale === "da";
  const items = da ? [
    ["Hvad sker der på stedet?", "Trafikmængder, biler på vejene, fodgængerflow og køretøjers bevægelse viser, hvordan et område bruges."],
    ["Hvor er kapaciteten?", "Parkeringsbelægning, opholdstid og variation over tid viser pres, ledig kapacitet og ændringer i adfærd."],
    ["Hvad kan vi lære?", "Flådesammensætning og oprindelses- eller postnummerdata, hvor de er tilgængelige, giver grundlag for segmentering, planlægning og prognoser."]
  ] : [
    ["What happens at the site?", "Traffic volumes, cars on roads, pedestrian flows and vehicle movements reveal how an area is used."],
    ["Where is the capacity?", "Parking occupancy, duration and changes over time reveal pressure, spare capacity and shifts in behaviour."],
    ["What can we learn?", "Fleet composition and origin or ZIP code information, where available, support segmentation, planning and prediction."]
  ];
  return <div className="solution-outcomes">
    <p className="solution-outcomes__lead">{da ? "Skal I mindske søgetrafik, vurdere et forsøg eller bruge eksisterende plads bedre? Vi starter med beslutningen — og vælger derefter målingerne." : "Need to reduce search traffic, assess a trial or make better use of existing space? We start with the decision, then choose the measurements."}</p>
    <div className="solution-outcomes__grid">{items.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
    <p>{da ? "Resultatet kan være et overblik i Insights, en rapport med anbefalinger eller en workshop om næste skridt. Midlertidige, permanente og mobile opsætninger med batteri eller netstrøm tilpasses stedet og projektets varighed." : "The result can be an Insights dashboard, a report with recommendations, or a workshop on next steps. Temporary, permanent and mobile deployments, powered by battery or mains, are adapted to the site and project duration."}</p>
    <p className="eyebrow">{da ? "Produkterne bag målingerne" : "The products behind the measurements"}</p>
  </div>;
}
