import { NextRequest } from "next/server";

type Bucket = {
  resetAt: number;
  count: number;
};

const buckets = new Map<string, Bucket>();

export function checkRateLimit(req: NextRequest, opts?: { limit?: number; windowMs?: number }) {
  const limit = opts?.limit ?? 60;
  const windowMs = opts?.windowMs ?? 60_000;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const key = `${ip}:${new URL(req.url).pathname}`;
  const now = Date.now();

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { resetAt: now + windowMs, count: 1 });
    return { ok: true as const, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (bucket.count >= limit) {
    return { ok: false as const, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  buckets.set(key, bucket);
  return { ok: true as const, remaining: Math.max(0, limit - bucket.count), resetAt: bucket.resetAt };
}
