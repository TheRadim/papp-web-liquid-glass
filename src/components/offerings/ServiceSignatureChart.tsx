import type { Locale } from "@/content/types";
import type { ServiceSignature } from "@/content/services/service-topic-details";
import { pick } from "@/lib/i18n/locales";

const W = 640;
const H = 280;
const PAD = { top: 16, right: 16, bottom: 34, left: 40 };
const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;

function points(values: number[], max: number) {
  return values.map((value, index) => [
    (PAD.left + (index / (values.length - 1)) * plotW).toFixed(1),
    (PAD.top + plotH - (value / max) * plotH).toFixed(1)
  ]);
}

function linePath(values: number[], max: number) {
  return points(values, max).map(([x, y], index) => `${index ? "L" : "M"}${x},${y}`).join(" ");
}

function areaPath(values: number[], max: number) {
  const bottom = PAD.top + plotH;
  return `${linePath(values, max)} L${PAD.left + plotW},${bottom} L${PAD.left},${bottom} Z`;
}

function Legend({ items }: { items: { label: string; tone: string; dashed?: boolean }[] }) {
  return (
    <ul className="signature-chart__legend">
      {items.map((item) => (
        <li key={item.label}>
          <span style={{ background: item.dashed ? "transparent" : item.tone, borderColor: item.tone }} className={item.dashed ? "is-dashed" : undefined} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function YGrid({ max, steps, suffix = "" }: { max: number; steps: number[]; suffix?: string }) {
  return (
    <g className="signature-chart__grid">
      {steps.map((step) => {
        const y = PAD.top + plotH - (step / max) * plotH;
        return (
          <g key={step}>
            <line x1={PAD.left} x2={PAD.left + plotW} y1={y} y2={y} />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end">{step}{suffix}</text>
          </g>
        );
      })}
    </g>
  );
}

function HourAxis({ hours }: { hours: number[] }) {
  return (
    <g className="signature-chart__axis">
      {hours.map((hour, index) =>
        index % 2 === 0 ? (
          <text key={hour} x={PAD.left + (index / (hours.length - 1)) * plotW} y={H - 10} textAnchor="middle">
            {String(hour).padStart(2, "0")}
          </text>
        ) : null
      )}
    </g>
  );
}

export function ServiceSignatureChart({ chart, locale, label }: { chart: ServiceSignature; locale: Locale; label: string }) {
  const da = locale === "da";

  if (chart.kind === "occupancy") {
    const capY = PAD.top + plotH - (chart.capacity / 100) * plotH;
    return (
      <div className="signature-chart">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
          <defs>
            <linearGradient id="occ-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#1183ba" stopOpacity="0.32" />
              <stop offset="1" stopColor="#1183ba" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <YGrid max={100} steps={[0, 25, 50, 75, 100]} suffix="%" />
          <rect x={PAD.left} y={PAD.top} width={plotW} height={capY - PAD.top} className="signature-chart__zone" />
          <line x1={PAD.left} x2={PAD.left + plotW} y1={capY} y2={capY} className="signature-chart__threshold" />
          <text x={PAD.left + plotW - 4} y={capY - 6} textAnchor="end" className="signature-chart__note">{da ? "Svært at finde plads" : "Hard to find a space"}</text>
          <path d={areaPath(chart.weekday, 100)} fill="url(#occ-fill)" />
          <path d={linePath(chart.weekday, 100)} className="signature-chart__line" stroke="#1183ba" />
          <path d={linePath(chart.saturday, 100)} className="signature-chart__line is-dashed" stroke="#fb867f" />
          <HourAxis hours={chart.hours} />
        </svg>
        <Legend items={[{ label: da ? "Hverdag" : "Weekday", tone: "#1183ba" }, { label: da ? "Lørdag" : "Saturday", tone: "#fb867f", dashed: true }]} />
      </div>
    );
  }

  if (chart.kind === "mode-split") {
    const total = chart.modes.reduce((sum, mode) => sum + mode.value, 0);
    const max = Math.max(...chart.modes.map((mode) => mode.value));
    const formatter = new Intl.NumberFormat(da ? "da-DK" : "en-GB");
    return (
      <div className="signature-chart signature-chart--modes" role="img" aria-label={label}>
        <p className="signature-chart__total"><strong>{formatter.format(total)}</strong> {da ? "passager på et døgn" : "passages in one day"}</p>
        <ul className="signature-modes">
          {chart.modes.map((mode) => (
            <li key={mode.label.en}>
              <span className="signature-modes__label">{pick(locale, mode.label)}</span>
              <span className="signature-modes__bar"><span style={{ width: `${(mode.value / max) * 100}%`, background: mode.tone }} /></span>
              <span className="signature-modes__value">{formatter.format(mode.value)}</span>
            </li>
          ))}
        </ul>
        <div className="signature-directions">
          {chart.directions.map((direction, index) => (
            <div key={direction.label.en} style={{ flexGrow: direction.value }} className={index ? "is-out" : "is-in"}>
              <strong>{direction.value}%</strong>
              <span>{index ? "←" : "→"} {pick(locale, direction.label)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (chart.kind === "heatmap") {
    return (
      <div className="signature-chart" role="img" aria-label={label}>
        <div className="signature-heatmap" style={{ gridTemplateColumns: `auto repeat(${chart.slots.length}, minmax(0, 1fr))` }}>
          <span />
          {chart.slots.map((slot) => <span key={slot} className="signature-heatmap__slot">{slot}</span>)}
          {chart.days.map((day, row) => (
            <div key={day.en} className="signature-heatmap__row">
              <span className="signature-heatmap__day">{pick(locale, day)}</span>
              {chart.values[row].map((value, column) => (
                <span
                  key={chart.slots[column]}
                  className={`signature-heatmap__cell${value >= 0.85 ? " is-full" : ""}`}
                  style={{ background: `rgba(55, 81, 126, ${(0.06 + value * 0.9).toFixed(2)})` }}
                  title={`${Math.round(value * 100)}%`}
                >
                  {value >= 0.85 ? `${Math.round(value * 100)}` : ""}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="signature-heatmap__scale">
          <span>{da ? "Ledigt" : "Room to spare"}</span>
          <i />
          <span>{da ? "Fuldt" : "Full"}</span>
        </div>
      </div>
    );
  }

  if (chart.kind === "before-after") {
    const max = 800;
    const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
    const change = Math.round(((sum(chart.after) - sum(chart.before)) / sum(chart.before)) * 100);
    return (
      <div className="signature-chart">
        <p className="signature-chart__total"><strong>{change}%</strong> {da ? "biler over hele dagen" : "cars over the whole day"}</p>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
          <YGrid max={max} steps={[0, 200, 400, 600, 800]} />
          <path d={`${linePath(chart.before, max)} ${points(chart.after, max).reverse().map(([x, y]) => `L${x},${y}`).join(" ")} Z`} className="signature-chart__gap" />
          <path d={linePath(chart.before, max)} className="signature-chart__line is-dashed" stroke="#6f7f90" />
          <path d={linePath(chart.after, max)} className="signature-chart__line" stroke="#47b2e4" />
          <HourAxis hours={chart.hours} />
        </svg>
        <Legend items={[{ label: pick(locale, chart.beforeLabel), tone: "#6f7f90", dashed: true }, { label: pick(locale, chart.afterLabel), tone: "#47b2e4" }]} />
      </div>
    );
  }

  if (chart.kind === "origins") {
    const max = Math.max(...chart.groups.map((group) => group.value));
    const r = 54;
    const circumference = 2 * Math.PI * r;
    return (
      <div className="signature-chart signature-chart--origins" role="img" aria-label={label}>
        <ul className="signature-modes">
          {chart.groups.map((group, index) => (
            <li key={group.label.en}>
              <span className="signature-modes__label">{pick(locale, group.label)}</span>
              <span className="signature-modes__bar"><span style={{ width: `${(group.value / max) * 100}%`, background: index < 3 ? "#fb6d88" : "#37517e" }} /></span>
              <span className="signature-modes__value">{group.value}%</span>
            </li>
          ))}
        </ul>
        <figure className="signature-donut">
          <svg viewBox="0 0 140 140" aria-hidden="true">
            <circle cx="70" cy="70" r={r} className="signature-donut__track" />
            <circle
              cx="70"
              cy="70"
              r={r}
              className="signature-donut__value"
              strokeDasharray={`${(chart.electricShare / 100) * circumference} ${circumference}`}
              transform="rotate(-90 70 70)"
            />
            <text x="70" y="78" textAnchor="middle">{chart.electricShare}%</text>
          </svg>
          <figcaption>{da ? "kører elbil" : "drive electric"}</figcaption>
        </figure>
      </div>
    );
  }

  // Charging sessions: one lane per space, from 07:00 to 21:00.
  const from = 7;
  const to = 21;
  const hours = Array.from({ length: (to - from) / 2 + 1 }, (_, index) => from + index * 2);
  const stateLabel = { charging: da ? "Lader" : "Charging", idle: da ? "Fuldt opladet, holder stadig" : "Full, still parked", blocked: da ? "Ikke en elbil" : "Not an electric car" };
  const minutes = { charging: 0, idle: 0, blocked: 0 };
  chart.sessions.forEach((session) => { minutes[session.state] += session.end - session.start; });
  const used = minutes.charging + minutes.idle + minutes.blocked;
  return (
    <div className="signature-chart" role="img" aria-label={label}>
      <p className="signature-chart__total">
        <strong>{Math.round((minutes.charging / used) * 100)}%</strong> {da ? "af den optagede tid bliver der faktisk ladet" : "of the occupied time is actually spent charging"}
      </p>
      <div className="signature-lanes">
        {chart.spaces.map((space, lane) => (
          <div key={space.en} className="signature-lanes__row">
            <span className="signature-lanes__label">{pick(locale, space)}</span>
            <div className="signature-lanes__track">
              {chart.sessions.filter((session) => session.space === lane).map((session) => (
                <span
                  key={`${session.start}-${session.state}`}
                  className={`signature-lanes__session is-${session.state}`}
                  style={{ left: `${((session.start - from) / (to - from)) * 100}%`, width: `${((session.end - session.start) / (to - from)) * 100}%` }}
                  title={stateLabel[session.state]}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="signature-lanes__row signature-lanes__axis">
          <span />
          <div>
            {hours.map((hour) => <span key={hour} style={{ left: `${((hour - from) / (to - from)) * 100}%` }}>{String(hour).padStart(2, "0")}</span>)}
          </div>
        </div>
      </div>
      <Legend items={[{ label: stateLabel.charging, tone: "#1183ba" }, { label: stateLabel.idle, tone: "#a9d8ee" }, { label: stateLabel.blocked, tone: "#fb867f" }]} />
    </div>
  );
}
