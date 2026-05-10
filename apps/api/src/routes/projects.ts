import { Hono } from "hono"
import { getDb } from "../db/prisma"
import { projectSchema } from "@ai-control/shared"
import { authMiddleware, getUser } from "../middleware/auth"

const projects = new Hono()
projects.use("*", authMiddleware)

projects.get("/", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()
  const list = await db.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
  return c.json(list)
})

projects.get("/:id", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()
  const project = await db.project.findFirst({
    where: { id: c.req.param("id"), userId },
  })
  if (!project) return c.json({ error: "Project not found" }, 404)
  return c.json(project)
})

projects.post("/", async (c) => {
  const { userId } = getUser(c)
  const body = await c.req.json()
  const parsed = projectSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.issues }, 400)

  const db = getDb()
  const existing = await db.project.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) return c.json({ error: "Slug مستخدم بالفعل" }, 409)

  const project = await db.project.create({
    data: { ...parsed.data, userId },
  })
  return c.json(project, 201)
})

projects.patch("/:id", async (c) => {
  const { userId } = getUser(c)
  const body = await c.req.json()
  const db = getDb()

  const project = await db.project.findFirst({
    where: { id: c.req.param("id"), userId },
  })
  if (!project) return c.json({ error: "Project not found" }, 404)

  const updated = await db.project.update({
    where: { id: project.id },
    data: { name: body.name, description: body.description },
  })
  return c.json(updated)
})

projects.delete("/:id", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()

  const project = await db.project.findFirst({
    where: { id: c.req.param("id"), userId },
  })
  if (!project) return c.json({ error: "Project not found" }, 404)

  await db.project.delete({ where: { id: project.id } })
  return c.json({ success: true })
})

export { projects }
