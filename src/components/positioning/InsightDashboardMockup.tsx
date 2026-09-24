"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/content/types";
import { withBasePath } from "@/lib/site/basePath";
import countries from "@/content/insights/northern-europe-map.json";
import { activityDemo, manufacturerDemo, originDemo } from "@/content/insights/dashboard-demo";

const tabs = [
  { id: "occupancy", en: "Occupancy", da: "Belægning" },
  { id: "origin", en: "Visitor origins", da: "Oprindelse" },
  { id: "vehicles", en: "Vehicle mix", da: "Bilmix" },
  { id: "flow", en: "Activity over time", da: "Aktivitet over tid" }
] as const;
type TabId = typeof tabs[number]["id"];
const colours = ["#0a527e", "#237faf", "#55a8d4", "#8ac4e4", "#b6ddef"];

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
  const title = activeId === "origin" ? (da ? "Hvor kommer bilerne fra?" : "Where do visiting cars come from?") : activeId === "vehicles" ? (da ? "De mest almindelige bilmærker" : "Most common manufacturers") : activeId === "flow" ? (da ? "Daglige mønstre. Et længere perspektiv." : "Daily patterns. A longer perspective.") : (da ? "Hvor meget af kapaciteten bruges?" : "How much capacity is being used?");
  const caption = activeId === "origin" ? (da ? "Oprindelseslande viser områdets opland. Postnummeranalyse kan give et mere lokalt billede, hvor datagrundlaget tillader det." : "Country of origin reveals a site’s catchment. ZIP code analysis can add a more local view where the available data supports it.") : activeId === "vehicles" ? (da ? "Forstå sammensætningen af køretøjer — fra bilmærker og alder til drivmidler — og brug den til at planlægge for de besøgende." : "Understand the vehicle mix — from manufacturers and age to powertrain — to plan around the people using your site.") : activeId === "flow" ? (da ? "Se tilbagevendende peaks, stille perioder og ændringer fra dag til dag, før I ændrer driften eller investerer." : "See recurring peaks, quiet periods and day-to-day changes before adjusting operations or investing.") : (da ? "Sammenlign efterspørgsel og kapacitet. Find ud af, hvornår et sted er presset, og hvornår der er plads til mere." : "Compare demand with capacity. Understand when a site is under pressure and when there is room for more.");
  return <div className="insight-dashboard insight-dashboard--light" aria-label={da ? "Eksempler på mobilitetsindsigt" : "Examples of mobility insight"}>
    <div className="insight-dashboard__tabs" role="tablist" aria-label={da ? "Datavisninger" : "Data views"}>{tabs.map(tab => <button id={`demo-tab-${tab.id}`} key={tab.id} role="tab" type="button" aria-controls="dashboard-demo-panel" aria-selected={activeId === tab.id} className={activeId === tab.id ? "is-active" : undefined} onClick={() => { setActiveId(tab.id); setUserSelected(true); }}>{tab[locale]}</button>)}</div>
    <div id="dashboard-demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${activeId}`}>
      <Link className="insight-dashboard__device-link" href={`/${locale}/products/insights`} aria-label={da ? "Udforsk Papp Insights" : "Explore Papp Insights"}>
        <div className="insight-dashboard__device"><Image className="insight-dashboard__imac" src={withBasePath("/images/analytics/free-imac-blue.svg")} alt="" width={1200} height={900} sizes="(max-width: 768px) 100vw, 1100px" unoptimized />
          <div className={`insight-dashboard__screen dashboard-preview dashboard-preview--${activeId}`} key={activeId}>
            <div className="insight-dashboard__screen-header"><strong className="insight-dashboard__brand"><Image src={withBasePath("/images/brand/papp-logo-round.png")} alt="" width={18} height={18} /><span>Papp Insights</span></strong><span>{da ? "Mobilitetsoverblik" : "Mobility overview"}</span></div>
            <h3 className="dashboard-preview__title">{title}</h3>
            {activeId === "origin" ? <div className="dashboard-preview__origin"><svg viewBox="0 0 240 260" role="img" aria-label={da ? "Kort over Skandinavien og nabolande, farvet efter andel af besøg" : "Map of Scandinavia and neighbouring countries shaded by share of visits"}>{countries.map(country => { const index = originDemo.findIndex(row => row.country === country.name); return <path key={country.name} d={country.path} fill={index < 0 ? "#e9edef" : colours[index]} stroke="#fff" strokeWidth=".7"><title>{country.name}{index >= 0 ? `: ${originDemo[index].share}%` : ""}</title></path>; })}</svg><div className="dashboard-preview__legend"><p>{da ? "Andel af besøg" : "Share of visits"}</p>{originDemo.map((row, index) => <div key={row.country}><i style={{ background: colours[index] }} /><span>{da ? row.da : row.country}</span><strong>{row.share}%</strong></div>)}</div></div>
            : activeId === "vehicles" ? <div className="dashboard-preview__manufacturers">{manufacturerDemo.map((row, index) => <div key={row.name}><span>{row.name}</span><i style={{ width: `${row.share / 24 * 100}%`, background: colours[Math.min(index, 4)] }} /><strong>{row.share}%</strong></div>)}</div>
            : <ActivityChart overview={activeId === "occupancy"} locale={locale} />}
          </div>
        </div>
      </Link>
      <p className="insight-dashboard__caption">{caption}</p>
    </div>
    <p className="dashboard-example-note">{da ? "Et udvalg af mulighederne i Papp Insights. Illustrationer med eksempeldata — ikke live målinger." : "A few possibilities in Papp Insights. Illustrative examples, not live measurements."}</p>
  </div>;
}

function ActivityChart({ overview, locale }: { overview: boolean; locale: Locale }) {
  const values = overview ? activityDemo.slice(48, 72) : activityDemo;
  const points = values.map((value, index) => `${30 + index / (values.length - 1) * 485},${172 - value / 80 * 146}`).join(" ");
  const da = locale === "da";
  return <div className="dashboard-preview__activity"><svg viewBox="0 0 540 205" role="img" aria-label={overview ? (da ? "Eksempel på belægning gennem et døgn" : "Illustrative occupancy over one day") : (da ? "Eksempel på ni dages aktivitet med daglige peaks" : "Illustrative nine-day activity with daily peaks")}>
    {[0,20,40,60,80].map(value => <g key={value}><line x1="30" x2="515" y1={172-value/80*146} y2={172-value/80*146} stroke="#e0e7eb" /><text x="22" y={176-value/80*146} textAnchor="end">{value}</text></g>)}
    <polygon points={`30,172 ${points} 515,172`} fill="#dceef8" /><polyline className="dashboard-preview__trace" pathLength="1" points={points} fill="none" stroke="#2385bd" strokeWidth="1.8" strokeLinejoin="round" />
    <line x1="30" x2="515" y1="26" y2="26" stroke="#e49a51" strokeDasharray="4 3" /><text x="34" y="18" fill="#996223">{da ? "Kapacitet 80" : "Capacity 80"}</text>
    {(overview ? ["00:00","06:00","12:00","18:00","24:00"] : ["20 Apr","22 Apr","24 Apr","26 Apr","28 Apr"]).map((label,index) => <text key={label} x={30+index*121.25} y="193" textAnchor={index===0?"start":index===4?"end":"middle"}>{label}</text>)}
  </svg></div>;
}
