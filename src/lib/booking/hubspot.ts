import { hubspotMeetings } from "@/config/meeting";

/** The HubSpot scheduling page as an embeddable URL, or "" when none is configured. */
export function hubspotEmbedUrl(link = hubspotMeetings.url) {
  let url: URL;
  try { url = new URL(link.trim()); } catch { return ""; }
  if (url.protocol !== "https:" || !isHubspotHost(url.hostname)) return "";
  url.searchParams.set("embed", "true");
  return url.toString();
}

export function isHubspotHost(hostname: string) {
  return /(^|\.)hubspot(\.com|\.eu)$/.test(hostname) || /(^|\.)hs-sites(-eu1)?\.com$/.test(hostname);
}

export interface HubspotEmbedMessage { height?: number; booked?: boolean }

/** Read the messages the HubSpot meetings iframe posts to its parent page. */
export function readHubspotMessage(origin: string, data: unknown): HubspotEmbedMessage | null {
  let host = "";
  try { host = new URL(origin).hostname; } catch { return null; }
  if (!isHubspotHost(host) || !data || typeof data !== "object") return null;
  const message = data as Record<string, unknown>;
  const height = [message.height, message.meetingsHeight].find((value) => typeof value === "number" && value > 200 && value < 3000) as number | undefined;
  return { height, booked: message.meetingBookSucceeded === true };
}
