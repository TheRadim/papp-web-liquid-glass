"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { Locale } from "@/content/types";

// Each phrase completes "We turn … into better decisions." with something Papp
// measures or derives, so the sentence always describes what we actually do.
const capabilities = {
  en: ["traffic counts", "people counts", "parking occupancy", "parking forecasts", "dwell times", "visitor origins", "postcode data", "fleet profiles", "charging demand", "traffic patterns"],
  da: ["trafiktal", "persontællinger", "parkeringsbelægning", "parkeringsprognoser", "opholdstider", "besøgendes oprindelse", "postnummerdata", "bilprofiler", "ladebehov", "trafikmønstre"]
};

const ROTATE_MS = 2000;
const GLIDE = "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)";

// useLayoutEffect warns during server rendering; fall back to useEffect there.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * "We turn [phrase] into better decisions." with the phrase rolling like a barrel.
 *
 * How it avoids jumps on every screen size:
 * - The width of every phrase is measured up front, so the slot takes the new
 *   width in the same frame the new phrase starts rolling in (no second pass).
 * - The words around the slot then glide to their new place with a transform
 *   (FLIP), which the GPU animates smoothly even on phones, instead of animating
 *   layout width.
 * - The slot clips only vertically, so a word is never cut at the sides while
 *   the sentence settles.
 */
export function CapabilityStatement({ locale }: { locale: Locale }) {
  const phrases = capabilities[locale];
  const [{ active, previous }, setPosition] = useState<{ active: number; previous: number | null }>({ active: 0, previous: null });
  const [widths, setWidths] = useState<number[] | null>(null);
  const phraseRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const leadRef = useRef<HTMLSpanElement>(null);
  const tailRef = useRef<HTMLSpanElement>(null);
  const lastLeft = useRef<{ lead: number; tail: number } | null>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => {
      if (!motion.matches) setPosition(({ active }) => ({ active: (active + 1) % phrases.length, previous: active }));
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [phrases.length]);

  // Measure all phrase widths once, again when fonts arrive, and when the
  // viewport width changes (phones also fire resize when the address bar moves;
  // those height-only resizes are ignored).
  useIsomorphicLayoutEffect(() => {
    let viewportWidth = window.innerWidth;
    const measure = () => {
      const next = phraseRefs.current.map((node) => (node ? Math.ceil(node.getBoundingClientRect().width) + 2 : 0));
      setWidths((current) => (current && current.every((value, index) => value === next[index]) ? current : next));
    };
    const onResize = () => {
      if (window.innerWidth === viewportWidth) return;
      viewportWidth = window.innerWidth;
      lastLeft.current = null;
      measure();
    };
    measure();
    void document.fonts?.ready.then(measure);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [locale]);

  // FLIP: after the slot changes width, start the surrounding words from where
  // they were and let them glide to their new place.
  useIsomorphicLayoutEffect(() => {
    const lead = leadRef.current;
    const tail = tailRef.current;
    if (!lead || !tail) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const now = { lead: lead.getBoundingClientRect().left, tail: tail.getBoundingClientRect().left };
    const before = lastLeft.current;
    lastLeft.current = now;
    if (!before || reduced) return;
    const shifts: [HTMLSpanElement, number][] = [[lead, before.lead - now.lead], [tail, before.tail - now.tail]];
    for (const [node, shift] of shifts) {
      node.style.transition = "none";
      node.style.transform = `translateX(${shift}px)`;
    }
    void lead.offsetWidth; // commit the starting position before animating
    for (const [node] of shifts) {
      node.style.transition = GLIDE;
      node.style.transform = "translateX(0)";
    }
  }, [active, widths]);

  const lead = locale === "da" ? "Vi omsætter" : "We turn";
  const tail = locale === "da" ? "til bedre beslutninger." : "into better decisions.";
  // Longest possible sentence in characters; the phone layout scales the font from it so the line never wraps.
  const longest = lead.length + tail.length + Math.max(...phrases.map((phrase) => phrase.length)) + 2;
  const slotWidth = widths?.[active];

  return <div className="capability-statement" style={{ "--capability-chars": longest } as CSSProperties}>
    <p aria-hidden="true">
      <span ref={leadRef} className="capability-statement__lead">{lead}</span>
      <span className="capability-statement__window" style={slotWidth ? { width: slotWidth } : undefined}>
        {phrases.map((phrase, index) => <span key={phrase} ref={(node) => { phraseRefs.current[index] = node; }} className={index === active ? "is-active" : index === previous ? "is-leaving" : ""}>{phrase}</span>)}
      </span>
      <span ref={tailRef} className="capability-statement__tail">{tail}</span>
    </p>
    <p className="visually-hidden">{locale === "da" ? "Vi understøtter bedre mobilitetsbeslutninger med: " : "We help you make better mobility decisions using: "}{phrases.join(", ")}.</p>
  </div>;
}
