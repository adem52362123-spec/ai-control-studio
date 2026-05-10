import { Hono } from "hono"
import { getDb } from "../db/prisma"
import { authMiddleware, getUser } from "../middleware/auth"

const tasks = new Hono()
tasks.use("*", authMiddleware)

tasks.get("/", async (c) => {
  const { userId } = getUser(c)
  const status = c.req.query("status")
  const db = getDb()

  const where: any = { userId }
  if (status) where.status = status

  const list = await db.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  })
  return c.json(list)
})

tasks.get("/:id", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()
  const task = await db.task.findFirst({
    where: { id: c.req.param("id"), userId },
    include: { logs: true, command: true },
  })
  if (!task) return c.json({ error: "Task not found" }, 404)
  return c.json(task)
})

tasks.post("/:id/cancel", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()

  const task = await db.task.findFirst({
    where: { id: c.req.param("id"), userId, status: "running" },
  })
  if (!task) return c.json({ error: "No running task found" }, 404)

  const updated = await db.task.update({
    where: { id: task.id },
    data: { status: "cancelled", progress: 0 },
  })
  return c.json(updated)
})

tasks.post("/:id/retry", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()

  const task = await db.task.findFirst({
    where: { id: c.req.param("id"), userId, status: "failed" },
  })
  if (!task) return c.json({ error: "No failed task found" }, 404)

  const updated = await db.task.update({
    where: { id: task.id },
    data: { status: "pending", progress: 0, error: null },
  })
  return c.json(updated)
})

export { tasks }
