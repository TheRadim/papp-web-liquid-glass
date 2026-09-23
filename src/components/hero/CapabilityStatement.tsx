"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/content/types";

const capabilities = {
  en: ["traffic counting", "people counting", "parking occupancy data", "parking predictions", "ZIP code analysis", "fleet analysis", "marketing analysis", "mobility analysis", "traffic patterns", "movement analysis"],
  da: ["trafiktælling", "persontælling", "parkeringsdata", "parkeringsprognoser", "postnummeranalyse", "flådeanalyse", "markedsanalyse", "mobilitetsanalyse", "trafikmønstre", "bevægelsesanalyse"]
};

export function CapabilityStatement({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused) return;
    const timer = window.setInterval(() => { if (!motion.matches) setActive((value) => (value + 1) % capabilities[locale].length); }, 3000);
    return () => window.clearInterval(timer);
  }, [locale, paused]);
  return <div className="capability-statement">
    <p aria-hidden="true"><span>{locale === "da" ? "Vi bruger" : "We use"}</span><span className="capability-statement__window">{capabilities[locale].map((phrase, index) => <span key={phrase} className={index === active ? "is-active" : ""}>{phrase}</span>)}</span><span>{locale === "da" ? "til at understøtte bedre mobilitetsbeslutninger." : "to help you make better mobility decisions."}</span></p>
    <p className="visually-hidden">{locale === "da" ? "Vi understøtter bedre mobilitetsbeslutninger med: " : "We help you make better mobility decisions using: "}{capabilities[locale].join(", ")}.</p>
    <button className="capability-statement__pause" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? (locale === "da" ? "Fortsæt" : "Resume") : (locale === "da" ? "Sæt på pause" : "Pause")}</button>
  </div>;
}
