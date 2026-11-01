"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Locale } from "@/content/types";

type EndpointId = "occupancy" | "counts" | "origins";

const hours = ["06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];

// Illustrative demo data for one site in Herning; shapes follow the API examples.
const occupancy = [6, 14, 31, 44, 52, 57, 61, 64, 58, 55, 49, 41, 30, 19, 11];
const countsIn = [8, 17, 24, 19, 15, 13, 14, 12, 9, 11, 10, 7, 5, 3, 2];
const countsOut = [1, 3, 6, 8, 9, 10, 11, 9, 14, 13, 15, 14, 16, 12, 9];
const origins = [
  { name: "Herning", visits: 2372 },
  { name: "Ikast-Brande", visits: 2038 },
  { name: "Silkeborg", visits: 1633 },
  { name: "Viborg", visits: 1422 },
  { name: "Holstebro", visits: 1122 },
  { name: "Ringkøbing-Skjern", visits: 934 }
];

const endpoints: Record<EndpointId, { label: { en: string; da: string }; path: string; ms: number; caption: { en: string; da: string } }> = {
  occupancy: {
    label: { en: "Occupancy", da: "Belægning" },
    path: "/v1/sites/herning-centrum/occupancy?date=2026-11-01&interval=hour",
    ms: 42,
    caption: { en: "Occupied spaces through the day, out of 80.", da: "Optagne pladser gennem dagen, ud af 80." }
  },
  counts: {
    label: { en: "Counts", da: "Tællinger" },
    path: "/v1/sites/herning-centrum/counts?date=2026-11-01&interval=hour",
    ms: 57,
    caption: { en: "Cars driving in and out, per hour.", da: "Biler ind og ud, pr. time." }
  },
  origins: {
    label: { en: "Origins", da: "Oprindelse" },
    path: "/v1/sites/herning-centrum/origins?level=municipality&days=30",
    ms: 63,
    caption: { en: "Visits in the last 30 days by home municipality.", da: "Besøg de seneste 30 dage efter hjemkommune." }
  }
};

function responseFor(id: EndpointId) {
  if (id === "occupancy") {
    return {
      site: "herning-centrum",
      capacity: 80,
      interval: "hour",
      series: occupancy.slice(0, 4).map((occupied, index) => ({ time: `${hours[index]}:00`, occupied })),
      more: occupancy.length - 4
    };
  }
  if (id === "counts") {
    return {
      site: "herning-centrum",
      interval: "hour",
      series: countsIn.slice(0, 3).map((entries, index) => ({ time: `${hours[index]}:00`, in: entries, out: countsOut[index] })),
      more: countsIn.length - 3
    };
  }
  return {
    site: "herning-centrum",
    level: "municipality",
    origins: origins.slice(0, 3).map((row) => ({ name: row.name, visits: row.visits })),
    more: origins.length - 3
  };
}

/** Pretty JSON with light syntax colouring; `more` becomes a "… n more" line. */
function JsonView({ value }: { value: Record<string, unknown> }) {
  const { more, ...rest } = value as { more?: number } & Record<string, unknown>;
  const text = JSON.stringify(rest, null, 2).replace(/\n(\s*)\]/, more ? `,\n$1  … ${more} more\n$1]` : "\n$1]");
  const parts: ReactNode[] = [];
  const pattern = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)|(… \d+ more)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1] && match[2]) parts.push(<span key={key++} className="json-key">{match[1]}</span>, match[2]);
    else if (match[1]) parts.push(<span key={key++} className="json-string">{match[1]}</span>);
    else if (match[3]) parts.push(<span key={key++} className="json-number">{match[3]}</span>);
    else parts.push(<span key={key++} className="json-more">{match[4]}</span>);
    last = pattern.lastIndex;
  }
  parts.push(text.slice(last));
  return <pre><code>{parts}</code></pre>;
}

function OccupancyChart({ active, onHover }: { active: number | null; onHover: (index: number | null) => void }) {
  const width = 520;
  const height = 180;
  const x = (index: number) => 28 + (index / (occupancy.length - 1)) * (width - 44);
  const y = (value: number) => height - 24 - (value / 80) * (height - 44);
  const line = occupancy.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Occupancy by hour" onMouseLeave={() => onHover(null)}>
      <line x1={28} x2={width - 16} y1={y(80)} y2={y(80)} className="chart-capacity" />
      <text x={30} y={y(80) - 6} className="chart-label">80</text>
      <polygon points={`${x(0)},${y(0)} ${line} ${x(occupancy.length - 1)},${y(0)}`} className="chart-area" />
      <polyline points={line} className="chart-line" />
      {occupancy.map((value, index) => (
        <g key={index} onMouseEnter={() => onHover(index)}>
          <rect x={x(index) - 16} y={0} width={32} height={height} fill="transparent" />
          <circle cx={x(index)} cy={y(value)} r={active === index ? 5 : 0} className="chart-dot" />
          {index % 2 === 0 ? <text x={x(index)} y={height - 6} textAnchor="middle" className="chart-label">{hours[index]}</text> : null}
        </g>
      ))}
    </svg>
  );
}

