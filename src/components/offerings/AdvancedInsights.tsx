"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { Locale } from "@/content/types";
import { PlotCard, type PlotSpec } from "./PlotCard";
import {
  arrivalHours, arrivalIntensity, dailyPeak, dailySummary, fiveMinutes, fleetAgeMedian, fleetAges,
  forecastHigh, forecastHours, forecastLow, forecastMedian, forecastStart, guestOrigins, landscapeDays,
  manufacturers, occupancyByDay, quarterHours, replayActual
} from "@/content/insights/advanced-demo";

const views = [
  { id: "age", en: "Fleet age", da: "Bilernes alder" },
  { id: "brands", en: "Manufacturers", da: "Bilmærker" },
  { id: "origin", en: "Guest origins", da: "Oprindelse" },
  { id: "landscape", en: "Occupancy landscape", da: "Belægningslandskab" },
  { id: "day", en: "Through the day", da: "Gennem dagen" },
  { id: "arrivals", en: "Arrival intensity", da: "Ankomster" },
  { id: "forecast", en: "Forecast", da: "Prognose" }
] as const;
type ViewId = typeof views[number]["id"];

// What each view helps a team answer, shown beneath the chart.
const explanations: Record<ViewId, { en: string; da: string }> = {
  age: { en: "Vehicle age hints at who uses a site and how quickly the fleet is renewing, useful for charging plans and long term demand.", da: "Bilernes alder fortæller noget om brugerne, og hvor hurtigt bilparken fornyes. Nyttigt til ladeplaner og langsigtet efterspørgsel." },
  brands: { en: "See which brands arrive and how electric each of them already is. A quick read on the fleet you are planning for.", da: "Se hvilke mærker der kommer, og hvor stor elandelen allerede er for hvert mærke. Et hurtigt billede af den bilpark, I planlægger for." },
  origin: { en: "Country of registration shows how far a site reaches. Denmark dominates, so colour uses a log scale to keep smaller markets visible.", da: "Registreringslandet viser, hvor langt et sted rækker. Danmark dominerer, så farven bruger en logaritmisk skala, der holder små markeder synlige." },
  landscape: { en: "Every operating day as one ridge. Drag to orbit and spot the days that break the usual pattern.", da: "Hver driftsdag som én ryg. Træk for at rotere og find de dage, der bryder det normale mønster." },
  day: { en: "The typical day with its spread. The band holds the middle half of days, so a narrow band means a predictable site.", da: "Den typiske dag med dens spredning. Båndet rummer den midterste halvdel af dagene, så et smalt bånd betyder et forudsigeligt sted." },
  arrivals: { en: "When vehicles arrive, by weekday and hour. Recurring peaks point to staffing, pricing or signage decisions.", da: "Hvornår bilerne ankommer, fordelt på ugedag og time. Tilbagevendende peaks peger på beslutninger om bemanding, pris eller skiltning." },
  forecast: { en: "Know in the early afternoon how busy the evening will be. The shaded range shows where the day is likely to land, so teams can plan staffing, signage and pricing ahead.", da: "Vid allerede tidligt på eftermiddagen, hvor travlt aftenen bliver. Det skraverede interval viser, hvor dagen sandsynligvis lander, så I kan planlægge bemanding, skiltning og priser i god tid." }
};

const ink = "#444c55";
const muted = "#7a8791";
const grid = "rgba(55, 81, 126, 0.08)";
const blue = "#2a7fc0";
const blueRamp: [number, string][] = [[0, "#eaf3fa"], [0.35, "#a9cdea"], [0.7, "#4d93cf"], [1, "#0b3f73"]];

