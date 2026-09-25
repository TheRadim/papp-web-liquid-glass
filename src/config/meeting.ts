export const meetingAvailability = {
  timezone: "Europe/Copenhagen",
  recipient: "radim.theiner@papp.nu",
  weekdays: [3, 4], // Wednesday and Thursday; UTC weekdays of Copenhagen calendar dates.
  times: ["09:00", "10:00", "11:00", "12:00"],
  durations: [30, 60],
  weeksAhead: 12
} as const;

/**
 * Sending requests without the visitor's email app.
 *
 * GitHub Pages is static, so a form service delivers the message. Web3Forms
 * (https://web3forms.com) emails every submission to the address the access
 * key was created for. The key is meant to be public and is safe in client code.
 * Set it here, or as NEXT_PUBLIC_WEB3FORMS_KEY at build time. While it is empty
 * the calendar falls back to preparing an email in the visitor's mail app.
 */
export const meetingDelivery = {
  endpoint: "https://api.web3forms.com/submit",
  accessKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? ""
};

/**
 * Real bookings through HubSpot Meetings.
 *
 * Paste the public scheduling link from HubSpot (Library > Meetings), such as
 * "https://meetings.hubspot.com/martine-winther", or set it as
 * NEXT_PUBLIC_HUBSPOT_MEETINGS_URL at build time. When it is set, the calendar
 * panel shows HubSpot's live availability and bookings land in the owner's
 * calendar. While it is empty the site's own request calendar is used instead.
 */
export const hubspotMeetings = {
  url: process.env.NEXT_PUBLIC_HUBSPOT_MEETINGS_URL ?? ""
};

export const meetingTopics = [
  { en: "Parking & capacity", da: "Parkering og kapacitet" },
  { en: "Traffic & people counting", da: "Trafik- og persontælling" },
  { en: "Insights & data analysis", da: "Insights og dataanalyse" },
  { en: "Reports & decision support", da: "Rapporter og beslutningsstøtte" },
  { en: "Business workshops", da: "Workshops for virksomheder" },
  { en: "Other", da: "Andet" }
];
