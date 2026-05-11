// Booking-API configuration.
//
// Set BOOKING_API_URL to the deployed Cloudflare Worker URL. Until then,
// the booking section shows a "backend in setup" notice and falls back to
// a mailto link.
//
// Example after worker deploy:
//   export const BOOKING_API_URL = "https://oskarmarketing-booking.<your-subdomain>.workers.dev";
//
// The worker code lives in /worker. See docs/MORNING-SETUP.md for the
// step-by-step deploy instructions.

export const BOOKING_API_URL: string | null = null;

// Slot generation rules (kept on the client so the UI is responsive even
// when offline). The backend re-validates that a chosen slot matches one
// of these candidates.
export const SLOT_HOURS_BERLIN: readonly number[] = [10, 14, 18];
export const SLOT_DURATION_MIN = 30;
export const WORKDAYS_AHEAD = 7; // Mon-Fri only, today + this many weekdays
export const TZ_BERLIN = "Europe/Berlin";

// UX tunables
export const SUCCESS_RESET_MS = 8000;
export const MAX_MESSAGE_CHARS = 500;
