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

  // Secrets (set via `wrangler secret put`)
  RESEND_API_KEY: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
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
