// Brevo (Sendinblue) double-opt-in subscribe.
//
// Calls POST https://api.brevo.com/v3/contacts/doubleOptinConfirmation
// which:
//   1. creates the contact (if new) but marks them un-confirmed,
//   2. sends the DOI confirmation email using the configured template,
//   3. on click → Brevo confirms the contact, adds them to the list, then
//      redirects the browser to BREVO_REDIRECT_URL.
//
// Docs: https://developers.brevo.com/reference/createdoicontact

import type { Env } from "./types";

export type BrevoOutcome =
  | { kind: "ok" }
  | { kind: "invalid"; status: 400 | 422; detail: string }
  | { kind: "rate-limited" }
  | { kind: "server-error"; status: number; detail: string }
  | { kind: "disabled" };

export async function brevoCreateDoiContact(
  env: Env,
  email: string
): Promise<BrevoOutcome> {
  const listId = parseInt(env.BREVO_LIST_ID, 10);
  const templateId = parseInt(env.BREVO_DOI_TEMPLATE_ID, 10);

  if (!Number.isFinite(listId) || listId <= 0) {
    return { kind: "disabled" };
  }
  if (!Number.isFinite(templateId) || templateId <= 0) {
    // Template not yet created in Brevo dashboard — refuse early so we don't
    // hit the API with a value that will produce a confusing 400.
    return { kind: "disabled" };
  }

  const body = {
    email,
    includeListIds: [listId],
    templateId,
    redirectionUrl: env.BREVO_REDIRECT_URL,
  };

  let res: Response;
  try {
    res = await fetch(
      "https://api.brevo.com/v3/contacts/doubleOptinConfirmation",
      {
        method: "POST",
        headers: {
          "api-key": env.BREVO_API_KEY,
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
  } catch (err) {
    return {
      kind: "server-error",
      status: 0,
      detail: String((err as Error).message ?? err),
    };
  }

  // 201 = created (new contact), 204 = no content (already-existing contact
  // got a re-send of the confirmation mail). Both are success for us.
  if (res.status === 201 || res.status === 204) {
    return { kind: "ok" };
  }

  const text = await res.text().catch(() => "");

  if (res.status === 400 || res.status === 422) {
    return { kind: "invalid", status: res.status, detail: text.slice(0, 300) };
  }
  if (res.status === 429) {
    return { kind: "rate-limited" };
  }
  return {
    kind: "server-error",
    status: res.status,
    detail: text.slice(0, 300),
  };
}
