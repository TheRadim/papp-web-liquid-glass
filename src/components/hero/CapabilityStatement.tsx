"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { Locale } from "@/content/types";

const capabilities = {
  en: ["traffic counting", "people counting", "parking data", "parking predictions", "ZIP code analysis", "fleet analysis", "marketing analysis", "mobility analysis", "traffic patterns", "movement analysis"],
  da: ["trafiktælling", "persontælling", "parkeringsdata", "parkeringsprognoser", "postnummeranalyse", "flådeanalyse", "markedsanalyse", "mobilitetsanalyse", "trafikmønstre", "bevægelsesanalyse"]
};

// useLayoutEffect warns during server rendering; fall back to useEffect there.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function CapabilityStatement({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const [width, setWidth] = useState<number | null>(null);
  const phraseRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => { if (!motion.matches) setActive((value) => (value + 1) % capabilities[locale].length); }, 2000);
    return () => window.clearInterval(timer);
  }, [locale]);

  // The rotating window takes the width of the current phrase, so the sentence
  // closes up around it instead of leaving gaps. Re-measure when fonts or the
  // viewport change the phrase width.
  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const phrase = phraseRefs.current[active];
      if (phrase) setWidth(phrase.getBoundingClientRect().width);
    };
    measure();
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, locale]);

  const lead = locale === "da" ? "Vi omsætter" : "We turn";
  const tail = locale === "da" ? "til bedre beslutninger." : "into better decisions.";
  // Longest possible sentence in characters; the phone layout scales the font from it so the line never wraps.
  const longest = lead.length + tail.length + Math.max(...capabilities[locale].map((phrase) => phrase.length)) + 2;
  return <div className="capability-statement" style={{ "--capability-chars": longest } as CSSProperties}>
    <p aria-hidden="true"><span>{lead}</span><span className="capability-statement__window" style={width === null ? undefined : { width }}>{capabilities[locale].map((phrase, index) => <span key={phrase} ref={(node) => { phraseRefs.current[index] = node; }} className={index === active ? "is-active" : ""}>{phrase}</span>)}</span><span>{tail}</span></p>
    <p className="visually-hidden">{locale === "da" ? "Vi understøtter bedre mobilitetsbeslutninger med: " : "We help you make better mobility decisions using: "}{capabilities[locale].join(", ")}.</p>
  </div>;
}
