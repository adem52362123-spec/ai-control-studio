import { Hono } from "hono"
import { getDb } from "../db/prisma"
import { commandSchema } from "@ai-control/shared"
import { authMiddleware, getUser } from "../middleware/auth"
import { runOrchestrator } from "../services/agents"

const commands = new Hono()
commands.use("*", authMiddleware)

commands.post("/", async (c) => {
  const { userId } = getUser(c)
  const body = await c.req.json()
  const parsed = commandSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.issues }, 400)

  const db = getDb()

  const task = await db.task.create({
    data: {
      title: parsed.data.input.slice(0, 80),
      type: "command",
      status: "pending",
      userId,
      projectId: parsed.data.projectId || null,
    },
  })

  const command = await db.command.create({
    data: {
      input: parsed.data.input,
      type: "unknown",
      userId,
      projectId: parsed.data.projectId || null,
      taskId: task.id,
    },
  })

  await db.task.update({
    where: { id: task.id },
    data: { status: "running", progress: 10 },
  })

  const analysis = { original: parsed.data.input, type: "unknown" }
  await db.command.update({
    where: { id: command.id },
    data: { analysis: JSON.stringify(analysis), status: "analyzing" },
  })

  const agentResults = await runOrchestrator({
    commandId: command.id,
    commandInput: parsed.data.input,
    userId,
    projectId: parsed.data.projectId,
  })

  const agentSummary = agentResults.results.map((r) => ({
    agent: r.agent,
    summary: r.summary,
    findings: r.findings,
    suggestions: r.suggestions,
    confidence: r.confidence,
  }))

  await db.task.update({
    where: { id: task.id },
    data: {
      plan: JSON.stringify({ steps: agentResults.results.map((r) => r.summary) }),
      progress: 100,
    },
  })

  await db.task.update({
    where: { id: task.id },
    data: {
      status: "done",
      progress: 100,
      result: JSON.stringify({
        summary: agentResults.summary,
        agents: agentSummary,
      }),
    },
  })

  await db.command.update({
    where: { id: command.id },
    data: {
      status: "done",
      analysis: JSON.stringify({
        original: parsed.data.input,
        type: analysis.type,
        agents: agentSummary,
      }),
    },
  })

  return c.json({ command, task, agents: agentSummary }, 201)
})

commands.get("/", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()
  const list = await db.command.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { task: true },
  })
  return c.json(list)
})

commands.get("/:id", async (c) => {
  const { userId } = getUser(c)
  const db = getDb()
  const command = await db.command.findFirst({
    where: { id: c.req.param("id"), userId },
    include: { task: true },
  })
  if (!command) return c.json({ error: "Command not found" }, 404)
  return c.json(command)
})

export { commands }
