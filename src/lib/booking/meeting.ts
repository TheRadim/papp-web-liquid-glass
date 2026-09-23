import { meetingAvailability as availability } from "@/config/meeting";

export function copenhagenDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: availability.timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

// Work with date-only UTC arithmetic, independent of the visitor's timezone and DST.
export function meetingDates(now = new Date(), weekOffset = 0) {
  const today = new Date(`${copenhagenDate(now)}T12:00:00Z`);
  const daysToNextMonday = 7 - ((today.getUTCDay() + 6) % 7);
  if (!Number.isInteger(weekOffset) || weekOffset < 0 || weekOffset >= availability.weeksAhead) return [];
  return availability.weekdays.map((weekday) => {
    const day = new Date(today);
    day.setUTCDate(today.getUTCDate() + daysToNextMonday + weekOffset * 7 + weekday - 1);
    return day.toISOString().slice(0, 10);
  });
}

export function validMeetingSlot(date: string, time: string, duration: number, now = new Date()) {
  const dates = Array.from({ length: availability.weeksAhead }, (_, week) => meetingDates(now, week)).flat();
  return dates.includes(date) && availability.times.some((value) => value === time) && availability.durations.some((value) => value === duration);
}

export interface MeetingRequestData {
  name: string; company: string; email: string; phone: string; date: string; time: string; duration: number; message: string; source: string;
}
export function meetingEmail(request: MeetingRequestData) {
  const date = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${request.date}T12:00:00Z`));
  const subject = `Meeting request — ${request.duration} min — ${date} ${request.time}`;
  const body = [`Meeting request with Martine (subject to confirmation)`, `Name: ${request.name}`, `Company: ${request.company}`, `Email: ${request.email}`, `Phone: ${request.phone || "Not supplied"}`, `Date: ${request.date}`, `Time: ${request.time} (${availability.timezone})`, `Duration: ${request.duration} minutes`, `Source: ${request.source}`, "", request.message].join("\n");
  return { subject, body, href: `mailto:${availability.recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
