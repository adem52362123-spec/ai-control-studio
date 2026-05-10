import { Hono } from "hono"
import { hash, compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { getDb } from "../db/prisma"
import { config } from "../config"
import { loginSchema, registerSchema } from "@ai-control/shared"
import { authMiddleware, getUser } from "../middleware/auth"

const auth = new Hono()

auth.post("/register", async (c) => {
  const body = await c.req.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues }, 400)
  }

  const db = getDb()
  const exists = await db.user.findUnique({ where: { email: parsed.data.email } })
  if (exists) {
    return c.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, 409)
  }

  const hashed = await hash(parsed.data.password, config.bcryptRounds)
  const user = await db.user.create({
    data: {
      email: parsed.data.email,
      password: hashed,
      name: parsed.data.name,
      role: "owner",
    },
  })

  const token = sign({ userId: user.id, role: user.role }, config.jwtSecret, {
    expiresIn: "7d",
  } as any)

  return c.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan },
  }, 201)
})

auth.post("/login", async (c) => {
  const body = await c.req.json()
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues }, 400)
  }

  const db = getDb()
  const user = await db.user.findUnique({ where: { email: parsed.data.email } })
  if (!user) {
    return c.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, 401)
  }

  const valid = await compare(parsed.data.password, user.password)
  if (!valid) {
    return c.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, 401)
  }

  const token = sign({ userId: user.id, role: user.role }, config.jwtSecret, {
    expiresIn: "7d",
  } as any)

  return c.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan },
  })
})

auth.get("/me", authMiddleware, async (c) => {
  const db = getDb()
  const { userId } = getUser(c)
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return c.json({ error: "User not found" }, 404)

  return c.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    plan: user.plan,
    subscriptionEndsAt: user.subscriptionEndsAt,
  })
})

export { auth }