function CountsChart({ active, onHover }: { active: number | null; onHover: (index: number | null) => void }) {
  const width = 520;
  const height = 180;
  const max = 26;
  const step = (width - 44) / countsIn.length;
  const bar = (value: number) => (value / max) * (height - 44);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Cars in and out by hour" onMouseLeave={() => onHover(null)}>
      {countsIn.map((value, index) => {
        const left = 28 + index * step;
        const dim = active !== null && active !== index;
        return (
          <g key={index} onMouseEnter={() => onHover(index)} opacity={dim ? 0.45 : 1}>
            <rect x={left} y={0} width={step} height={height} fill="transparent" />
            <rect x={left + step * 0.14} y={height - 24 - bar(value)} width={step * 0.34} height={bar(value)} rx={2} className="chart-bar" />
            <rect x={left + step * 0.52} y={height - 24 - bar(countsOut[index])} width={step * 0.34} height={bar(countsOut[index])} rx={2} className="chart-bar chart-bar--out" />
            {index % 2 === 0 ? <text x={left + step / 2} y={height - 6} textAnchor="middle" className="chart-label">{hours[index]}</text> : null}
          </g>
        );
      })}
    </svg>
  );
}

function OriginsChart({ active, onHover }: { active: number | null; onHover: (index: number | null) => void }) {
  const max = origins[0].visits;
  return (
    <div className="api-explorer__bars" onMouseLeave={() => onHover(null)}>
      {origins.map((row, index) => (
        <div key={row.name} className={active !== null && active !== index ? "is-dim" : undefined} onMouseEnter={() => onHover(index)}>
          <span>{row.name}</span>
          <i style={{ width: `${(row.visits / max) * 100}%` }} />
          <strong>{row.visits.toLocaleString("da-DK")}</strong>
        </div>
      ))}
    </div>
  );
}

export function ApiExplorer({ locale }: { locale: Locale }) {
  const da = locale === "da";
  const [endpoint, setEndpoint] = useState<EndpointId>("occupancy");
  const [hovered, setHovered] = useState<number | null>(null);
  const response = useMemo(() => responseFor(endpoint), [endpoint]);
  const info = endpoints[endpoint];

  const readout = (() => {
    if (hovered === null) return info.caption[locale];
    if (endpoint === "occupancy") return `${hours[hovered]}:00 · ${occupancy[hovered]} ${da ? "af 80 optaget" : "of 80 occupied"}`;
    if (endpoint === "counts") return `${hours[hovered]}:00 · ${countsIn[hovered]} ${da ? "ind" : "in"}, ${countsOut[hovered]} ${da ? "ud" : "out"}`;
    return `${origins[hovered].name} · ${origins[hovered].visits.toLocaleString("da-DK")} ${da ? "besøg" : "visits"}`;
  })();

  return (
    <div className="api-explorer">
      <div className="api-explorer__tabs" role="tablist" aria-label={da ? "Eksempler på kald" : "Example calls"}>
        {(Object.keys(endpoints) as EndpointId[]).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={endpoint === id}
            className={endpoint === id ? "is-active" : undefined}
            onClick={() => {
              setEndpoint(id);
              setHovered(null);
            }}
          >
            {endpoints[id].label[locale]}
          </button>
        ))}
      </div>
      <div className="api-explorer__code" role="tabpanel">
        <div className="api-explorer__request">
          <span className="api-sample__method">GET</span>
          <code>{info.path}</code>
        </div>
        <div className="api-explorer__status">
          <span className="api-explorer__ok">200 OK</span>
          <span>{info.ms} ms</span>
          <span>application/json</span>
        </div>
        <JsonView value={response} key={endpoint} />
      </div>
      <div className="api-explorer__chart">
        <p className="api-explorer__readout" aria-live="polite">{readout}</p>
        {endpoint === "occupancy" ? <OccupancyChart active={hovered} onHover={setHovered} /> : null}
        {endpoint === "counts" ? (
          <>
            <CountsChart active={hovered} onHover={setHovered} />
            <p className="api-explorer__legend">
              <span><i className="is-in" />{da ? "Ind" : "In"}</span>
              <span><i className="is-out" />{da ? "Ud" : "Out"}</span>
            </p>
          </>
        ) : null}
        {endpoint === "origins" ? <OriginsChart active={hovered} onHover={setHovered} /> : null}
        <p className="api-explorer__note">{da ? "Eksempeldata fra ét sted. Diagrammet er tegnet ud fra API-svaret." : "Example data from one site. The chart is drawn from the API response."}</p>
      </div>
    </div>
  );
}
