"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale, LocalisedText } from "@/content/types";
import { pick } from "@/lib/i18n/locales";
import { withBasePath } from "@/lib/site/basePath";

interface Deliverable {
  id: "data" | "insights" | "reports";
  label: LocalisedText;
  title: LocalisedText;
  body: LocalisedText;
  includes: LocalisedText[];
  image?: string;
  alt?: LocalisedText;
}

const deliverables: Deliverable[] = [
  {
    id: "data",
    label: { en: "Data", da: "Data" },
    title: { en: "Clean, validated measurements.", da: "Rene, validerede målinger." },
    body: {
      en: "Counts, occupancy and dwell times, checked before they leave us, as exports or a live feed into your own tools.",
      da: "Tællinger, belægning og opholdstider, kontrolleret før de forlader os, som eksport eller live feed til jeres egne værktøjer."
    },
    includes: [
      { en: "CSV and JSON exports", da: "CSV- og JSON-eksport" },
      { en: "Live feed through the Papp API", da: "Live feed via Papp API" },
      { en: "No Papp branding, ready for your deliverable", da: "Uden Papp-branding, klar til jeres leverance" }
    ]
  },
  {
    id: "insights",
    label: { en: "Insights", da: "Indsigt" },
    title: { en: "Dashboards your client can open.", da: "Dashboards, jeres kunde kan åbne." },
    body: {
      en: "Papp Insights gives you and your client live views, comparisons and maps for every site during the project.",
      da: "Papp Insights giver jer og jeres kunde livevisninger, sammenligninger og kort for hvert sted undervejs i projektet."
    },
    includes: [
      { en: "Live and historical views", da: "Live og historiske visninger" },
      { en: "Shared access for your client", da: "Delt adgang for jeres kunde" },
      { en: "Comparisons across sites and periods", da: "Sammenligninger på tværs af steder og perioder" }
    ],
    image: "/images/partnerships/insights-screen.webp",
    alt: { en: "Papp Insights on a screen", da: "Papp Insights på en skærm" }
  },
  {
    id: "reports",
    label: { en: "Reports", da: "Rapporter" },
    title: { en: "Findings, written up.", da: "Konklusioner, skrevet ud." },
    body: {
      en: "Our analysts turn the measurements into a report with clear findings, ready for your deliverable or straight for the decision-makers.",
      da: "Vores analytikere omsætter målingerne til en rapport med klare konklusioner, klar til jeres leverance eller direkte til beslutningstagerne."
    },
    includes: [
      { en: "Analysis and recommendations", da: "Analyser og anbefalinger" },
      { en: "Charts and maps you can reuse", da: "Diagrammer og kort, I kan genbruge" },
      { en: "A walk-through with your team", da: "En gennemgang med jeres team" }
    ],
    image: "/images/partnerships/report-meeting.webp",
    alt: { en: "Papp presenting findings to a partner", da: "Papp præsenterer resultater for en partner" }
  }
];

const sample = `site,date,hour,entries,exits,occupied
herning-c,2026-11-01,08,24,6,31
herning-c,2026-11-01,09,19,8,44
herning-c,2026-11-01,10,15,9,52
herning-c,2026-11-01,11,13,10,57
herning-c,2026-11-01,12,14,11,61`;

export function DeliverableSwitcher({ locale }: { locale: Locale }) {
  const [activeId, setActiveId] = useState<Deliverable["id"]>("data");
  const active = deliverables.find((item) => item.id === activeId) ?? deliverables[0];

  return (
    <div className="pp-deliver">
      <div className="pp-deliver__control" role="tablist" aria-label={locale === "da" ? "Hvad I får leveret" : "What you receive"}>
        {deliverables.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`deliver-${item.id}`}
            aria-selected={item.id === activeId}
            aria-controls="deliver-panel"
            className={item.id === activeId ? "is-active" : undefined}
            onClick={() => setActiveId(item.id)}
          >
            {pick(locale, item.label)}
          </button>
        ))}
      </div>
      <div className="pp-deliver__panel" id="deliver-panel" role="tabpanel" aria-labelledby={`deliver-${active.id}`}>
        <div className="pp-deliver__copy" key={`${active.id}-copy`}>
          <h3>{pick(locale, active.title)}</h3>
          <p>{pick(locale, active.body)}</p>
          <ul>
            {active.includes.map((item) => <li key={item.en}>{pick(locale, item)}</li>)}
          </ul>
        </div>
        <figure className="pp-deliver__visual" key={`${active.id}-visual`}>
          {active.image ? (
            <Image src={withBasePath(active.image)} alt={active.alt ? pick(locale, active.alt) : ""} width={1600} height={1067} sizes="(max-width: 992px) 100vw, 50vw" />
          ) : (
            <pre className="pp-deliver__csv" aria-label={locale === "da" ? "Eksempel på en dataeksport" : "Example data export"}><code>{sample}</code></pre>
          )}
        </figure>
      </div>
    </div>
  );
}
