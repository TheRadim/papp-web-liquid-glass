import type { ContactFormPayload } from "@/lib/contact/contact-service";

interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormPayload, string>>;
}

export function validateContactPayload(payload: ContactFormPayload): ContactValidationResult {
  const errors: ContactValidationResult["errors"] = {};

  if (!payload.name.trim()) errors.name = "Name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errors.email = "A valid email is required.";
  if (payload.message.trim().length < 10) errors.message = "Message must be at least 10 characters.";
  if (!payload.privacyAccepted) errors.privacyAccepted = "Privacy acknowledgement is required.";

  return { valid: Object.keys(errors).length === 0, errors };
}
