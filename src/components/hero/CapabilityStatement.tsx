"use client";

import { useEffect, useState, type CSSProperties } from "react";
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
  const lead = locale === "da" ? "Vi omsætter" : "We turn";
  const tail = locale === "da" ? "til bedre beslutninger." : "into better decisions.";
  // Longest possible sentence in characters; the phone layout scales the font from it so the line never wraps.
  const longest = lead.length + tail.length + Math.max(...capabilities[locale].map((phrase) => phrase.length)) + 2;
  return <div className="capability-statement" style={{ "--capability-chars": longest } as CSSProperties}>
    <p aria-hidden="true"><span>{lead}</span><span className="capability-statement__window">{capabilities[locale].map((phrase, index) => <span key={phrase} className={index === active ? "is-active" : ""}>{phrase}</span>)}</span><span>{tail}</span></p>
    <p className="visually-hidden">{locale === "da" ? "Vi understøtter bedre mobilitetsbeslutninger med: " : "We help you make better mobility decisions using: "}{capabilities[locale].join(", ")}.</p>
  </div>;
}
