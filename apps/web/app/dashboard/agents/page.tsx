"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { getSocket } from "@/lib/socket"
import {
  Brain, Search, Settings, Palette, Link, FileText, Zap,
  Loader2, CheckCircle, AlertCircle, Clock,
} from "lucide-react"

const agentIcons: Record<string, any> = {
  orchestrator: Brain,
  analyzer: Search,
  backend: Settings,
  frontend: Palette,
  integration: Link,
  logger: FileText,
  performance: Zap,
}

const agentColors: Record<string, string> = {
  orchestrator: "text-purple-400",
  analyzer: "text-blue-400",
  backend: "text-yellow-400",
  frontend: "text-pink-400",
  integration: "text-green-400",
  logger: "text-orange-400",
  performance: "text-cyan-400",
}

interface AgentInfo {
  id: string
  label: string
  desc: string
  status: string
  capabilities?: string[]
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentInfo[]>([])
  const [selected, setSelected] = useState<AgentInfo | null>(null)
  const [details, setDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api.get<AgentInfo[]>("/api/agents")
      .then((list) => {
        setAgents(list)
        setIsLoading(false)
      })
      .catch((e) => { setError(e.message); setIsLoading(false) })

    const socket = getSocket()
    socket.on("agent:update", (data: any) => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === data.agent ? { ...a, status: data.status } : a
        )
      )
    })

    return () => { socket.off("agent:update") }
  }, [])

  async function selectAgent(agent: AgentInfo) {
    setSelected(agent)
    setDetails(null)
    try {
      const info = await api.get<any>(`/api/agents/${agent.id}`)
      setDetails(info)
    } catch (e: any) {
      setError(e.message)
    }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-text-secondary" /></div>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">الوكلاء الذكيون</h1>
        <p className="text-sm text-text-secondary">7 وكلاء AI متخصصين يعملون معاً</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {agents.map((agent) => {
          const Icon = agentIcons[agent.id] || Brain
          return (
            <button
              key={agent.id}
              onClick={() => selectAgent(agent)}
              className={`text-right rounded-xl border p-5 transition-all ${
                selected?.id === agent.id
                  ? "border-accent bg-dark-700"
                  : "border-dark-600 bg-dark-800 hover:border-dark-500"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon size={28} className={agentColors[agent.id] || "text-accent"} />
                <div className={`h-2.5 w-2.5 rounded-full ${
                  agent.status === "done" ? "bg-green-500" :
                  agent.status === "analyzing" ? "bg-yellow-500 animate-pulse" :
                  "bg-dark-500"
                }`} />
              </div>
              <h3 className="font-semibold text-text-primary text-sm">{agent.label}</h3>
              <p className="mt-1 text-xs text-text-secondary">{agent.desc}</p>
            </button>
          )
        })}
      </div>

      {selected && details && (
        <div className="mt-8 rounded-xl border border-dark-600 bg-dark-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            {(() => { const Icon = agentIcons[selected.id] || Brain; return <Icon size={24} className={agentColors[selected.id] || "text-accent"} /> })()}
            <div>
              <h2 className="text-lg font-bold">{selected.label}</h2>
              <p className="text-sm text-text-secondary">{selected.desc}</p>
            </div>
          </div>

          {details.capabilities && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-text-secondary">القدرات</h3>
              <div className="flex flex-wrap gap-2">
                {details.capabilities.map((cap: string) => (
                  <span key={cap} className="rounded-lg bg-dark-700 px-3 py-1.5 text-xs text-text-primary">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
