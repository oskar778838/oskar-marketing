// CORS handling: allow only the configured origins, support preflight.

import type { Env } from "./types";

export function corsHeaders(req: Request, env: Env): Headers {
  const headers = new Headers();
  const origin = req.headers.get("Origin");
  const allowed = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim());

  if (origin && allowed.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  } else if (allowed.length > 0) {
    // Default to the first configured origin so misconfigured callers
    // still see a deterministic value (rather than a wildcard, which
    // we want to avoid for credentialed requests).
    headers.set("Access-Control-Allow-Origin", allowed[0]);
    headers.set("Vary", "Origin");
  }

  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Accept");
  headers.set("Access-Control-Max-Age", "86400");
  return headers;
}

export function handlePreflight(req: Request, env: Env): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(req, env),
  });
}

export function jsonResponse(
  body: unknown,
  status: number,
  req: Request,
  env: Env
): Response {
  const headers = corsHeaders(req, env);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify(body), { status, headers });
}
