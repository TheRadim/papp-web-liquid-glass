"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { HomeContent } from "@/content/home/home";

interface ProcessTimelineProps {
  steps: HomeContent["process"]["steps"];
}

const PHONE = "(max-width: 575.98px)";

/**
 * Scroll-driven steps with a sticky step number.
 *
 * Tablet and desktop: the number sticks at a fixed line near the top of the
 * viewport, and the card whose top edge is closest to that line is the active
 * one, so the active card and its number line up. The first card starts level
 * with the number, and the number is exactly as tall as the last card, so the
 * two leave the screen together instead of the card drifting off early.
 *
 * Phones: the number sits in a sticky bar and the card nearest the middle of
 * the screen is active.
 */
export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastHeight, setLastHeight] = useState<number | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const phone = window.matchMedia(PHONE);

    function updateActiveStep() {
      const line = phone.matches || !numberRef.current
        ? window.innerHeight * 0.52
        : numberRef.current.getBoundingClientRect().top;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        // List items are not transformed, so their edges do not wobble with the card animation.
        const anchor = phone.matches ? rect.top + rect.height * 0.5 : rect.top;
        const distance = Math.abs(anchor - line);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    }

    function onScroll() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveStep);
    }

    // Keep the sticky number as tall as the last card (see the note above).
    const lastItem = itemRefs.current[steps.length - 1];
    const observer = new ResizeObserver(() => {
      setLastHeight(lastItem ? Math.round(lastItem.getBoundingClientRect().height) : null);
      onScroll();
    });
    if (lastItem) observer.observe(lastItem);

    updateActiveStep();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    phone.addEventListener("change", onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      phone.removeEventListener("change", onScroll);
    };
  }, [steps.length]);

  return (
    <div className="process-timeline" style={lastHeight ? ({ "--process-last-card": `${lastHeight}px` } as CSSProperties) : undefined}>
      <aside className="process-timeline__sticky" aria-hidden="true">
        <span ref={numberRef} className="process-timeline__number">{String(activeIndex + 1).padStart(2, "0")}</span>
      </aside>
      <ol className="process-timeline__stream" role="list">
        {steps.map((step, index) => (
          <li
            className={`${index === activeIndex ? "is-active" : ""} ${index < activeIndex ? "is-passed" : ""}`}
            key={step.title}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
          >
            <article className={`process-flow__step process-flow__step--${index + 1}`}>
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
