import { Hono } from "hono"
import { getDb } from "../db/prisma"
import { authMiddleware, getUser } from "../middleware/auth"

const stats = new Hono()
stats.use("*", authMiddleware)

stats.get("/overview", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()

  const [totalTasks, runningTasks, doneTasks, failedTasks, totalProjects, totalProviders] =
    await Promise.all([
      db.task.count({ where: { userId } }),
      db.task.count({ where: { userId, status: "running" } }),
      db.task.count({ where: { userId, status: "done" } }),
      db.task.count({ where: { userId, status: "failed" } }),
      db.project.count({ where: { userId } }),
      db.aiProvider.count({ where: { userId } }),
    ])

  return c.json({
    totalTasks,
    runningTasks,
    doneTasks,
    failedTasks,
    totalProjects,
    totalProviders,
    successRate: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
  })
})

export { stats }
