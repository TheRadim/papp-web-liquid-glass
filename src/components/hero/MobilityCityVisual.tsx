"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/types";
import { MobilityCityDetails } from "@/components/hero/MobilityCityDetails";
import { MobilityCityFallback } from "@/components/hero/MobilityCityFallback";
import { MobilityCityControls } from "@/components/hero/MobilityCityControls";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { MobilityArea, MobilityModelStatus, MobilityView } from "@/types/mobility-city";

const MobilityCityCanvas = dynamic(() => import("./MobilityCityCanvas"), {
  ssr: false,
  loading: () => null
});

interface MobilityCityVisualProps {
  activeArea?: MobilityArea | null;
  initialView?: MobilityView;
  lockedArea?: MobilityArea | null;
  onAreaHover?: (area: MobilityArea | null) => void;
  onAreaSelect?: (area: MobilityArea) => void;
  onReturnToOverview?: () => void;
  interactive?: boolean;
  visualMode?: "image" | "video" | "3d";
  showDetails?: boolean;
  showMarkers?: boolean;
  className?: string;
  locale: Locale;
}

function browserSupportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function useWebGLEnabled() {
  const [state, setState] = useState({ enabled: false, resolved: false });

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setState({ enabled: browserSupportsWebGL(), resolved: true });
    }, 0);

    return () => {
      window.clearTimeout(handle);
    };
  }, []);

  return state;
}

function useCompactViewport() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 991.98px)");
    const update = () => setCompact(query.matches);

    update();
    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  return compact;
}

function useNearViewport(rootMargin = "420px 0px") {
  const ref = useRef<HTMLElement | null>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return { ref, nearViewport };
}

export function MobilityCityVisual({
  activeArea = null,
  initialView = "overview",
  lockedArea = null,
  onAreaHover,
  onAreaSelect,
  onReturnToOverview,
  interactive = true,
  visualMode = "3d",
  showDetails = true,
  showMarkers = true,
  className = "",
  locale
}: MobilityCityVisualProps) {
  const reducedMotion = useReducedMotion();
  const webGL = useWebGLEnabled();
  const compactViewport = useCompactViewport();
  const { ref, nearViewport } = useNearViewport(lockedArea ? "24px 0px" : "420px 0px");
  const [hoveredArea, setHoveredArea] = useState<MobilityArea | null>(activeArea);
  const [selectedArea, setSelectedArea] = useState<MobilityArea | null>(lockedArea ?? (initialView === "overview" ? null : initialView));
  const [modelStatus, setModelStatus] = useState<MobilityModelStatus>("idle");
  const [resetSignal, setResetSignal] = useState(0);

  const wants3d = interactive && visualMode === "3d";
  const canUse3d = wants3d && webGL.enabled && nearViewport;
  const showImageFallback = !wants3d || (webGL.resolved && !webGL.enabled) || modelStatus === "error";
  const showLoadingPlate = wants3d && !showImageFallback && modelStatus !== "ready";
  const activeDisplayArea = selectedArea ?? activeArea ?? hoveredArea;
  const view: MobilityView = selectedArea ?? "overview";
  const showSceneMarkers = showMarkers && !compactViewport;
  const showTouchControls = canUse3d && showMarkers && !lockedArea && compactViewport;

  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  const handleHover = useCallback(
    (area: MobilityArea | null) => {
      // While a product is open, hovering the model must not bring back a
      // label: it would still be showing when the visitor returns to overview.
      if (area && selectedArea && !lockedArea) {
        return;
      }

      setHoveredArea(area);
      onAreaHover?.(area);
    },
    [lockedArea, onAreaHover, selectedArea]
  );

  const handleSelect = useCallback(
    (area: MobilityArea) => {
      if (lockedArea) {
        return;
      }

      setSelectedArea(area);
      setHoveredArea(null);
      onAreaHover?.(null);
      onAreaSelect?.(area);
      if (window.matchMedia("(max-width: 991.98px)").matches && showDetails) {
        window.requestAnimationFrame(() => {
          const stage = ref.current;
          if (!stage) return;
          const header = document.querySelector("header");
          const inset = (header?.getBoundingClientRect().height ?? 80) + 12;
          window.scrollTo({ top: window.scrollY + stage.getBoundingClientRect().top - inset, behavior: reducedMotion ? "instant" : "smooth" });
        });
      }
    },
    [lockedArea, onAreaHover, onAreaSelect, reducedMotion, ref, showDetails]
  );

  const handleReturnToOverview = useCallback(() => {
    setSelectedArea(lockedArea ?? null);
    setHoveredArea(null);
    if (!lockedArea) {
      setResetSignal((signal) => signal + 1);
    }
    onReturnToOverview?.();
  }, [lockedArea, onReturnToOverview]);

  return (
    <figure
      ref={ref}
      className={`mobility-city ${canUse3d ? "mobility-city--3d" : "mobility-city--fallback"} ${className}`.trim()}
      data-status={modelStatus}
      data-active={activeDisplayArea ?? "none"}
    >
      <div className="mobility-city__stage">
        {showLoadingPlate ? (
          <div className="mobility-city__loading" aria-label={locale === "da" ? "Indlæser 3D-model" : "Loading 3D model"}>
            <span />
            <p>{locale === "da" ? "Indlæser mobilitetsmodel" : "Loading mobility model"}</p>
          </div>
        ) : null}
        {showImageFallback ? <MobilityCityFallback locale={locale} status={modelStatus} /> : null}
        {canUse3d ? (
          <MobilityCityCanvas
            hoveredArea={hoveredArea}
            selectedArea={selectedArea}
            view={view}
            reducedMotion={reducedMotion}
            resetSignal={resetSignal}
            onAreaHover={handleHover}
            onAreaSelect={handleSelect}
            onReturnToOverview={handleReturnToOverview}
            onStatusChange={setModelStatus}
            showMarkers={showSceneMarkers}
            locale={locale}
          />
        ) : null}
      </div>
      {showTouchControls ? (
        <div className="mobility-city__touch-controls">
          <MobilityCityControls activeArea={activeDisplayArea ?? null} locale={locale} onAreaHover={handleHover} onAreaSelect={handleSelect} />
        </div>
      ) : null}
      {showDetails && selectedArea ? <MobilityCityDetails area={selectedArea} locale={locale} selected onReturnToOverview={handleReturnToOverview} /> : null}
    </figure>
  );
}
