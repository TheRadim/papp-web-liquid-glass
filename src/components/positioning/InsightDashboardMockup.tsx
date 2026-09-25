"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/content/types";
import { withBasePath } from "@/lib/site/basePath";
import countries from "@/content/insights/northern-europe-map.json";
import { activityDemo, drivetrainDemo, manufacturerDemo, originDemo, previewKpis } from "@/content/insights/dashboard-demo";

const tabs = [
  { id: "occupancy", en: "Occupancy", da: "Belægning" },
  { id: "origin", en: "Visitor origins", da: "Oprindelse" },
  { id: "vehicles", en: "Vehicle mix", da: "Bilmix" },
  { id: "flow", en: "Activity over time", da: "Aktivitet over tid" }
] as const;
type TabId = typeof tabs[number]["id"];
const colours = ["#0a527e", "#237faf", "#55a8d4", "#8ac4e4", "#b6ddef"];

const titles: Record<TabId, { en: string; da: string }> = {
  occupancy: { en: "How much capacity is being used?", da: "Hvor meget af kapaciteten bruges?" },
  origin: { en: "Where do visiting cars come from?", da: "Hvor kommer bilerne fra?" },
  vehicles: { en: "Most common manufacturers", da: "De mest almindelige bilmærker" },
  flow: { en: "Daily patterns over nine days", da: "Daglige mønstre over ni dage" }
};

const periods: Record<TabId, { en: string; da: string }> = {
  occupancy: { en: "Today", da: "I dag" },
  origin: { en: "Last 30 days", da: "Seneste 30 dage" },
  vehicles: { en: "Last 30 days", da: "Seneste 30 dage" },
  flow: { en: "20 to 28 Apr", da: "20. til 28. apr." }
};

const captions: Record<TabId, { en: string; da: string }> = {
  occupancy: {
    en: "Compare demand with capacity. Understand when a site is under pressure and when there is room for more.",
    da: "Sammenlign efterspørgsel og kapacitet. Find ud af, hvornår et sted er presset, og hvornår der er plads til mere."
  },
  origin: {
    en: "Country of origin reveals a site’s catchment. ZIP code analysis can add a more local view where the available data supports it.",
    da: "Oprindelseslande viser områdets opland. Postnummeranalyse kan give et mere lokalt billede, hvor datagrundlaget tillader det."
  },
  vehicles: {
    en: "Understand the vehicle mix, from manufacturers and age to drivetrain, and plan around the people using your site.",
    da: "Forstå sammensætningen af køretøjer, fra bilmærker og alder til drivmidler, og planlæg efter dem, der bruger stedet."
  },
  flow: {
    en: "See recurring peaks, quiet periods and day to day changes before adjusting operations or investing.",
    da: "Se tilbagevendende peaks, stille perioder og ændringer fra dag til dag, før I ændrer driften eller investerer."
  }
};

