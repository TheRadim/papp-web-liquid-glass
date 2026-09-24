// Synthetic example data for the Insights page explorer. The shapes follow real
// Papp Insights views, the numbers are generated and do not describe any site.

// Small deterministic generator so server and browser renders match.
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}
const noise = seeded(20260424);
const jitter = (amount: number) => (noise() - 0.5) * 2 * amount;
const round1 = (value: number) => Math.round(value * 10) / 10;

/* Fleet age: unique vehicles per age in years, last bucket is 20+. */
export const fleetAges = [1180, 965, 816, 997, 810, 673, 552, 477, 439, 410, 365, 332, 310, 231, 215, 180, 139, 96, 89, 61, 161];
export const fleetAgeMedian = 5;

/* Manufacturers: share of identified vehicles and battery electric share of each brand's arrivals. */
export const manufacturers = [
  { name: "Volkswagen", share: 14.1, electric: 22 },
  { name: "Mercedes-Benz", share: 7.9, electric: 31 },
  { name: "Toyota", share: 7.7, electric: 6 },
  { name: "Ford", share: 6.2, electric: 9 },
  { name: "Peugeot", share: 5.8, electric: 14 },
  { name: "Škoda", share: 5.8, electric: 19 },
  { name: "Tesla", share: 5.5, electric: 100 },
  { name: "Kia", share: 4.8, electric: 24 },
  { name: "Renault", share: 4.2, electric: 21 },
  { name: "Citroën", share: 4.2, electric: 12 },
  { name: "BMW", share: 3.9, electric: 33 },
  { name: "Hyundai", share: 3.8, electric: 26 },
  { name: "Audi", share: 3.8, electric: 29 },
  { name: "Opel", share: 2.6, electric: 13 },
  { name: "Suzuki", share: 2.6, electric: 2 },
  { name: "Nissan", share: 2.2, electric: 28 }
];

/* Visitor origins: visits by country of registration (ISO 3166 alpha 3). */
export const guestOrigins = [
  { iso: "DNK", en: "Denmark", da: "Danmark", visits: 18420 },
  { iso: "SWE", en: "Sweden", da: "Sverige", visits: 64 },
  { iso: "DEU", en: "Germany", da: "Tyskland", visits: 41 },
  { iso: "NOR", en: "Norway", da: "Norge", visits: 12 },
  { iso: "POL", en: "Poland", da: "Polen", visits: 18 },
  { iso: "ROU", en: "Romania", da: "Rumænien", visits: 27 },
  { iso: "LTU", en: "Lithuania", da: "Litauen", visits: 9 },
  { iso: "LVA", en: "Latvia", da: "Letland", visits: 6 },
  { iso: "FIN", en: "Finland", da: "Finland", visits: 4 },
  { iso: "NLD", en: "Netherlands", da: "Holland", visits: 7 },
  { iso: "UKR", en: "Ukraine", da: "Ukraine", visits: 5 },
  { iso: "BGR", en: "Bulgaria", da: "Bulgarien", visits: 3 },
  { iso: "GBR", en: "United Kingdom", da: "Storbritannien", visits: 2 },
  { iso: "EST", en: "Estonia", da: "Estland", visits: 2 }
];

/* Occupancy: vehicles on site in 15 minute steps across 17 operating days. */
export const quarterHours = Array.from({ length: 96 }, (_, index) => index / 4);
export const landscapeDays = Array.from({ length: 17 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 3, 20 + index));
  return date;
});

function typicalOccupancy(hour: number) {
  if (hour < 7) return 8;
  if (hour < 8.5) return 8 - (hour - 7) * 2.6;
  if (hour < 12) return 4 + (hour - 8.5) * 7.4;
  if (hour < 15) return 30 + (hour - 12) * 2.6;
  if (hour < 21) return 38 + Math.sin((hour - 15) / 6 * Math.PI) * 3.5;
  if (hour < 22.3) return 38 - (hour - 21) * 23;
  return 8;
}

export const occupancyByDay = landscapeDays.map((date) => {
  const weekday = date.getUTCDay();
  const weekendLift = weekday === 5 || weekday === 6 ? 1.12 : weekday === 0 ? 0.86 : 1;
  const dayLevel = weekendLift * (0.9 + noise() * 0.2);
  return quarterHours.map((hour) => Math.max(0, Math.round(typicalOccupancy(hour) * (hour > 8.5 && hour < 22 ? dayLevel : 1) + jitter(hour > 9 && hour < 22 ? 6 : 1.5))));
});

