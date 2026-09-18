"use client";

import { useEffect, useRef } from "react";
import type { GlassConfig, LiquidGlass } from "@ybouane/liquidglass";

// Settings from the supplied LiquidGlass reference. Keep navigation as real DOM;
// only the decorative surface is rasterised, never the charts or 3D scenes.
export const navigationGlass: Partial<GlassConfig> = {
  blurAmount: 0.18, refraction: 0.86, chromAberration: 0,
  edgeHighlight: 0, specular: 0, fresnel: 0.41, distortion: 0,
  cornerRadius: 34, zRadius: 15, opacity: 1, saturation: 0,
  brightness: 0.04, shadowOpacity: 0.33, shadowSpread: 13,
  bevelMode: 0, floating: false
};

export function GlassSurface() {
  const root = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let instance: LiquidGlass | undefined;
    // Native backdrop blur remains available if WebGL is unavailable.
    async function enhance() {
      try {
        const { LiquidGlass } = await import("@ybouane/liquidglass");
        if (disposed || !root.current || !surface.current) return;
        const glass = await LiquidGlass.init({
          root: root.current,
          glassElements: [surface.current],
          defaults: navigationGlass
        });
        if (disposed) glass.destroy();
        else instance = glass;
      } catch {
        // The CSS surface is deliberately complete without the enhancement.
      }
    }
    void enhance();
    return () => { disposed = true; instance?.destroy(); };
  }, []);

  return <div ref={root} className="glass-render-root" aria-hidden="true">
    <div ref={surface} className="glass-render-surface" />
  </div>;
}
