import { Hono } from "hono"
import { authMiddleware } from "../middleware/auth"
import { getAgent } from "../services/agents"
import { AGENT_LIST } from "@ai-control/shared"

const agents = new Hono()
agents.use("*", authMiddleware)

agents.get("/", async (c) => {
  const list = AGENT_LIST.map((a) => ({
    id: a.id,
    label: a.label,
    desc: a.desc,
    status: "idle",
  }))
  return c.json(list)
})

agents.get("/:name", async (c) => {
  const name = c.req.param("name")
  const agent = getAgent(name)
  if (!agent) return c.json({ error: "Agent not found" }, 404)

  const info = AGENT_LIST.find((a) => a.id === name)
  return c.json({
    id: agent.name,
    label: info?.label || name,
    desc: info?.desc || "",
    capabilities: getAgentCapabilities(agent.name),
  })
})

function getAgentCapabilities(name: string): string[] {
  const caps: Record<string, string[]> = {
    orchestrator: ["تقسيم المهام", "توزيع العمل", "دمج النتائج"],
    analyzer: ["تحليل الأخطاء", "تشخيص المشاكل", "اقتراح حلول"],
    backend: ["مراجعة API", "تحسين queries", "إصلاح Backend"],
    frontend: ["تحسين UI/UX", "مراجعة المكونات", "تحسين التفاعل"],
    integration: ["ربط الخدمات", "WebSocket", "API sync"],
    logger: ["تسجيل العمليات", "تحليل logs", "تقارير debugging"],
    performance: ["تحسين السرعة", "Caching", "تقليل latency"],
  }
  return caps[name] || []
}

export { agents }