export function InsightDashboardMockup({ locale }: { locale: Locale }) {
  const da = locale === "da";
  const [activeId, setActiveId] = useState<TabId>("occupancy");
  const [userSelected, setUserSelected] = useState(false);
  useEffect(() => {
    if (userSelected) return;
    const timer = window.setInterval(() => {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setActiveId(current => tabs[(tabs.findIndex(tab => tab.id === current) + 1) % tabs.length].id);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [userSelected]);

  return <div className="insight-dashboard insight-dashboard--light" aria-label={da ? "Mobilitetsindsigt i Papp Insights" : "Mobility insight in Papp Insights"}>
    <div className="insight-dashboard__tabs" role="tablist" aria-label={da ? "Datavisninger" : "Data views"}>{tabs.map(tab => <button id={`demo-tab-${tab.id}`} key={tab.id} role="tab" type="button" aria-controls="dashboard-demo-panel" aria-selected={activeId === tab.id} className={activeId === tab.id ? "is-active" : undefined} onClick={() => { setActiveId(tab.id); setUserSelected(true); }}>{tab[locale]}</button>)}</div>
    <div id="dashboard-demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${activeId}`}>
      <Link className="insight-dashboard__device-link" href={`/${locale}/products/insights`} aria-label={da ? "Udforsk Papp Insights" : "Explore Papp Insights"}>
        <div className="insight-dashboard__device"><Image className="insight-dashboard__imac" src={withBasePath("/images/analytics/free-imac-blue.svg")} alt="" width={1200} height={900} sizes="(max-width: 768px) 100vw, 1100px" unoptimized />
          <div className={`insight-dashboard__screen dashboard-preview dashboard-preview--${activeId}`} key={activeId}>
            <div className="dp-topbar">
              <strong className="dp-brand"><Image src={withBasePath("/images/brand/papp-logo-round.png")} alt="" width={18} height={18} /><span>Papp Insights</span></strong>
              <span className="dp-crumb">{da ? "Mobilitetsoverblik" : "Mobility overview"}</span>
            </div>
            <div className="dp-kpis">{previewKpis[activeId].map(kpi => <div className="dp-kpi" key={kpi.en}><span>{kpi[locale]}</span><strong>{kpi.value}<small>{kpi.unit[locale]}</small></strong></div>)}</div>
            <div className={`dp-body dp-body--${activeId}`}>
              <section className="dp-card dp-card--main">
                <header className="dp-card__header"><h3>{titles[activeId][locale]}</h3><span className="dp-pill">{periods[activeId][locale]}</span></header>
                {activeId === "origin" ? <OriginMap locale={locale} />
                  : activeId === "vehicles" ? <ManufacturerBars />
                  : <ActivityChart overview={activeId === "occupancy"} locale={locale} />}
              </section>
              {activeId === "vehicles" ? <section className="dp-card dp-card--side">
                <header className="dp-card__header"><h3>{da ? "Drivmidler" : "Drivetrain"}</h3></header>
                <DrivetrainDonut locale={locale} />
              </section> : null}
            </div>
          </div>
        </div>
      </Link>
      <p className="insight-dashboard__caption">{captions[activeId][locale]}</p>
    </div>
  </div>;
}

// Shade a country by its share on a log scale, so small markets still read as visited.
const originMax = Math.max(...originDemo.map(row => row.share));
const originMin = Math.min(...originDemo.map(row => row.share));
function originColour(share: number) {
  const t = Math.log(share / originMin) / Math.log(originMax / originMin);
  const light = [196, 226, 242];
  const dark = [10, 82, 126];
  return `rgb(${light.map((value, index) => Math.round(value + (dark[index] - value) * t)).join(",")})`;
}
const LEGEND_ROWS = 5;

function OriginMap({ locale }: { locale: Locale }) {
  const da = locale === "da";
  const top = originDemo.slice(0, LEGEND_ROWS);
  const rest = originDemo.slice(LEGEND_ROWS);
  const restShare = Math.round(rest.reduce((sum, row) => sum + row.share, 0));
  return <div className="dashboard-preview__origin">
    <svg viewBox="0 8 240 268" role="img" aria-label={da ? "Kort over Europa, farvet efter andel af besøg" : "Map of Europe shaded by share of visits"}>{countries.map(country => { const row = originDemo.find(item => item.country === country.name); return <path key={country.name} d={country.path} fill={row ? originColour(row.share) : "#e9edef"} stroke="#fff" strokeWidth=".7"><title>{row ? `${da ? row.da : row.country}: ${row.share}%` : country.name}</title></path>; })}</svg>
    <div className="dashboard-preview__legend"><p>{da ? "Andel af besøg" : "Share of visits"}</p>{top.map(row => <div key={row.country}><i style={{ background: originColour(row.share) }} /><span>{da ? row.da : row.country}</span><strong>{row.share}%</strong></div>)}<div><i style={{ background: originColour(rest[0]?.share ?? originMin) }} /><span>{da ? `${rest.length} andre lande` : `${rest.length} more countries`}</span><strong>{restShare}%</strong></div></div>
  </div>;
}

function ManufacturerBars() {
  const max = Math.max(...manufacturerDemo.map(row => row.share));
  return <div className="dashboard-preview__manufacturers">{manufacturerDemo.map((row, index) => <div key={row.name}><span>{row.name}</span><i style={{ width: `${row.share / max * 100}%`, background: colours[Math.min(index, 4)] }} /><strong>{row.share}%</strong></div>)}</div>;
}

function DrivetrainDonut({ locale }: { locale: Locale }) {
  const radius = 15.915; // circumference of 100 makes each share a direct dash length
  // Each segment starts where the previous ones end, beginning at 12 o'clock (offset 25).
  const starts = drivetrainDemo.map((_, index) => drivetrainDemo.slice(0, index).reduce((sum, row) => sum + row.share, 0));
  return <div className="dp-donut">
    <svg viewBox="0 0 42 42" role="img" aria-label={drivetrainDemo.map(row => `${row[locale]} ${row.share}%`).join(", ")}>
      <circle cx="21" cy="21" r={radius} fill="none" stroke="#eef2f4" strokeWidth="6" />
      {drivetrainDemo.map((row, index) => <circle key={row.id} className="dp-donut__segment" cx="21" cy="21" r={radius} fill="none" stroke={row.colour} strokeWidth="6" strokeDasharray={`${row.share - 0.6} ${100 - row.share + 0.6}`} strokeDashoffset={25 - starts[index]} />)}
      <text x="21" y="20.5" textAnchor="middle" className="dp-donut__value">{drivetrainDemo.find(row => row.id === "ev")?.share}%</text>
      <text x="21" y="25.5" textAnchor="middle" className="dp-donut__label">{locale === "da" ? "el" : "electric"}</text>
    </svg>
    <ul>{drivetrainDemo.map(row => <li key={row.id}><i style={{ background: row.colour }} /><span>{row[locale]}</span><strong>{row.share}%</strong></li>)}</ul>
  </div>;
}

function ActivityChart({ overview, locale }: { overview: boolean; locale: Locale }) {
  const values = overview ? activityDemo.slice(48, 72) : activityDemo;
  const points = values.map((value, index) => `${30 + index / (values.length - 1) * 485},${172 - value / 80 * 146}`).join(" ");
  const da = locale === "da";
  return <div className="dashboard-preview__activity"><svg viewBox="0 0 540 205" role="img" aria-label={overview ? (da ? "Belægning gennem et døgn" : "Occupancy over one day") : (da ? "Ni dages aktivitet med daglige peaks" : "Nine days of activity with daily peaks")}>
    <defs><linearGradient id="dp-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2385bd" stopOpacity=".28" /><stop offset="1" stopColor="#2385bd" stopOpacity=".02" /></linearGradient></defs>
    {[0,20,40,60,80].map(value => <g key={value}><line x1="30" x2="515" y1={172-value/80*146} y2={172-value/80*146} stroke="#e8eef1" /><text x="22" y={176-value/80*146} textAnchor="end">{value}</text></g>)}
    <polygon points={`30,172 ${points} 515,172`} fill="url(#dp-area)" /><polyline className="dashboard-preview__trace" pathLength="1" points={points} fill="none" stroke="#2385bd" strokeWidth="2" strokeLinejoin="round" />
    <line x1="30" x2="515" y1="26" y2="26" stroke="#e49a51" strokeDasharray="4 3" /><text x="34" y="18" fill="#996223">{da ? "Kapacitet 80" : "Capacity 80"}</text>
    {(overview ? ["00:00","06:00","12:00","18:00","24:00"] : ["20 Apr","22 Apr","24 Apr","26 Apr","28 Apr"]).map((label,index) => <text key={label} x={30+index*121.25} y="196" textAnchor={index===0?"start":index===4?"end":"middle"}>{label}</text>)}
  </svg></div>;
}
