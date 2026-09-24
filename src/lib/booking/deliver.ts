import { meetingDelivery } from "@/config/meeting";
import type { MeetingRequestData } from "@/lib/booking/meeting";
import { meetingEmail } from "@/lib/booking/meeting";

export const canSendDirectly = () => meetingDelivery.accessKey.trim().length > 0;

/**
 * Send a meeting request through the configured form service.
 * Resolves true when the service accepted it; never throws.
 */
export async function sendMeetingRequest(request: MeetingRequestData, honeypot = ""): Promise<boolean> {
  if (!canSendDirectly()) return false;
  const email = meetingEmail(request);
  try {
    const response = await fetch(meetingDelivery.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: meetingDelivery.accessKey,
        subject: email.subject,
        from_name: "Papp Mobility website",
        name: request.name,
        email: request.email,
        replyto: request.email,
        message: email.body,
        botcheck: honeypot
      })
    });
    const result = (await response.json().catch(() => ({}))) as { success?: boolean };
    return response.ok && result.success !== false;
  } catch {
    return false;
  }
}
