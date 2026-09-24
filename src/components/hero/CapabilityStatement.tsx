"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { Locale } from "@/content/types";

// Each phrase completes "We turn … into better decisions." with something Papp
// measures or derives, so the sentence always describes what we actually do.
const capabilities = {
  en: ["traffic counts", "people counts", "parking occupancy", "parking forecasts", "dwell times", "visitor origins", "postcode data", "fleet profiles", "charging demand", "traffic patterns"],
  da: ["trafiktal", "persontællinger", "parkeringsbelægning", "parkeringsprognoser", "opholdstider", "besøgendes oprindelse", "postnummerdata", "bilprofiler", "ladebehov", "trafikmønstre"]
};

// useLayoutEffect warns during server rendering; fall back to useEffect there.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function CapabilityStatement({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const [width, setWidth] = useState<number | null>(null);
  const [swapping, setSwapping] = useState(false);
  const phraseRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const phone = window.matchMedia("(max-width: 767.98px)");
    let swap = 0;
    const timer = window.setInterval(() => {
      if (motion.matches) return;
      if (!phone.matches) { setActive((value) => (value + 1) % capabilities[locale].length); return; }
      // Phones: fade the whole line out, swap the phrase while it is invisible,
      // then fade back in. The sentence re-centres unseen instead of sliding and
      // resizing in view, which looked like a jump on small screens.
      setSwapping(true);
      swap = window.setTimeout(() => {
        setActive((value) => (value + 1) % capabilities[locale].length);
        setSwapping(false);
      }, 220);
    }, phone.matches ? 2400 : 2000);
    return () => { window.clearInterval(timer); window.clearTimeout(swap); };
  }, [locale]);

  // The rotating window takes the width of the current phrase, so the sentence
  // closes up around it instead of leaving gaps. Re-measure when fonts or the
  // viewport change the phrase width.
  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const phrase = phraseRefs.current[active];
      // Round up and keep a hair of room so the last glyph is never clipped.
      if (phrase) setWidth(Math.ceil(phrase.getBoundingClientRect().width) + 2);
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
  return <div className={`capability-statement${swapping ? " is-swapping" : ""}`} style={{ "--capability-chars": longest } as CSSProperties}>
    <p aria-hidden="true"><span>{lead}</span><span className="capability-statement__window" style={width === null ? undefined : { width }}>{capabilities[locale].map((phrase, index) => <span key={phrase} ref={(node) => { phraseRefs.current[index] = node; }} className={index === active ? "is-active" : ""}>{phrase}</span>)}</span><span>{tail}</span></p>
    <p className="visually-hidden">{locale === "da" ? "Vi understøtter bedre mobilitetsbeslutninger med: " : "We help you make better mobility decisions using: "}{capabilities[locale].join(", ")}.</p>
  </div>;
}
