"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/content/types";

const capabilities = {
  en: ["traffic counting", "people counting", "parking data", "parking predictions", "ZIP code analysis", "fleet analysis", "marketing analysis", "mobility analysis", "traffic patterns", "movement analysis"],
  da: ["trafiktælling", "persontælling", "parkeringsdata", "parkeringsprognoser", "postnummeranalyse", "flådeanalyse", "markedsanalyse", "mobilitetsanalyse", "trafikmønstre", "bevægelsesanalyse"]
};

export function CapabilityStatement({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => { if (!motion.matches) setActive((value) => (value + 1) % capabilities[locale].length); }, 2000);
    return () => window.clearInterval(timer);
  }, [locale]);
  return <div className="capability-statement">
    <p aria-hidden="true"><span>{locale === "da" ? "Vi omsætter" : "We turn"}</span><span className="capability-statement__window">{capabilities[locale].map((phrase, index) => <span key={phrase} className={index === active ? "is-active" : ""}>{phrase}</span>)}</span><span>{locale === "da" ? "til bedre beslutninger." : "into better decisions."}</span></p>
    <p className="visually-hidden">{locale === "da" ? "Vi understøtter bedre mobilitetsbeslutninger med: " : "We help you make better mobility decisions using: "}{capabilities[locale].join(", ")}.</p>
  </div>;
}
