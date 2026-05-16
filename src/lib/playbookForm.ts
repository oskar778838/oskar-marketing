// Playbook email-capture form.
//
// POSTs JSON to the Cloudflare Worker's /subscribe endpoint. The Worker
// validates and forwards to Brevo's double-opt-in API, which sends the
// confirmation mail. Success here means "DOI mail sent", not "confirmed".

import { SUBSCRIBE_API_URL } from "../config";

interface SubscribeResponse {
  ok: boolean;
  error?: string;
}

export function initPlaybookForm(): void {
  const form = document.getElementById("playbook-form") as HTMLFormElement | null;
  if (!form) return;

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const labelEl = submitBtn?.querySelector<HTMLElement>(".cta__label");
  const defaultLabel = labelEl?.dataset.defaultLabel ?? labelEl?.textContent ?? "Playbook holen";
  const successEl = form.querySelector<HTMLElement>("[data-success]");
  const errorEl = form.querySelector<HTMLElement>("[data-error]");
  const emailInput = form.querySelector<HTMLInputElement>('input[name="EMAIL"]');
  const consentInput = form.querySelector<HTMLInputElement>('input[name="OPT_IN"]');

  const showError = (msg: string): void => {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.hidden = false;
    if (successEl) successEl.hidden = true;
  };

  const showSuccess = (): void => {
    if (successEl) successEl.hidden = false;
    if (errorEl) errorEl.hidden = true;
    form.reset();
  };

  const setBusy = (busy: boolean): void => {
    if (!submitBtn || !labelEl) return;
    submitBtn.disabled = busy;
    labelEl.textContent = busy ? "Sende …" : defaultLabel;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (errorEl) errorEl.hidden = true;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!SUBSCRIBE_API_URL) {
      showError(
        "Formular noch nicht konfiguriert. Schreib mir direkt: opheck@gmx.de"
      );
      return;
    }

    const email = (emailInput?.value ?? "").trim().toLowerCase();
    const consent = consentInput?.checked === true;

    setBusy(true);

    void fetch(SUBSCRIBE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, consent }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as SubscribeResponse;
        if (res.ok && data.ok) {
          showSuccess();
          return;
        }
        showError(
          data.error ??
            "Anmeldung gerade nicht möglich. Versuche es später nochmal oder schreib mir: opheck@gmx.de"
        );
      })
      .catch(() => {
        showError(
          "Netzwerk-Fehler. Versuche es später nochmal oder schreib mir: opheck@gmx.de"
        );
      })
      .finally(() => {
        setBusy(false);
      });
  });
}
