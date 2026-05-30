export interface Env {
  // Plain vars (from [vars] in wrangler.toml)
  ALLOWED_ORIGINS: string; // comma-separated
  BREVO_LIST_ID: string; // numeric, e.g. "3"
  BREVO_DOI_TEMPLATE_ID: string; // numeric, "0" = endpoint disabled
  BREVO_REDIRECT_URL: string;

  // Secrets (set via `wrangler secret put`)
  BREVO_API_KEY: string;
}

export interface SubscribeRequest {
  email: string;
  consent: boolean;
}

export interface SubscribeResponse {
  ok: boolean;
  error?: string;
}
