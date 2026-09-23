export const meetingAvailability = {
  timezone: "Europe/Copenhagen",
  recipient: "radim.theiner@papp.nu",
  weekdays: [3, 4], // Wednesday and Thursday; UTC weekdays of Copenhagen calendar dates.
  times: ["09:00", "10:00", "11:00", "12:00"],
  durations: [30, 60],
  weeksAhead: 12
} as const;

export const meetingTopics = [
  { en: "Parking & capacity", da: "Parkering og kapacitet" },
  { en: "Traffic & people counting", da: "Trafik- og persontælling" },
  { en: "Insights & data analysis", da: "Insights og dataanalyse" },
  { en: "Reports & decision support", da: "Rapporter og beslutningsstøtte" },
  { en: "Business workshops", da: "Workshops for virksomheder" },
  { en: "Other", da: "Andet" }
];
