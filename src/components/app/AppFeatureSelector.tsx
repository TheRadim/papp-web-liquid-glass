"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight, Info, Map, MapPinned, Navigation, Search, SlidersHorizontal } from "lucide-react";
import { company } from "@/content/global/company";
import type { Locale } from "@/content/types";
import { withBasePath } from "@/lib/site/basePath";

interface AppFeature {
  title: Record<Locale, string>;
  body: Record<Locale, string>;
}

interface AppFeatureSelectorProps {
  features: AppFeature[];
  locale: Locale;
}

const AUTO_CYCLE_MS = 1800; // 1.3 seconds stable + 0.5 second crossfade.
const icons = [MapPinned, Navigation, Search, Map, SlidersHorizontal, MapPinned];
export function AppFeatureSelector({ features, locale }: AppFeatureSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [userSelected, setUserSelected] = useState(false);
  const swipeStartRef = useRef<number | null>(null);
  const activeFeature = features[activeIndex];
  if (loadedImages[activeIndex] && displayedIndex !== activeIndex) {
    setDisplayedIndex(activeIndex);
  }

  function showFeature(index: number) {
    setActiveIndex((index + features.length) % features.length);
    setUserSelected(true);
  }

  function handleSwipeEnd(clientX: number) {
    const swipeStart = swipeStartRef.current;
    swipeStartRef.current = null;

    if (swipeStart === null) {
      return;
    }

    const delta = clientX - swipeStart;

    if (Math.abs(delta) < 42) {
      return;
    }

    showFeature(delta < 0 ? activeIndex + 1 : activeIndex - 1);
  }

  useEffect(() => {
    if (userSelected || features.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % features.length);
    }, AUTO_CYCLE_MS);

    return () => window.clearInterval(timer);
  }, [features.length, userSelected]);

  return (
    <div className="app-feature-selector">
      <div className="app-feature-selector__stage">
        <h2 className="app-feature-selector__mobile-title">{activeFeature.title[locale]}</h2>
        <div
          className="app-feature-selector__phone-wrap"
          onPointerDown={(event) => {
            swipeStartRef.current = event.clientX;
          }}
          onPointerLeave={(event) => handleSwipeEnd(event.clientX)}
          onPointerUp={(event) => handleSwipeEnd(event.clientX)}
        >
          <button
            aria-label={locale === "da" ? "Forrige appfunktion" : "Previous app feature"}
            className="app-feature-selector__arrow app-feature-selector__arrow--prev"
            onClick={() => showFeature(activeIndex - 1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={22} />
          </button>
          <div className="app-feature-selector__phone app-feature-selector__phone--crossfade" aria-busy={!loadedImages[activeIndex]}>
            {features.map((feature, index) => (
              <Image
                key={index}
                className={displayedIndex === index && loadedImages[index] ? "is-visible" : ""}
                src={withBasePath(`/images/app/feature-${index + 1}.webp`)}
                alt={displayedIndex === index ? feature.title[locale] : ""}
                aria-hidden={displayedIndex !== index}
                width={600}
                height={1300}
                loading="eager"
                unoptimized
                onLoad={() => setLoadedImages((current) => ({ ...current, [index]: true }))}
              />
            ))}
          </div>
          <button
            aria-label={locale === "da" ? "Næste appfunktion" : "Next app feature"}
            className="app-feature-selector__arrow app-feature-selector__arrow--next"
            onClick={() => showFeature(activeIndex + 1)}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={22} />
          </button>
        </div>
        <article className="app-feature-selector__panel" id="app-feature-panel" role="tabpanel">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <h2>{activeFeature.title[locale]}</h2>
          <p>{activeFeature.body[locale]}</p>
          <div className="store-badges app-feature-selector__badges" aria-label={locale === "da" ? "Download appen" : "Download the app"}>
            <a href={company.appStoreUrl} target="_blank" rel="noreferrer">
              <Image src={withBasePath("/images/app/appstore-badge.png")} alt="Download on the App Store" width={193} height={66} />
            </a>
            <a href={company.googlePlayUrl} target="_blank" rel="noreferrer">
              <Image src={withBasePath("/images/app/googleplay-badge.png")} alt="Get it on Google Play" width={193} height={65} />
            </a>
          </div>
        </article>
      </div>
      <div className="app-feature-selector__buttons" role="tablist" aria-label={locale === "da" ? "Appfunktioner" : "App features"}>
        {features.map((feature, index) => {
          const Icon = icons[index] ?? Info;

          return (
            <button
              aria-label={feature.title[locale]}
              aria-controls="app-feature-panel"
              aria-selected={activeIndex === index}
              className={activeIndex === index ? "is-active" : undefined}
              key={feature.title.en}
              onClick={() => showFeature(index)}
              role="tab"
              title={feature.title[locale]}
              type="button"
            >
              <span className="app-feature-selector__icon">
                <Icon aria-hidden="true" size={22} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
