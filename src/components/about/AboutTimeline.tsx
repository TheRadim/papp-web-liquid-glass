"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Locale } from "@/content/types";
import { withBasePath } from "@/lib/site/basePath";

interface TimelineItem {
  date: Record<Locale, string>;
  title: Record<Locale, string>;
  body: Record<Locale, string>;
  image?: string;
  imageFit?: "cover" | "contain";
}

interface AboutTimelineProps {
  items: TimelineItem[];
  locale: Locale;
}

export function AboutTimeline({ items, locale }: AboutTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const lastScrolledRef = useRef(-1);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function measureActiveItem() {
      const element = timelineRef.current;

      if (!element) {
        return;
      }

      const cards = Array.from(element.querySelectorAll<HTMLElement>("[data-timeline-card]"));
      const target = window.innerHeight * (window.innerWidth < 992 ? 0.42 : 0.52);
      const nextActive = cards.reduce(
        (closest, card, index) => {
          const rect = card.getBoundingClientRect();
          const cardFocus = rect.top + Math.min(rect.height * 0.42, 260);
          const distance = Math.abs(cardFocus - target);

          return distance < closest.distance ? { index, distance } : closest;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY }
      ).index;

      setActiveIndex((current) => (current === nextActive ? current : nextActive));
      // Phones: keep the active year visible in the horizontal date strip. Only move
      // the strip itself, and only when the year changes. Calling scrollIntoView on
      // every scroll frame also nudged the page and cut off touch momentum.
      if (window.innerWidth < 992 && lastScrolledRef.current !== nextActive) {
        lastScrolledRef.current = nextActive;
        const strip = element.querySelector<HTMLElement>(".history-story__nav ol");
        const item = strip?.children[nextActive] as HTMLElement | undefined;
        if (strip && item) {
          strip.scrollTo({ left: item.offsetLeft - (strip.clientWidth - item.offsetWidth) / 2, behavior: "smooth" });
        }
      }
      frameRef.current = 0;
    }

    function onScroll() {
      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(measureActiveItem);
      }
    }

    onScroll();
    const delayedMeasure = window.setTimeout(measureActiveItem, 160);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.clearTimeout(delayedMeasure);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length]);

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, index: number) {
    event.preventDefault();
    const target = timelineRef.current?.querySelector<HTMLElement>(`#timeline-${index}`);

    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="history-story" ref={timelineRef}>
      <nav className="history-story__nav" aria-label={locale === "da" ? "Papp historie" : "Papp history"}>
        <ol role="list">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const isPassed = index < activeIndex;

            return (
              <li className={`${isActive ? "is-active" : ""} ${isPassed ? "is-passed" : ""}`.trim()} key={item.date.da}>
                <a aria-current={isActive ? "step" : undefined} href={`#timeline-${index}`} onClick={(event) => handleNavClick(event, index)}>
                  <span className="history-story__date">{item.date[locale]}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
      <ol className="history-story__stream" role="list">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const isPassed = index < activeIndex;

          return (
            <li
              className={`${isActive ? "is-active" : ""} ${isPassed ? "is-passed" : ""}`.trim()}
              data-timeline-card
              id={`timeline-${index}`}
              key={item.date.da}
            >
              <article className="history-story__card">
                <div className="history-story__summary">
                  <time dateTime={item.date.en}>{item.date[locale]}</time>
                  <h3>{item.title[locale]}</h3>
                </div>
                <p>{item.body[locale]}</p>
                {item.image ? (
                  <div className={`history-story__media history-story__media--${item.imageFit ?? "cover"}`}>
                    <Image src={withBasePath(item.image)} alt="" width={860} height={520} sizes="(max-width: 768px) 100vw, 500px" />
                  </div>
                ) : null}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
