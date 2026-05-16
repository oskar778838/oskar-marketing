export interface Env {
  // KV namespace bound in wrangler.toml as BOOKINGS
  BOOKINGS: KVNamespace;

  // Plain vars (from [vars] in wrangler.toml)
  NOTIFY_EMAIL: string;
  NOTIFY_PHONE: string;
  RESEND_FROM: string;
  TWILIO_FROM: string;
  SMS_ENABLED: string; // "true" | "false"
  ALLOWED_ORIGINS: string; // comma-separated
  BREVO_LIST_ID: string; // numeric, e.g. "3"
  BREVO_DOI_TEMPLATE_ID: string; // numeric, "0" = endpoint disabled
  BREVO_REDIRECT_URL: string;

  // Secrets (set via `wrangler secret put`)
  RESEND_API_KEY: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  BREVO_API_KEY: string;
}

export interface BookingRequest {
  slot_key: string;
  email: string;
  phone: string;
  message?: string;
  consent: boolean;
}

export interface StoredBooking {
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: "reserved" | "cancelled";
}

export interface BookingResponse {
  ok: boolean;
  error?: string;
}

export interface SlotsResponse {
  ok: boolean;
  slots: string[];
}

export interface SubscribeRequest {
  email: string;
  consent: boolean;
}

export interface SubscribeResponse {
  ok: boolean;
  error?: string;
}
