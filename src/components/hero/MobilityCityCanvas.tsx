"use client";

import { Canvas } from "@react-three/fiber";
import { Component, ReactNode, Suspense, useEffect } from "react";
import { NeutralToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import { CAMERA_VIEWS } from "@/config/mobility-city";
import { MobilityCityScene } from "@/components/hero/MobilityCityScene";
import type { Locale } from "@/content/types";
import type { MobilityArea, MobilityModelStatus, MobilityView } from "@/types/mobility-city";

interface MobilityCityCanvasProps {
  hoveredArea: MobilityArea | null;
  selectedArea: MobilityArea | null;
  view: MobilityView;
  reducedMotion: boolean;
  resetSignal: number;
  onAreaHover: (area: MobilityArea | null) => void;
  onAreaSelect: (area: MobilityArea) => void;
  onReturnToOverview: () => void;
  onStatusChange: (status: MobilityModelStatus) => void;
  showMarkers: boolean;
  locale: Locale;
}

interface MobilityCityErrorBoundaryProps {
  children: ReactNode;
  onError: () => void;
}

class MobilityCityErrorBoundary extends Component<MobilityCityErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

function LoadingStatus({ onStatusChange }: { onStatusChange: (status: MobilityModelStatus) => void }) {
  useEffect(() => {
    onStatusChange("loading");
  }, [onStatusChange]);

  return null;
}

export default function MobilityCityCanvas({
  hoveredArea,
  selectedArea,
  view,
  reducedMotion,
  resetSignal,
  onAreaHover,
  onAreaSelect,
  onReturnToOverview,
  onStatusChange,
  showMarkers,
  locale
}: MobilityCityCanvasProps) {
  return (
    <MobilityCityErrorBoundary onError={() => onStatusChange("error")}>
      <Canvas
        className="mobility-city__canvas"
        camera={{ position: CAMERA_VIEWS.overview.position, fov: CAMERA_VIEWS.overview.fov }}
        dpr={[1, 1.25]}
        frameloop={reducedMotion ? "demand" : "always"}
        shadows="soft"
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          // Neutral keeps the model's colours (ACES washed the greens out and
          // darkened the scene).
          gl.toneMapping = NeutralToneMapping;
          gl.toneMappingExposure = 1;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;

          const renderer = gl as typeof gl & { useLegacyLights?: boolean };
          if ("useLegacyLights" in renderer) {
            renderer.useLegacyLights = false;
          }
        }}
        onPointerMissed={onReturnToOverview}
        onPointerLeave={() => {
          // Leaving the canvas always clears the hover label and cursor, even
          // if the model's own pointer-out events were missed.
          document.body.style.cursor = "";
          onAreaHover(null);
        }}
      >
        <Suspense fallback={<LoadingStatus onStatusChange={onStatusChange} />}>
          <MobilityCityScene
            hoveredArea={hoveredArea}
            selectedArea={selectedArea}
            view={view}
            reducedMotion={reducedMotion}
            resetSignal={resetSignal}
            onAreaHover={onAreaHover}
            onAreaSelect={onAreaSelect}
            onStatusChange={onStatusChange}
            showMarkers={showMarkers}
            locale={locale}
          />
        </Suspense>
      </Canvas>
    </MobilityCityErrorBoundary>
  );
}
