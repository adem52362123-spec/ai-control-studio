import type { AgentName } from "@ai-control/shared"
import { AgentService, AgentInput, AgentResult } from "./types"
import { orchestrator } from "./orchestrator"
import { analyzer } from "./analyzer"
import { backend } from "./backend"
import { frontend } from "./frontend"
import { integration } from "./integration"
import { loggerDebug } from "./logger-debug"
import { performance } from "./performance"
import { getDb } from "../../db/prisma"
import { emitUserEvent } from "../../ws"

const allAgents: AgentService[] = [
  orchestrator,
  analyzer,
  backend,
  frontend,
  integration,
  loggerDebug,
  performance,
]

const agentMap = new Map(allAgents.map((a) => [a.name, a]))

export function getAgent(name: string): AgentService | undefined {
  return agentMap.get(name as AgentName)
}

export function getAllAgents(): AgentService[] {
  return allAgents
}

export async function runOrchestrator(input: AgentInput): Promise<{
  results: AgentResult[]
  summary: string
}> {
  const start = Date.now()
  const db = getDb()

  // 1. Orchestrator analyzes first
  const orchestration = await orchestrator.analyze(input)
  saveAgentLog(db, input.userId, input.commandId, orchestration)

  // 2. Determine which agents to invoke based on command
  const relevant = getRelevantAgents(input.commandInput)
  const results: AgentResult[] = [orchestration]

  // 3. Run relevant agents
  for (const agent of relevant) {
    emitUserEvent(input.userId, "agent:update", {
      commandId: input.commandId,
      agent: agent.name,
      status: "analyzing",
    })

    const result = await agent.analyze(input)
    result.duration = Date.now() - start
    results.push(result)

    saveAgentLog(db, input.userId, input.commandId, result)

    emitUserEvent(input.userId, "agent:update", {
      commandId: input.commandId,
      agent: agent.name,
      status: "done",
      result,
    })
  }

  const totalDuration = Date.now() - start

  return {
    results,
    summary: `تم تحليل الأمر بواسطة ${results.length} وكلاء في ${totalDuration}ms`,
  }
}

function getRelevantAgents(text: string): AgentService[] {
  const lower = text.toLowerCase()
  const selected: AgentService[] = [analyzer]

  if (/\b(api|server|backend|db|database|query|prisma|endpoint|سيرفر|api|قاعدة)\b/i.test(lower)) {
    selected.push(backend)
  }
  if (/\b(ui|page|component|interface|frontend|form|button|design|واجهة|صفحة|مكون|زر|تصميم)\b/i.test(lower)) {
    selected.push(frontend)
  }
  if (/\b(api|websocket|socket|realtime|integration|ربط|اتصال)\b/i.test(lower)) {
    selected.push(integration)
  }
  if (/\b(slow|speed|performance|cache|loading|بطيء|أداء|سرعة)\b/i.test(lower)) {
    selected.push(performance)
  }

  selected.push(loggerDebug)
  return selected
}

function saveAgentLog(db: any, userId: string, commandId: string, result: AgentResult) {
  db.log.create({
    data: {
      level: result.status === "error" ? "error" : "info",
      message: `[${result.agent}] ${result.summary}`,
      meta: JSON.stringify(result),
      userId,
    },
  }).catch(() => {})
}

export { AgentInput, AgentResult }
