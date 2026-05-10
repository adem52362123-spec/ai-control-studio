import { Context, Next } from "hono"

const windowMs = 60_000
const maxRequests = 100
const store = new Map<string, { count: number; resetAt: number }>()

export async function rateLimit(c: Context, next: Next) {
  const ip = c.req.header("x-forwarded-for") || "unknown"
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return next()
  }

  entry.count++
  if (entry.count > maxRequests) {
    return c.json({ error: "Too many requests" }, 429)
  }

  return next()
}