export function AdvancedInsights({ locale }: { locale: Locale }) {
  const da = locale === "da";
  const [active, setActive] = useState<ViewId>("age");
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767.98px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const plot = useMemo(() => buildPlot(active, locale, compact), [active, locale, compact]);

  return <section className="insights-explorer" aria-label={da ? "Flere analyser i Papp Insights" : "More analysis in Papp Insights"}>
    <div className="insights-explorer__heading">
      <p className="eyebrow">Papp Insights</p>
      <h2>{da ? "Flere måder at læse et sted på." : "More ways to read a site."}</h2>
      <p>{da ? "De samme målinger kan besvare mange spørgsmål. Skift mellem visningerne og udforsk dem." : "The same measurements answer many different questions. Switch between the views and explore them."}</p>
    </div>
    <div className="insights-explorer__tabs" role="tablist" aria-label={da ? "Analysevisninger" : "Analysis views"}>
      {views.map((view) => <button key={view.id} id={`insights-view-${view.id}`} type="button" role="tab" aria-selected={active === view.id} aria-controls="insights-view-panel" className={active === view.id ? "is-active" : undefined} onClick={() => setActive(view.id)}>{view[locale]}</button>)}
    </div>
    {/* Phones get one compact dropdown instead of seven buttons. */}
    <ViewPicker active={active} locale={locale} onChange={setActive} />
    <div id="insights-view-panel" role="tabpanel" aria-labelledby={`insights-view-${active}`}>
      <PlotCard className="insights-explorer__card" plot={plot} />
      <p className="insights-explorer__caption">{explanations[active][locale]}</p>
    </div>
  </section>;
}

