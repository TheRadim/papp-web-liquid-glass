/**
 * Canvas drawings for the live data layer in the 3D city: the small
 * "FREE n" sign (LED dot-matrix look) and the dashboard shown on the
 * floating Insights panel (same light, minimal style as the original art).
 */

const DOT_FONT: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"]
};

export const SIGN_CANVAS = { width: 320, height: 160 };
/** Same aspect as the original panel art (1672 x 941), at half size. */
export const DASHBOARD_CANVAS = { width: 836, height: 470 };

const FONT_STACK = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const BLUE = "#2f6fb4";
const BLUE_LIGHT = "#c9d3df";
const INK = "#1f2a33";
const MUTED = "#8a949c";
const GREEN = "#2fbf71";

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = "left", weight = 600) {
  ctx.font = `${weight} ${size}px ${FONT_STACK}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(value, x, y);
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, glow = 0) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = glow;
  ctx.fill();
  ctx.shadowBlur = 0;
}

/** Small parking sign: "FREE" and an LED dot-matrix number. */
export function drawFreeSign(ctx: CanvasRenderingContext2D, free: number, label: string) {
  const { width, height } = SIGN_CANVAS;
  ctx.clearRect(0, 0, width, height);
  roundedRect(ctx, 3, 3, width - 6, height - 6, 22);
  ctx.fillStyle = "#1c2024";
  ctx.fill();
  ctx.strokeStyle = "#3a4148";
  ctx.lineWidth = 5;
  ctx.stroke();

  text(ctx, label, 34, height / 2 + 2, 44, "#e9eef1", "left", 800);

  const glyph = DOT_FONT[String(Math.max(0, Math.min(9, free)))] ?? DOT_FONT[" "];
  const pitch = 16;
  const left = width - 34 - pitch * 5;
  const top = (height - pitch * 7) / 2;
  for (let row = 0; row < 7; row += 1) {
    for (let column = 0; column < 5; column += 1) {
      const lit = glyph[row][column] === "1";
      dot(ctx, left + column * pitch + pitch / 2, top + row * pitch + pitch / 2, pitch * 0.36, lit ? "#46ff7a" : "#16271b", lit ? 12 : 0);
    }
  }
}

export interface DashboardState {
  /** 0..1, eased towards the live value. */
  frontOccupancy: number;
  frontFree: number;
  frontTotal: number;
  /** Main lot vehicle count over time, oldest first. */
  history: number[];
  vehicles: number;
  entries: number;
  /** 0..1 highlight on a tile after a data pulse arrives. */
  flashFront: number;
  flashMain: number;
  livePulse: boolean;
  labels: {
    title: string;
    live: string;
    free: string;
    frontLot: string;
    mainLot: string;
    vehicles: string;
    entries: string;
    updated: string;
  };
}

function tile(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, flash: number) {
  roundedRect(ctx, x, y, w, h, 16);
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.fill();
  ctx.lineWidth = 2 + flash * 3;
  ctx.strokeStyle = flash > 0.01 ? `rgba(88, 191, 233, ${0.35 + flash * 0.65})` : "rgba(225, 220, 216, 1)";
  ctx.stroke();
}

function legend(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) {
  dot(ctx, x + 8, y, 8, color);
  text(ctx, label, x + 24, y + 1, 17, MUTED, "left", 600);
}

/**
 * Dashboard on the Insights panel. The panel's UVs use roughly x 41-799,
 * y 70-396 of this canvas, so content stays inside that card area.
 */
export function drawInsightsDashboard(ctx: CanvasRenderingContext2D, state: DashboardState) {
  const { width, height } = DASHBOARD_CANVAS;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f7f3f0";
  ctx.fillRect(0, 0, width, height);

  // Header
  text(ctx, state.labels.title, 64, 98, 20, INK, "left", 700);
  dot(ctx, 714, 98, 6, state.livePulse ? GREEN : "#a9dcbf", state.livePulse ? 8 : 0);
  text(ctx, state.labels.live, 728, 99, 16, MUTED, "left", 700);

  // Tile 1: front lot occupancy donut (on-ground sensors)
  tile(ctx, 55, 122, 190, 190, state.flashFront);
  const cx = 150;
  const cy = 217;
  const radius = 64;
  ctx.lineWidth = 24;
  ctx.lineCap = "butt";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = BLUE_LIGHT;
  ctx.stroke();
  const occupied = Math.max(0, Math.min(1, state.frontOccupancy));
  if (occupied > 0.001) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + occupied * Math.PI * 2);
    ctx.strokeStyle = BLUE;
    ctx.stroke();
  }
  text(ctx, `${state.frontFree}/${state.frontTotal}`, cx, cy - 6, 38, INK, "center", 700);
  text(ctx, state.labels.free, cx, cy + 26, 17, MUTED, "center", 600);

  // Tile 2: main lot vehicle count line (camera)
  tile(ctx, 277, 122, 256, 190, state.flashMain);
  const chart = { x: 312, y: 150, w: 200, h: 126 };
  const values = state.history.length > 1 ? state.history : [state.vehicles, state.vehicles];
  const low = Math.min(...values) - 2;
  const high = Math.max(...values) + 2;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
  ctx.lineWidth = 1;
  for (let line = 0; line <= 3; line += 1) {
    const y = chart.y + (chart.h * line) / 3;
    ctx.beginPath();
    ctx.moveTo(chart.x, y);
    ctx.lineTo(chart.x + chart.w, y);
    ctx.stroke();
    text(ctx, String(Math.round(high - ((high - low) * line) / 3)), chart.x - 10, y, 13, "#b4b9be", "right", 600);
  }
  const point = (value: number, index: number) => ({
    x: chart.x + (chart.w * index) / (values.length - 1),
    y: chart.y + chart.h - ((value - low) / (high - low)) * chart.h
  });
  const fill = ctx.createLinearGradient(0, chart.y, 0, chart.y + chart.h);
  fill.addColorStop(0, "rgba(47, 111, 180, 0.28)");
  fill.addColorStop(1, "rgba(47, 111, 180, 0)");
  ctx.beginPath();
  values.forEach((value, index) => {
    const { x, y } = point(value, index);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(chart.x + chart.w, chart.y + chart.h);
  ctx.lineTo(chart.x, chart.y + chart.h);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.beginPath();
  values.forEach((value, index) => {
    const { x, y } = point(value, index);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = BLUE;
  ctx.lineWidth = 3.5;
  ctx.lineJoin = "round";
  ctx.stroke();
  const head = point(values[values.length - 1], values.length - 1);
  dot(ctx, head.x, head.y, 6, BLUE, 6);

  // Tile 3: live numbers
  tile(ctx, 570, 122, 202, 190, Math.max(state.flashMain * 0.6, 0));
  text(ctx, state.labels.vehicles, 594, 160, 17, MUTED, "left", 600);
  text(ctx, String(state.vehicles), 594, 200, 44, INK, "left", 700);
  text(ctx, state.labels.entries, 594, 248, 17, MUTED, "left", 600);
  text(ctx, String(state.entries), 594, 284, 30, BLUE, "left", 700);

  // Legend row
  legend(ctx, 62, 350, BLUE, state.labels.frontLot);
  legend(ctx, 284, 350, "#58bfe9", state.labels.mainLot);
  legend(ctx, 577, 350, GREEN, state.labels.updated);
}

/** Soft round sprite used for the travelling data pulses. */
export function drawGlow(ctx: CanvasRenderingContext2D, size: number) {
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.35, "rgba(255, 255, 255, 0.55)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
}
