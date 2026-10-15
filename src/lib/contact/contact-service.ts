export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
  privacyAccepted: boolean;
}

interface ContactFormResult {
  ok: boolean;
  message: string;
}

interface ContactFormService {
  submit(payload: ContactFormPayload): Promise<ContactFormResult>;
}

export const developmentContactService: ContactFormService = {
  async submit() {
    return {
      ok: false,
      message: "Contact delivery is not configured yet. Please email hey@pappmobility.com."
    };
  }
};
