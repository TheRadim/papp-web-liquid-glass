import { describe, expect, it } from "vitest";
import { meetingDates, validMeetingSlot, meetingEmail, calendarMonth } from "../src/lib/booking/meeting";

describe("meeting requests in Denmark time", () => {
  it("starts on Wednesday and Thursday of the following week", () => {
    expect(meetingDates(new Date("2026-09-23T10:00:00Z"))).toEqual(["2026-09-30", "2026-10-01"]);
    expect(validMeetingSlot("2026-09-24", "10:00", 30, new Date("2026-09-23T10:00:00Z"))).toBe(false);
  });
  it("uses Copenhagen's Monday even when the visitor's UTC date is Sunday", () => {
    expect(meetingDates(new Date("2026-09-27T22:30:00Z"))).toEqual(["2026-10-07", "2026-10-08"]);
  });
  it("crosses DST and year boundaries without shifting the calendar dates", () => {
    expect(meetingDates(new Date("2026-10-25T12:00:00Z"))).toEqual(["2026-10-28", "2026-10-29"]);
    expect(meetingDates(new Date("2026-12-31T12:00:00Z"))).toEqual(["2027-01-06", "2027-01-07"]);
  });
  it("rejects past dates, unsupported slots and out-of-range weeks", () => {
    const now = new Date("2026-09-23T10:00:00Z");
    expect(validMeetingSlot("2026-09-30", "10:00", 60, now)).toBe(true);
    expect(validMeetingSlot("2026-09-30", "14:00", 60, now)).toBe(false);
    expect(validMeetingSlot("2026-09-30", "10:00", 15, now)).toBe(false);
    expect(validMeetingSlot("2026-09-01", "10:00", 30, now)).toBe(false);
    expect(meetingDates(now, -1)).toEqual([]);
    expect(meetingDates(now, 12)).toEqual([]);
  });
  it("builds a complete Monday-first month including leap day", () => {
    const days = calendarMonth("2028-02");
    expect(days).toHaveLength(35);
    expect(days[0]).toBe("2028-01-31");
    expect(days).toContain("2028-02-29");
    expect(new Set(days).size).toBe(35);
  });
  it("includes a selected topic without requiring company or phone", () => {
    const email = meetingEmail({ name: "Test", email: "test@example.com", topic: "Parking & capacity", date: "2026-10-01", time: "09:00", duration: 60, message: "", source: "consultancy" });
    expect(email.body).toContain("Topic: Parking & capacity");
    expect(email.body).not.toContain("undefined");
    expect(email.body).not.toContain("Company:");
  });
  it("preserves request details and encodes the email handoff", () => {
    const request = meetingEmail({ name:"A & B",company:"Example",email:"test@example.com",phone:"",date:"2026-10-01",time:"10:00",duration:30,message:"Capacity?",source:"analysis" });
    expect(request.subject).toBe("Meeting request — 30 min — 01 Oct 2026 10:00");
    expect(request.href).toContain("mailto:radim.theiner@papp.nu?");
    expect(request.body).toContain("Europe/Copenhagen");
    expect(request.body).toContain("subject to confirmation");
    expect(request.href).toContain("A%20%26%20B");
  });
});
