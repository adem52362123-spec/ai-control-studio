import { Hono } from "hono"
import { createCipheriv, createDecipheriv, randomBytes } from "crypto"
import { getDb } from "../db/prisma"
import { providerSchema } from "@ai-control/shared"
import { authMiddleware, getUser } from "../middleware/auth"

const ALGORITHM = "aes-256-gcm"
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || randomBytes(32).toString("hex").slice(0, 32)

function encrypt(text: string): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  const authTag = cipher.getAuthTag().toString("hex")
  return `${iv.toString("hex")}:${authTag}:${encrypted}`
}

function decrypt(encrypted: string): string {
  const parts = encrypted.split(":")
  const iv = Buffer.from(parts[0], "hex")
  const authTag = Buffer.from(parts[1], "hex")
  const encryptedText = parts[2]
  const decipher = createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv)
  decipher.setAuthTag(authTag)
  let decrypted = decipher.update(encryptedText, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

const providers = new Hono()
providers.use("*", authMiddleware)

providers.get("/", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()
  const list = await db.aiProvider.findMany({
    where: { userId },
    select: { id: true, name: true, baseUrl: true, isActive: true, createdAt: true },
  })
  return c.json(list)
})

providers.post("/", async (c) => {
  const { userId } = getUser(c)
  const body = await c.req.json()
  const parsed = providerSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.issues }, 400)

  const db = getDb()
  const existing = await db.aiProvider.findUnique({
    where: { userId_name: { userId, name: parsed.data.name } },
  })
  if (existing) return c.json({ error: "هذا المزود مضاف مسبقاً" }, 409)

  const encryptedKey = encrypt(parsed.data.apiKey)
  const provider = await db.aiProvider.create({
    data: {
      name: parsed.data.name,
      apiKey: encryptedKey,
      baseUrl: parsed.data.baseUrl || null,
      userId,
    },
    select: { id: true, name: true, baseUrl: true, isActive: true, createdAt: true },
  })
  return c.json(provider, 201)
})

providers.delete("/:id", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()
  const provider = await db.aiProvider.findFirst({
    where: { id: c.req.param("id"), userId },
  })
  if (!provider) return c.json({ error: "Provider not found" }, 404)

  await db.aiProvider.delete({ where: { id: provider.id } })
  return c.json({ success: true })
})

providers.post("/:id/test", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()
  const provider = await db.aiProvider.findFirst({
    where: { id: c.req.param("id"), userId },
  })
  if (!provider) return c.json({ error: "Provider not found" }, 404)

  try {
    const key = decrypt(provider.apiKey)
    if (provider.name === "openai" && key.startsWith("sk-")) {
      return c.json({ status: "ok" })
    }
    if (provider.name === "openrouter" && key.startsWith("sk-or-")) {
      return c.json({ status: "ok" })
    }
    return c.json({ status: "unknown", message: "تحقق من المفتاح يدوياً" })
  } catch {
    return c.json({ status: "error", message: "فشل فك التشفير" }, 500)
  }
})

export { providers, decrypt }
