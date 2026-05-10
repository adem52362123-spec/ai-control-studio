import { Context, Next } from "hono"
import { verify } from "jsonwebtoken"
import { config } from "../config"

interface JwtPayload {
  userId: string
  role: string
}

export async function authMiddleware(c: Context, next: Next) {
  const auth = c.req.header("Authorization")
  if (!auth || !auth.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  try {
    const token = auth.slice(7)
    const payload = verify(token, config.jwtSecret) as JwtPayload
    c.set("userId" as any, payload.userId)
    c.set("userRole" as any, payload.role)
    await next()
  } catch {
    return c.json({ error: "Invalid token" }, 401)
  }
}

export function getUser(c: Context): { userId: string; userRole: string } {
  return {
    userId: (c.get as any)("userId") as string,
    userRole: (c.get as any)("userRole") as string,
  }
}

export async function requireOwner(c: Context, next: Next) {
  const { userRole } = getUser(c)
  if (userRole !== "owner") {
    return c.json({ error: "Forbidden" }, 403)
  }
  await next()
}
