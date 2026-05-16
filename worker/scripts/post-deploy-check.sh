#!/usr/bin/env bash
# post-deploy-check.sh — smoke-test the deployed Cloudflare Worker.
#
# Usage:
#   bash worker/scripts/post-deploy-check.sh <worker-url> [email]
#
# Examples:
#   bash worker/scripts/post-deploy-check.sh \
#     https://oskarmarketing-booking.example.workers.dev
#   bash worker/scripts/post-deploy-check.sh \
#     https://oskarmarketing-booking.example.workers.dev test@example.com
#
# What it does:
#   1. OPTIONS preflight  — verifies CORS is wired
#   2. GET  /booked-slots — verifies the booking route + KV bind work
#   3. POST /subscribe    — sends a real DOI request to Brevo
#                           ⚠ if you pass a real email, you WILL get a mail.
#
# Exit code 0 = all green. Non-zero = at least one check failed.

set -u

URL="${1:-}"
TEST_EMAIL="${2:-deploy-check+$(date +%s)@example.com}"

if [ -z "$URL" ]; then
  echo "usage: $0 <worker-url> [email]" >&2
  exit 2
fi

# Strip trailing slash so URL/subscribe doesn't become URL//subscribe.
URL="${URL%/}"

ORIGIN="https://oskar778838.github.io"
FAIL=0

hr() { printf '%s\n' '────────────────────────────────────────'; }

check() {
  local label="$1"
  local expected="$2"
  local actual="$3"
  local body="${4:-}"
  if [ "$actual" = "$expected" ]; then
    printf '  ✓ %-32s  %s\n' "$label" "$actual"
  else
    printf '  ✗ %-32s  expected %s, got %s\n' "$label" "$expected" "$actual"
    [ -n "$body" ] && printf '    body: %s\n' "$body"
    FAIL=1
  fi
}

hr
echo "Worker: $URL"
echo "Origin: $ORIGIN"
echo "Email:  $TEST_EMAIL"
hr

# ── 1. OPTIONS preflight ────────────────────────────────────────
echo "[1/3] OPTIONS /subscribe (CORS preflight)"
RES=$(curl -sS -o /tmp/pdc_opts -w '%{http_code}' \
  -X OPTIONS "$URL/subscribe" \
  -H "Origin: $ORIGIN" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  --max-time 15) || RES="000"
check "status"  "204" "$RES" "$(cat /tmp/pdc_opts 2>/dev/null)"

# ── 2. GET /booked-slots ────────────────────────────────────────
echo "[2/3] GET /booked-slots"
RES=$(curl -sS -o /tmp/pdc_slots -w '%{http_code}' \
  -X GET "$URL/booked-slots" \
  -H "Origin: $ORIGIN" \
  --max-time 15) || RES="000"
check "status" "200" "$RES" "$(cat /tmp/pdc_slots 2>/dev/null)"
if [ "$RES" = "200" ]; then
  if grep -q '"ok":true' /tmp/pdc_slots 2>/dev/null; then
    echo "    payload: $(cat /tmp/pdc_slots | head -c 120)"
  else
    echo "  ✗ payload missing 'ok:true'"
    cat /tmp/pdc_slots
    FAIL=1
  fi
fi

# ── 3. POST /subscribe ──────────────────────────────────────────
echo "[3/3] POST /subscribe"
RES=$(curl -sS -o /tmp/pdc_sub -w '%{http_code}' \
  -X POST "$URL/subscribe" \
  -H "Origin: $ORIGIN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --data "{\"email\":\"$TEST_EMAIL\",\"consent\":true}" \
  --max-time 20) || RES="000"
BODY=$(cat /tmp/pdc_sub 2>/dev/null)
echo "    status: $RES"
echo "    body:   $BODY"

case "$RES" in
  200)
    printf '  ✓ %-32s  Brevo DOI mail dispatched\n' "/subscribe"
    ;;
  503)
    printf '  ⚠ %-32s  Brevo disabled — set BREVO_DOI_TEMPLATE_ID\n' "/subscribe"
    FAIL=1
    ;;
  400|422)
    printf '  ⚠ %-32s  validation — check payload / Brevo template\n' "/subscribe"
    FAIL=1
    ;;
  500)
    printf '  ✗ %-32s  server error — wrangler tail for details\n' "/subscribe"
    FAIL=1
    ;;
  *)
    printf '  ✗ %-32s  unexpected status\n' "/subscribe"
    FAIL=1
    ;;
esac

hr
if [ "$FAIL" -eq 0 ]; then
  echo "ALL CHECKS PASSED"
  exit 0
else
  echo "AT LEAST ONE CHECK FAILED — run 'npx wrangler tail' in another shell and re-run."
  exit 1
fi
