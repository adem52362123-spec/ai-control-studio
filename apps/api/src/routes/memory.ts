import { Hono } from "hono"
import { getDb } from "../db/prisma"
import { memorySchema } from "@ai-control/shared"
import { authMiddleware, getUser } from "../middleware/auth"

const memory = new Hono()
memory.use("*", authMiddleware)

memory.get("/", async (c) => {
  const { userId } = getUser(c)
  const projectId = c.req.query("projectId")
  const db = getDb()

  const where: any = { userId }
  if (projectId) where.projectId = projectId

  const list = await db.aiMemory.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  })
  return c.json(list)
})

memory.post("/", async (c) => {
  const { userId } = getUser(c)
  const body = await c.req.json()
  const parsed = memorySchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.issues }, 400)

  const db = getDb()
  const projectKey = parsed.data.projectId || ""
  const existing = await db.aiMemory.findUnique({
    where: { userId_projectId_key: { userId, projectId: projectKey, key: parsed.data.key } },
  })

  if (existing) {
    const updated = await db.aiMemory.update({
      where: { id: existing.id },
      data: { content: parsed.data.content },
    })
    return c.json(updated)
  }

  const entry = await db.aiMemory.create({
    data: {
      key: parsed.data.key,
      content: parsed.data.content,
      projectId: parsed.data.projectId || null,
      userId,
    },
  })
  return c.json(entry, 201)
})

memory.delete("/:id", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()

  const entry = await db.aiMemory.findFirst({
    where: { id: c.req.param("id"), userId },
  })
  if (!entry) return c.json({ error: "Memory not found" }, 404)

  await db.aiMemory.delete({ where: { id: entry.id } })
  return c.json({ success: true })
})

export { memory }
