import { describe, expect, it } from "vitest";
import { hubspotEmbedUrl, readHubspotMessage } from "@/lib/booking/hubspot";

describe("HubSpot meetings", () => {
  it("turns a scheduling link into an embed URL", () => {
    expect(hubspotEmbedUrl("https://meetings.hubspot.com/radim")).toBe("https://meetings.hubspot.com/radim?embed=true");
    expect(hubspotEmbedUrl(" https://meetings-eu1.hubspot.com/radim?uuid=1 ")).toBe("https://meetings-eu1.hubspot.com/radim?uuid=1&embed=true");
  });
  it("ignores empty or foreign links", () => {
    expect(hubspotEmbedUrl("")).toBe("");
    expect(hubspotEmbedUrl("http://meetings.hubspot.com/radim")).toBe("");
    expect(hubspotEmbedUrl("https://evil-hubspot.com/radim")).toBe("");
  });
  it("only trusts messages from HubSpot", () => {
    expect(readHubspotMessage("https://meetings.hubspot.com", { meetingBookSucceeded: true })).toEqual({ height: undefined, booked: true });
    expect(readHubspotMessage("https://meetings.hubspot.com", { height: 720 })).toEqual({ height: 720, booked: false });
    expect(readHubspotMessage("https://example.com", { meetingBookSucceeded: true })).toBeNull();
  });
});
