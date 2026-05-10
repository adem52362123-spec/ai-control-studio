import { Hono } from "hono"
import { getDb } from "../db/prisma"
import { authMiddleware, getUser } from "../middleware/auth"

const logs = new Hono()
logs.use("*", authMiddleware)

logs.get("/", async (c) => {
  const { userId } = getUser(c)
  const level = c.req.query("level")
  const taskId = c.req.query("taskId")
  const db = getDb()

  const where: any = { userId }
  if (level) where.level = level
  if (taskId) where.taskId = taskId

  const list = await db.log.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  })
  return c.json(list)
})

logs.get("/:taskId", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()

  const list = await db.log.findMany({
    where: { taskId: c.req.param("taskId"), userId },
    orderBy: { createdAt: "asc" },
  })
  return c.json(list)
})

export { logs }
