/**
 * Canvas drawings for the digital boards in the 3D city: an LED dot-matrix
 * look inspired by real parking guidance signs. Each function paints one
 * board face onto a 2D canvas that is then used as a texture.
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
  "%": ["11001", "11010", "00010", "00100", "01000", "01011", "10011"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"]
};

export const BOARD_CANVAS = { width: 512, height: 320 };
export const HUB_CANVAS = { width: 512, height: 96 };

const LIVE_GREEN = "#46ff7a";
const LIVE_GREEN_OFF = "#16271b";
const STATS_AMBER = "#ffad33";
const STATS_AMBER_OFF = "#2b1f0e";
const FONT_STACK = '"Helvetica Neue", Helvetica, Arial, sans-serif';

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, lit: boolean, on: string, off: string, glow: number) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = lit ? on : off;
  ctx.shadowColor = on;
  ctx.shadowBlur = lit ? glow : 0;
  ctx.fill();
  ctx.shadowBlur = 0;
}

/** Draws `text` as 5x7 LED dots, unlit dots included, like a real matrix display. */
function drawDotText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, pitch: number, on: string, off: string) {
  let cursor = x;
  for (const character of text) {
    const glyph = DOT_FONT[character] ?? DOT_FONT[" "];
    for (let row = 0; row < 7; row += 1) {
      for (let column = 0; column < 5; column += 1) {
        dot(ctx, cursor + column * pitch + pitch / 2, y + row * pitch + pitch / 2, pitch * 0.36, glyph[row][column] === "1", on, off, pitch * 0.8);
      }
    }
    cursor += pitch * 6;
  }
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = "left", weight = 700) {
  ctx.font = `${weight} ${size}px ${FONT_STACK}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function boardFrame(ctx: CanvasRenderingContext2D) {
  const { width, height } = BOARD_CANVAS;
  ctx.clearRect(0, 0, width, height);
  roundedRect(ctx, 4, 4, width - 8, height - 8, 28);
  ctx.fillStyle = "#1c2024";
  ctx.fill();
  ctx.strokeStyle = "#3a4148";
  ctx.lineWidth = 6;
  ctx.stroke();
}

function screen(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  roundedRect(ctx, x, y, w, h, 12);
  ctx.fillStyle = "#0d1012";
  ctx.fill();
}

/** Live board for the small lot: free spots from the on-ground sensors. */
export function drawLiveBoard(ctx: CanvasRenderingContext2D, spots: number, labels: { title: string; source: string }, pulseOn: boolean) {
  const { width, height } = BOARD_CANVAS;
  boardFrame(ctx);
  label(ctx, labels.title, width / 2, 52, 30, "#e4e9ec", "center");

  roundedRect(ctx, 46, 96, 118, 118, 16);
  ctx.fillStyle = "#2b78c5";
  ctx.fill();
  roundedRect(ctx, 54, 104, 102, 102, 12);
  ctx.strokeStyle = "#e9f2fa";
  ctx.lineWidth = 5;
  ctx.stroke();
  label(ctx, "P", 105, 158, 84, "#ffffff", "center", 800);

  screen(ctx, 196, 88, 270, 134);
  drawDotText(ctx, String(Math.max(0, Math.min(99, spots))).padStart(2, " "), 222, 94, 18, LIVE_GREEN, LIVE_GREEN_OFF);

  dot(ctx, 60, height - 50, 10, pulseOn, LIVE_GREEN, "#1d4a2a", 14);
  label(ctx, labels.source, 82, height - 49, 24, "#9fb0ba", "left", 600);
}

/** Statistics board for the big lot: long-term camera data for planning. */
export function drawStatsBoard(ctx: CanvasRenderingContext2D, value: string, bars: number[], labels: { title: string; source: string }) {
  const { width, height } = BOARD_CANVAS;
  boardFrame(ctx);
  label(ctx, labels.title, width / 2, 52, 28, "#e4e9ec", "center");

  screen(ctx, 36, 88, 300, 134);
  drawDotText(ctx, value, 50, 94, 16, STATS_AMBER, STATS_AMBER_OFF);

  screen(ctx, 346, 88, 130, 134);
  const pitch = 12;
  bars.forEach((level, index) => {
    for (let step = 0; step < 8; step += 1) {
      dot(ctx, 364 + index * pitch * 1.45, 208 - step * pitch - 4, pitch * 0.36, step <= level, STATS_AMBER, STATS_AMBER_OFF, 8);
    }
  });

  label(ctx, labels.source, width / 2, height - 49, 24, "#9fb0ba", "center", 600);
}

/** Tag under the Insights panel: everything comes together here. */
export function drawHubTag(ctx: CanvasRenderingContext2D, text: string) {
  const { width, height } = HUB_CANVAS;
  ctx.clearRect(0, 0, width, height);
  roundedRect(ctx, 4, 4, width - 8, height - 8, (height - 8) / 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
  ctx.fill();
  ctx.strokeStyle = "#58bfe9";
  ctx.lineWidth = 5;
  ctx.stroke();
  label(ctx, text, width / 2, height / 2 + 2, 38, "#1d4f73", "center", 800);
}
