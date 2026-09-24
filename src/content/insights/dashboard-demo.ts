// Illustrative values for the homepage preview; not live measurements or client results.
export const originDemo = [
  { country: "Denmark", da: "Danmark", share: 72 },
  { country: "Sweden", da: "Sverige", share: 12 },
  { country: "Germany", da: "Tyskland", share: 8 },
  { country: "Norway", da: "Norge", share: 5 },
  { country: "Finland", da: "Finland", share: 3 }
];
export const manufacturerDemo = [
  { name: "Volkswagen", share: 24 }, { name: "Toyota", share: 18 },
  { name: "Tesla", share: 16 }, { name: "Ford", share: 14 },
  { name: "Škoda", share: 12 }, { name: "Peugeot", share: 9 },
  { name: "Kia", share: 7 }
];
// Drivetrain groups for the vehicle mix preview, shares of identified vehicles.
export const drivetrainDemo = [
  { id: "petrol", en: "Petrol", da: "Benzin", share: 38, colour: "#0a527e" },
  { id: "diesel", en: "Diesel", da: "Diesel", share: 24, colour: "#4c9ccb" },
  { id: "ev", en: "Electric", da: "El", share: 21, colour: "#f77f87" },
  { id: "hybrid", en: "Hybrid", da: "Hybrid", share: 14, colour: "#9ccbe6" },
  { id: "other", en: "Other", da: "Andet", share: 3, colour: "#d3dce2" }
];

// Headline figures shown above each preview chart.
export const previewKpis = {
  occupancy: [
    { en: "Capacity", da: "Kapacitet", value: "80", unit: { en: "spaces", da: "pladser" } },
    { en: "Peak today", da: "Peak i dag", value: "66%", unit: { en: "at 13:00", da: "kl. 13:00" } },
    { en: "Average stay", da: "Gns. ophold", value: "2 h 10", unit: { en: "min", da: "min" } }
  ],
  origin: [
    { en: "Visits", da: "Besøg", value: "12,480", unit: { en: "this month", da: "denne måned" } },
    { en: "Domestic", da: "Indenlandske", value: "72%", unit: { en: "of visits", da: "af besøg" } },
    { en: "Countries", da: "Lande", value: "14", unit: { en: "seen", da: "set" } }
  ],
  vehicles: [
    { en: "Unique vehicles", da: "Unikke biler", value: "9,627", unit: { en: "identified", da: "identificeret" } },
    { en: "Median age", da: "Medianalder", value: "5.0", unit: { en: "years", da: "år" } },
    { en: "Electric", da: "Elbiler", value: "21%", unit: { en: "of arrivals", da: "af ankomster" } }
  ],
  flow: [
    { en: "Daily arrivals", da: "Ankomster pr. dag", value: "1,240", unit: { en: "on average", da: "i gennemsnit" } },
    { en: "Busiest day", da: "Travleste dag", value: "Fri", unit: { en: "every week", da: "hver uge" } },
    { en: "Peak hour", da: "Travleste time", value: "19:00", unit: { en: "local time", da: "lokal tid" } }
  ]
} as const;

export const activityDemo = Array.from({ length: 216 }, (_, index) => {
  const hour = index % 24;
  const day = Math.floor(index / 24);
  const daytime = hour >= 7 && hour <= 19;
  return daytime ? Math.round(12 + Math.sin((hour - 7) / 12 * Math.PI) * (28 + day % 3 * 4) + Math.sin(index * 2.4) * 5) : 3 + day % 4;
});