// A custom listbox rather than a native select: the native picker opened detached
// from the control on some browsers and was hard to use.
function ViewPicker({ active, locale, onChange }: { active: ViewId; locale: Locale; onChange: (view: ViewId) => void }) {
  const da = locale === "da";
  const id = useId();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const current = views.find((view) => view.id === active) ?? views[0];

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    list.current?.focus();
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  function openList() {
    setFocused(Math.max(0, views.findIndex((view) => view.id === active)));
    setOpen(true);
  }

  function choose(index: number) {
    onChange(views[index].id);
    setOpen(false);
    button.current?.focus();
  }

  function onListKey(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowDown") { event.preventDefault(); setFocused((value) => Math.min(views.length - 1, value + 1)); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setFocused((value) => Math.max(0, value - 1)); }
    else if (event.key === "Home") { event.preventDefault(); setFocused(0); }
    else if (event.key === "End") { event.preventDefault(); setFocused(views.length - 1); }
    else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(focused); }
    else if (event.key === "Escape" || event.key === "Tab") { setOpen(false); if (event.key === "Escape") button.current?.focus(); }
  }

  return <div className={`insights-picker ${open ? "is-open" : ""}`} ref={root}>
    <button ref={button} type="button" className="insights-picker__button" aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-list`} aria-label={`${da ? "Analysevisning" : "Analysis view"}: ${current[locale]}`}
      onClick={() => (open ? setOpen(false) : openList())}
      onKeyDown={(event) => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); openList(); } }}>
      <span>{current[locale]}</span><ChevronDown aria-hidden="true" />
    </button>
    {open ? <ul ref={list} id={`${id}-list`} role="listbox" tabIndex={-1} aria-activedescendant={`${id}-option-${focused}`} aria-label={da ? "Analysevisninger" : "Analysis views"} onKeyDown={onListKey} className="insights-picker__list">
      {views.map((view, index) => <li key={view.id} id={`${id}-option-${index}`} role="option" aria-selected={view.id === active} className={index === focused ? "is-focused" : undefined}
        onPointerEnter={() => setFocused(index)} onClick={() => choose(index)}>
        <span>{view[locale]}</span>{view.id === active ? <Check aria-hidden="true" /> : null}
      </li>)}
    </ul> : null}
  </div>;
}

function baseLayout(compact: boolean): Record<string, unknown> {
  return {
    autosize: true,
    height: compact ? 360 : 470,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: compact ? { l: 44, r: 12, t: 16, b: 52 } : { l: 64, r: 28, t: 24, b: 64 },
    font: { family: "Open Sans, system-ui, sans-serif", color: ink, size: compact ? 10 : 12 },
    hoverlabel: { bgcolor: "#ffffff", bordercolor: "#c8dcea", font: { color: ink } },
    showlegend: false,
    xaxis: { fixedrange: true, gridcolor: grid, zeroline: false, automargin: true, linecolor: grid },
    yaxis: { fixedrange: true, gridcolor: grid, zeroline: false, automargin: true, rangemode: "tozero" }
  };
}

const clock = (hour: number) => `${String(Math.floor(hour)).padStart(2, "0")}:${String(Math.round((hour % 1) * 60)).padStart(2, "0")}`;
const axisTitle = (text: string) => ({ text, font: { color: muted } });

function buildPlot(view: ViewId, locale: Locale, compact: boolean): PlotSpec {
  const da = locale === "da";
  const t = (en: string, dk: string) => (da ? dk : en);
  const layout = baseLayout(compact);
  const number = (value: number) => value.toLocaleString(da ? "da-DK" : "en-GB");

  if (view === "age") {
    const total = fleetAges.reduce((sum, value) => sum + value, 0);
    const labels = fleetAges.map((_, index) => (index === fleetAges.length - 1 ? "20+" : String(index)));
    return {
      title: t("Fleet age profile", "Bilernes aldersprofil"),
      subtitle: t(`${number(total)} unique vehicles with a known age, 71% of all vehicles seen. Median ${fleetAgeMedian.toFixed(1)} years.`, `${number(total)} unikke køretøjer med kendt alder, 71% af alle registrerede. Median ${fleetAgeMedian.toFixed(1).replace(".", ",")} år.`),
      data: [{ type: "bar", x: labels, y: fleetAges, marker: { color: blue, cornerradius: 3 }, hovertemplate: t("%{x} years<br>%{y} vehicles<extra></extra>", "%{x} år<br>%{y} køretøjer<extra></extra>") }],
      layout: {
        ...layout,
        bargap: 0.28,
        xaxis: { ...(layout.xaxis as object), type: "category", title: axisTitle(t("Vehicle age (years)", "Bilens alder (år)")) },
        yaxis: { ...(layout.yaxis as object), title: axisTitle(t("Unique vehicles", "Unikke køretøjer")) },
        shapes: [{ type: "line", xref: "x", x0: fleetAgeMedian, x1: fleetAgeMedian, yref: "paper", y0: 0, y1: 1, line: { color: ink, width: 1.5, dash: "dot" } }],
        annotations: [{ x: fleetAgeMedian, xref: "x", y: 1, yref: "paper", xanchor: "left", yanchor: "top", xshift: 6, showarrow: false, text: t(`Median ${fleetAgeMedian.toFixed(1)} yr`, `Median ${fleetAgeMedian} år`), font: { color: ink, size: compact ? 10 : 12 } }]
      }
    };
  }

  if (view === "brands") {
    const covered = manufacturers.reduce((sum, row) => sum + row.share, 0);
    return {
      title: t("Most common manufacturers", "De mest almindelige bilmærker"),
      subtitle: t(`Tile area is the share of identified vehicles, colour is how electric each brand's arrivals are. The top 16 cover ${Math.round(covered)}%.`, `Feltets areal er andelen af identificerede biler, farven viser hvor stor en del af mærkets ankomster der er elbiler. De 16 største dækker ${Math.round(covered)}%.`),
      data: [{
        type: "treemap",
        labels: manufacturers.map((row) => row.name),
        parents: manufacturers.map(() => ""),
        values: manufacturers.map((row) => row.share),
        customdata: manufacturers.map((row) => row.electric),
        branchvalues: "total",
        tiling: { pad: 3 },
        pathbar: { visible: false },
        root: { color: "rgba(0,0,0,0)" },
        textposition: "middle center",
        marker: { colors: manufacturers.map((row) => row.electric), colorscale: blueRamp, cmin: 0, cmax: 100, line: { color: "#ffffff", width: 3 }, showscale: !compact, colorbar: { title: { text: t("Electric %", "El %"), font: { color: muted } }, thickness: 10, outlinewidth: 0, ticksuffix: "%" } },
        texttemplate: "<b>%{label}</b><br>%{value}%",
        textfont: { family: "Open Sans, system-ui, sans-serif", size: compact ? 10 : 13 },
        hovertemplate: t("<b>%{label}</b><br>%{value}% of vehicles<br>%{customdata}% electric<extra></extra>", "<b>%{label}</b><br>%{value}% af bilerne<br>%{customdata}% elbiler<extra></extra>")
      }],
      layout: { ...layout, margin: { l: 0, r: compact ? 0 : 8, t: 4, b: 4 } }
    };
  }

  if (view === "origin") {
    const ticks = [1, 10, 100, 1000, 10000];
    return {
      title: t("Where guests come from", "Hvor gæsterne kommer fra"),
      subtitle: t("Visits by country of registration. Colour is log scaled, Denmark dwarfs every other market.", "Besøg efter registreringsland. Farven er logaritmisk, Danmark overstiger alle andre markeder."),
      data: [{
        type: "choropleth",
        locationmode: "ISO-3",
        locations: guestOrigins.map((row) => row.iso),
        z: guestOrigins.map((row) => Math.log10(row.visits)),
        text: guestOrigins.map((row) => row[locale]),
        customdata: guestOrigins.map((row) => number(row.visits)),
        zmin: 0,
        zmax: 4.4,
        colorscale: blueRamp,
        marker: { line: { color: "#ffffff", width: 0.6 } },
        showscale: !compact,
        colorbar: { title: { text: t("Visits", "Besøg"), font: { color: muted } }, thickness: 10, outlinewidth: 0, tickvals: ticks.map((tick) => Math.log10(tick)), ticktext: ["1", "10", "100", "1k", "10k"] },
        hovertemplate: t("<b>%{text}</b><br>%{customdata} visits<extra></extra>", "<b>%{text}</b><br>%{customdata} besøg<extra></extra>")
      }],
      layout: {
        ...layout,
        margin: { l: 0, r: 0, t: 0, b: 0 },
        dragmode: false,
        geo: {
          projection: { type: "mercator" },
          lonaxis: { range: compact ? [-6, 32] : [-16, 46] },
          lataxis: { range: [43, 70] },
          showframe: false,
          showcoastlines: false,
          showcountries: true,
          countrycolor: "#ffffff",
          showland: true,
          landcolor: "#e4e8eb",
          showocean: false,
          bgcolor: "rgba(0,0,0,0)"
        }
      }
    };
  }

  if (view === "landscape") {
    const dayLabels = landscapeDays.map((date) => new Intl.DateTimeFormat(da ? "da-DK" : "en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(date));
    return {
      title: t("Occupancy landscape", "Belægningslandskab"),
      subtitle: t("Drag to orbit. Each ridge is one operating day.", "Træk for at rotere. Hver ryg er én driftsdag."),
      data: [{
        type: "surface",
        x: quarterHours,
        y: dayLabels,
        z: occupancyByDay,
        colorscale: blueRamp,
        cmin: 0,
        showscale: !compact,
        colorbar: { title: { text: t("Inside", "Inde"), font: { color: muted } }, thickness: 10, outlinewidth: 0, len: 0.7 },
        contours: { z: { show: true, usecolormap: true, project: { z: true }, width: 1 } },
        hovertemplate: t("%{y}<br>%{x:.2f} h<br>%{z} vehicles inside<extra></extra>", "%{y}<br>kl. %{x:.2f}<br>%{z} biler inde<extra></extra>")
      }],
      layout: {
        ...layout,
        margin: { l: 0, r: 0, t: 0, b: 0 },
        dragmode: "orbit",
        scene: {
          aspectmode: "manual",
          aspectratio: { x: 1.2, y: 1.5, z: 0.5 },
          camera: { eye: { x: -1.2, y: -1.4, z: 0.8 } },
          xaxis: { title: { text: t("Hour", "Time") }, range: [6, 24], gridcolor: "#e3e9ee", backgroundcolor: "rgba(0,0,0,0)" },
          yaxis: { title: { text: "" }, gridcolor: "#e3e9ee", tickfont: { size: compact ? 8 : 10 } },
          zaxis: { title: { text: "" }, gridcolor: "#e3e9ee" }
        }
      }
    };
  }

  if (view === "day") {
    const x = fiveMinutes;
    return {
      title: t("Occupancy through the day", "Belægning gennem dagen"),
      subtitle: t(`Across 17 days, busiest at ${clock(x[dailyPeak.index])} with ${Math.round(dailyPeak.value)} vehicles inside.`, `På tværs af 17 dage, travlest kl. ${clock(x[dailyPeak.index])} med ${Math.round(dailyPeak.value)} biler inde.`),
      data: [
        { type: "scatter", mode: "lines", x, y: dailySummary.map((row) => row.p25), line: { width: 0 }, hoverinfo: "skip", showlegend: false },
        { type: "scatter", mode: "lines", x, y: dailySummary.map((row) => row.p75), line: { width: 0 }, fill: "tonexty", fillcolor: "rgba(42, 127, 192, 0.16)", name: t("Middle half of days", "Midterste halvdel af dagene"), hoverinfo: "skip" },
        { type: "scatter", mode: "lines", x, y: dailySummary.map((row) => row.median), line: { color: blue, width: 2.2 }, name: t("Median", "Median"), hovertemplate: t("%{text}<br>Median %{y:.0f} inside<extra></extra>", "kl. %{text}<br>Median %{y:.0f} inde<extra></extra>"), text: x.map(clock) },
        { type: "scatter", mode: "lines", x, y: dailySummary.map((row) => row.mean), line: { color: "#e0716f", width: 1.8, dash: "dot" }, name: t("Average", "Gennemsnit"), hovertemplate: t("Average %{y:.0f}<extra></extra>", "Gennemsnit %{y:.0f}<extra></extra>") }
      ],
      layout: {
        ...layout,
        showlegend: true,
        hovermode: "x unified",
        margin: { ...(layout.margin as object), t: compact ? 56 : 52 },
        legend: { orientation: "h", traceorder: "normal", x: 0, y: 1.02, yanchor: "bottom", font: { size: compact ? 9 : 11 } },
        xaxis: { ...(layout.xaxis as object), range: [0, 24], tickangle: 0, tickvals: compact ? [0, 6, 12, 18, 24] : [0, 3, 6, 9, 12, 15, 18, 21, 24], ticktext: compact ? ["00:00", "06:00", "12:00", "18:00", "24:00"] : ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"], title: axisTitle(t("Time of day (local)", "Tidspunkt (lokal tid)")) },
        yaxis: { ...(layout.yaxis as object), title: axisTitle(t("Vehicles on site", "Biler på stedet")) },
        annotations: [{ x: x[dailyPeak.index], y: dailyPeak.value, text: `<b>${clock(x[dailyPeak.index])}</b> · ${Math.round(dailyPeak.value)} ${t("inside", "inde")}`, showarrow: true, arrowhead: 0, arrowcolor: muted, ax: 0, ay: -30, font: { color: ink, size: compact ? 10 : 12 } }]
      }
    };
  }

  if (view === "arrivals") {
    const weekdays = da ? ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"] : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return {
      title: t("Arrival intensity by weekday and hour", "Ankomster efter ugedag og time"),
      subtitle: t("Average arrivals per operating day.", "Gennemsnitlige ankomster pr. driftsdag."),
      data: [{
        type: "heatmap",
        x: arrivalHours.map((hour) => String(hour).padStart(2, "0")),
        y: compact ? weekdays.map((day) => day.slice(0, 3)) : weekdays,
        z: arrivalIntensity,
        colorscale: blueRamp,
        zmin: 0,
        xgap: 3,
        ygap: 3,
        showscale: !compact,
        colorbar: { title: { text: t("Arrivals<br>per day", "Ankomster<br>pr. dag"), font: { color: muted } }, thickness: 10, outlinewidth: 0 },
        hovertemplate: t("%{y} %{x}:00<br>%{z} arrivals per day<extra></extra>", "%{y} kl. %{x}<br>%{z} ankomster pr. dag<extra></extra>")
      }],
      layout: {
        ...layout,
        xaxis: { ...(layout.xaxis as object), type: "category", ticks: "", gridcolor: "rgba(0,0,0,0)", title: axisTitle(t("Hour of day (local)", "Time på dagen (lokal tid)")), dtick: compact ? 2 : 1 },
        yaxis: { ...(layout.yaxis as object), autorange: "reversed", ticks: "", gridcolor: "rgba(0,0,0,0)", rangemode: "normal" }
      }
    };
  }

  // Forecast: what was observed until 14:00, and the predicted rest of the day.
  const observedUntil = forecastStart * 12;
  const observedHours = fiveMinutes.slice(0, observedUntil + 1);
  const observed = replayActual.slice(0, observedUntil + 1);
  return {
    title: t("The rest of today, forecast at 14:00", "Resten af dagen, forudsagt kl. 14"),
    subtitle: t(`Tuesday 21 April. From the ${observed.at(-1)} vehicles on site at ${forecastStart}:00, the model forecasts how the rest of the day will unfold.`, `Tirsdag 21. april. Ud fra de ${observed.at(-1)} biler på stedet kl. ${forecastStart} forudsiger modellen, hvordan resten af dagen forløber.`),
    data: [
      { type: "scatter", mode: "lines", x: forecastHours, y: forecastLow, line: { width: 0 }, hoverinfo: "skip", showlegend: false },
      { type: "scatter", mode: "lines", x: forecastHours, y: forecastHigh, line: { width: 0 }, fill: "tonexty", fillcolor: "rgba(42, 127, 192, 0.16)", name: t("Likely range, 80%", "Sandsynligt interval, 80%"), hoverinfo: "skip" },
      { type: "scatter", mode: "lines", x: [forecastStart, ...forecastHours.slice(1)], y: [observed.at(-1), ...forecastMedian.slice(1)], line: { color: blue, width: 2.4, dash: "dash" }, name: t("Forecast", "Prognose"), text: forecastHours.map(clock), hovertemplate: t("%{text}<br>Forecast %{y:.0f} on site<extra></extra>", "kl. %{text}<br>Prognose %{y:.0f} på stedet<extra></extra>") },
      { type: "scatter", mode: "lines", x: observedHours, y: observed, line: { color: "#1f2429", width: 1.6, shape: "hv" }, name: t("Observed", "Observeret"), text: observedHours.map(clock), hovertemplate: t("%{text}<br>%{y} on site<extra></extra>", "kl. %{text}<br>%{y} på stedet<extra></extra>") }
    ],
    layout: {
      ...layout,
      showlegend: true,
      hovermode: "x unified",
      margin: { ...(layout.margin as object), t: compact ? 56 : 52 },
      legend: { orientation: "h", traceorder: "normal", x: 0, y: 1.02, yanchor: "bottom", font: { size: compact ? 9 : 11 } },
      xaxis: { ...(layout.xaxis as object), range: [0, 24], dtick: compact ? 3 : 1, title: axisTitle(t("Hour", "Time")) },
      yaxis: { ...(layout.yaxis as object), title: axisTitle(t("Vehicles on site", "Biler på stedet")) },
      shapes: [{ type: "line", x0: forecastStart, x1: forecastStart, yref: "paper", y0: 0, y1: 1, line: { color: muted, width: 1, dash: "dot" } }],
      annotations: [{ x: forecastStart, y: 1, yref: "paper", xanchor: "right", yanchor: "top", xshift: -6, showarrow: false, text: t("now, 14:00", "nu, kl. 14"), font: { color: muted, size: compact ? 9 : 11 } }]
    }
  };
}
