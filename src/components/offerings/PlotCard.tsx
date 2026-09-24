"use client";
import { useEffect, useRef } from "react";
export type PlotSpec = {
  title: string;
  subtitle: string;
  data: Record<string, unknown>[];
  layout: Record<string, unknown>;
};
const plotConfig = {displaylogo:false, displayModeBar:false, responsive:true, scrollZoom:false, staticPlot:false};
export function PlotCard({ className = "", plot }: { className?: string; plot: PlotSpec }) {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plotNode = plotRef.current;
    if (!plotNode) return;

    let cancelled = false;
    let loadedPlotly: Awaited<typeof import("plotly.js-dist-min")>["default"] | null = null;

    void import("plotly.js-dist-min")
      .then((module) => {
        loadedPlotly = module.default;
        if (cancelled) return;
        void module.default.react(plotNode, plot.data, plot.layout, plotConfig).catch(() => undefined);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      loadedPlotly?.purge(plotNode);
    };
  }, [plot]);

  return (
    <article className={`insights-data-lab__card ${className}`.trim()}>
      <div>
        <h3>{plot.title}</h3>
        <p>{plot.subtitle}</p>
      </div>
      <div className="insights-data-lab__plot" style={{ height: typeof plot.layout.height === "number" ? plot.layout.height : 390, minWidth: 0 }} ref={plotRef} />
    </article>
  );
}