/* Occupancy through the day: 5 minute resolution summary across the same days. */
export const fiveMinutes = Array.from({ length: 288 }, (_, index) => index / 12);
function quantile(sorted: number[], q: number) {
  const position = (sorted.length - 1) * q;
  const base = Math.floor(position);
  const next = sorted[base + 1] ?? sorted[base];
  return sorted[base] + (next - sorted[base]) * (position - base);
}
// Each day gets its own level and a slightly earlier or later rhythm; two event
// days run busier, which pulls the average above the median in the evening.
const dayProfiles = landscapeDays.map((_, day) => {
  const level = 0.72 + noise() * 0.5;
  const event = day === 5 || day === 12 ? 1.28 : 1;
  const shift = jitter(0.7);
  return fiveMinutes.map((hour) => {
    const busy = hour > 8.5 && hour < 22;
    const eveningEvent = event > 1 && hour > 16 ? event : 1;
    return Math.max(0, typicalOccupancy(hour + (busy ? shift : 0)) * (busy ? level * eveningEvent : 1) + jitter(busy ? 3.5 : 1.2));
  });
});
export const dailySummary = fiveMinutes.map((_, index) => {
  const values = dayProfiles.map((profile) => profile[index]).sort((a, b) => a - b);
  const mean = values.reduce((total, value) => total + value, 0) / values.length;
  return { p25: round1(quantile(values, 0.25)), median: round1(quantile(values, 0.5)), mean: round1(mean), p75: round1(quantile(values, 0.75)) };
});
export const dailyPeak = dailySummary.reduce((best, row, index) => (row.median > best.value ? { value: row.median, index } : best), { value: 0, index: 0 });

/* Arrival intensity: average arrivals per operating day by weekday and hour, 05 to 22. */
export const arrivalHours = Array.from({ length: 18 }, (_, index) => index + 5);
export const arrivalIntensity = Array.from({ length: 7 }, (_, day) => arrivalHours.map((hour) => {
  const shape = hour < 10 ? (hour - 5) * 6 : hour < 21 ? 45 + Math.sin((hour - 10) / 10 * Math.PI * 0.9) * 75 + (hour - 10) * 3.5 : 70 - (hour - 21) * 45;
  const dayFactor = [0.92, 0.95, 1, 1.05, 1.14, 1.08, 0.78][day];
  return Math.max(2, Math.round(shape * dayFactor + jitter(6)));
}));

/* Forecast replay: a typical Tuesday, everything after 14:00 is predicted. */
export const forecastStart = 14;
// A slow random walk around the typical curve reads like real arrivals and departures.
let drift = 0;
export const replayActual = fiveMinutes.map((hour) => {
  const base = hour < 6 ? 5 : typicalOccupancy(hour) * 1.08;
  const busy = hour > 11 && hour < 21.5;
  drift = drift * 0.9 + jitter(busy ? 2.4 : 0.8);
  return Math.max(1, Math.round(base + drift));
});
export const forecastHours = fiveMinutes.filter((hour) => hour >= forecastStart);
// The forecast follows the shape a good model would learn: a smoothed version of
// the day with a small, slowly drifting error, so it tracks reality without
// copying every short spike.
const forecastStartIndex = forecastStart * 12;
const smoothed = replayActual.map((_, index) => {
  const window = replayActual.slice(Math.max(0, index - 6), index + 7);
  return window.reduce((sum, value) => sum + value, 0) / window.length;
});
let forecastError = 0;
export const forecastMedian = forecastHours.map((_, index) => {
  forecastError = forecastError * 0.93 + jitter(0.7);
  return round1(Math.max(0, smoothed[forecastStartIndex + index] + forecastError));
});
// 80% band: starts narrow at the moment of the forecast, widens as the horizon
// grows through the busy evening, then tightens as the site empties at night.
const spread = (hour: number) => {
  const horizon = Math.min(1, (hour - forecastStart) / 4);
  const busy = 3.5 + horizon * 6.5;
  return hour < 21 ? busy : Math.max(3, busy - (hour - 21) * 4);
};
export const forecastLow = forecastMedian.map((value, index) => round1(Math.max(0, value - spread(forecastHours[index]))));
export const forecastHigh = forecastMedian.map((value, index) => round1(value + spread(forecastHours[index])));
