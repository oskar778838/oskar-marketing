// Playbook email-capture form.
//
// Submits to Brevo's hosted form endpoint (action URL pasted by the user
// after creating a Web Form in the Brevo dashboard — see docs/BREVO-SETUP.md).
// Brevo's endpoint doesn't expose CORS headers, so we POST with no-cors
// and accept the opaque response — the actual confirmation channel is
// Brevo's double-opt-in email.
//
// If the action URL is still a placeholder, the submit is blocked
// gracefully and a clear error is shown instead of leaking to the user.

const PLACEHOLDER_ACTION = "{{BREVO_FORM_ACTION}}";

export function initPlaybookForm(): void {
  const form = document.getElementById("playbook-form") as HTMLFormElement | null;
  if (!form) return;

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const labelEl = submitBtn?.querySelector<HTMLElement>(".cta__label");
  const defaultLabel = labelEl?.dataset.defaultLabel ?? labelEl?.textContent ?? "Playbook holen";
  const successEl = form.querySelector<HTMLElement>("[data-success]");
  const errorEl = form.querySelector<HTMLElement>("[data-error]");

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

    const action = form.action || "";
    if (!action || action.includes(PLACEHOLDER_ACTION)) {
      showError(
        "Formular noch nicht konfiguriert. Schreib mir direkt: opheck@gmx.de"
      );
      return;
    }

    setBusy(true);
    const body = new FormData(form);

    void fetch(action, { method: "POST", body, mode: "no-cors" })
      .then(() => {
        showSuccess();
      })
      .catch(() => {
        showError(
          "Anmeldung gerade nicht möglich. Versuche es später nochmal oder schreib mir: opheck@gmx.de"
        );
      })
      .finally(() => {
        setBusy(false);
      });
  });
}
