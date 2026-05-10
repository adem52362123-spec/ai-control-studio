"use client"

import { useState, FormEvent, useEffect, useRef } from "react"
import { api } from "@/lib/api-client"
import { Terminal, Send, Loader2, Brain, Search, Settings, Palette, Link, FileText, Zap, CheckCircle, Lightbulb } from "lucide-react"

const agentIcons: Record<string, any> = {
  orchestrator: Brain, analyzer: Search, backend: Settings,
  frontend: Palette, integration: Link, logger: FileText, performance: Zap,
}

const agentColors: Record<string, string> = {
  orchestrator: "text-purple-400", analyzer: "text-blue-400",
  backend: "text-yellow-400", frontend: "text-pink-400",
  integration: "text-green-400", logger: "text-orange-400", performance: "text-cyan-400",
}

interface AgentInfo {
  agent: string
  summary: string
  findings: string[]
  suggestions: string[]
  confidence: number
}

interface Task {
  id: string
  title: string
  status: string
  progress: number
  plan: string | null
  result: string | null
  error: string | null
}

interface Command {
  id: string
  input: string
  status: string
  createdAt: string
  task: Task | null
}

export default function ConsolePage() {
  const [input, setInput] = useState("")
  const [commands, setCommands] = useState<Command[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoading(true)
    api.get<Command[]>("/api/commands")
      .then(setCommands)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [commands])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim() || isSending) return

    setIsSending(true)
    setError("")
    try {
      const res = await api.post<{ command: Command; task: Task }>("/api/commands", { input: input.trim() })
      setCommands((prev) => [res.command, ...prev])
      setInput("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">مركز الأوامر</h1>
        <p className="text-sm text-text-secondary">اكتب أمرك والنظام ينفذ</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-text-secondary" />
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {!isLoading && commands.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
            <Terminal size={40} className="mb-3 opacity-50" />
            <p>لا توجد أوامر بعد. اكتب أمرك الأول!</p>
          </div>
        )}

        {commands.map((cmd) => (
          <div key={cmd.id} className="rounded-xl border border-dark-600 bg-dark-800 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${
                cmd.status === "done" ? "bg-green-500" :
                cmd.status === "failed" ? "bg-red-500" :
                cmd.status === "analyzing" ? "bg-yellow-500" :
                "bg-blue-500"
              }`} />
              <span className="text-sm font-medium text-text-primary">{cmd.input.slice(0, 80)}</span>
              <span className="mr-auto text-xs text-text-secondary">
                {new Date(cmd.createdAt).toLocaleString("ar-TN")}
              </span>
            </div>

            {cmd.task && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="text-text-primary">الحالة:</span>
                  <span className={
                    cmd.task.status === "done" ? "text-green-400" :
                    cmd.task.status === "failed" ? "text-red-400" :
                    cmd.task.status === "running" ? "text-yellow-400" : ""
                  }>{cmd.task.status}</span>
                  <span className="mr-2">التقدم: {cmd.task.progress}%</span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-dark-700">
                  <div
                    className={`h-full rounded-full transition-all ${
                      cmd.task.status === "done" ? "bg-green-500" :
                      cmd.task.status === "failed" ? "bg-red-500" :
                      "bg-yellow-500"
                    }`}
                    style={{ width: `${cmd.task.progress}%` }}
                  />
                </div>

                {cmd.task.result && (() => {
                  try {
                    const result = JSON.parse(cmd.task.result)
                    if (result.agents) {
                      return (
                        <div className="mt-3 space-y-2">
                          <div className="text-xs font-semibold text-text-secondary mb-2">تحليل الوكلاء:</div>
                          {result.agents.map((agent: AgentInfo, i: number) => {
                            const Icon = agentIcons[agent.agent] || Brain
                            return (
                              <div key={i} className="rounded-lg bg-dark-700/50 p-3 border border-dark-600">
                                <div className="flex items-center gap-2 mb-2">
                                  <Icon size={14} className={agentColors[agent.agent] || "text-accent"} />
                                  <span className="text-xs font-medium text-text-primary capitalize">{agent.agent}</span>
                                  <span className="mr-auto flex items-center gap-1 text-xs">
                                    <CheckCircle size={12} className="text-green-400" />
                                    {Math.round(agent.confidence * 100)}%
                                  </span>
                                </div>
                                <p className="text-xs text-text-secondary mb-2">{agent.summary}</p>
                                {agent.suggestions.length > 0 && (
                                  <div className="space-y-1">
                                    {agent.suggestions.map((s: string, j: number) => (
                                      <div key={j} className="flex items-start gap-1.5 text-xs text-text-primary">
                                        <Lightbulb size={12} className="mt-0.5 shrink-0 text-yellow-400" />
                                        <span>{s}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )
                    }
                    return <pre className="text-xs text-text-secondary">{result.summary || JSON.stringify(result, null, 2)}</pre>
                  } catch { return null }
                })()}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب أمرك هنا... (مثال: أنشئ مشروع جديد)"
          className="flex-1 rounded-xl border border-dark-600 bg-dark-800 px-5 py-3.5 text-sm text-text-primary outline-none focus:border-accent"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={16} />}
          إرسال
        </button>
      </form>
    </div>
  )
}
