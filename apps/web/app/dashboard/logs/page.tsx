"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { FileText, Loader2 } from "lucide-react"

interface Log {
  id: string
  level: string
  message: string
  meta: string | null
  taskId: string | null
  createdAt: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [error, setError] = useState("")

  async function loadLogs() {
    try {
      const path = filter ? `/api/logs?level=${filter}` : "/api/logs"
      const list = await api.get<Log[]>(path)
      setLogs(list)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadLogs() }, [filter])

  const levelColor = (lvl: string) => {
    switch (lvl) {
      case "error": return "text-red-400 bg-red-500/10"
      case "warn": return "text-yellow-400 bg-yellow-500/10"
      case "debug": return "text-blue-400 bg-blue-500/10"
      default: return "text-green-400 bg-green-500/10"
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">السجلات</h1>
          <p className="text-sm text-text-secondary">نشاطات النظام</p>
        </div>
        <div className="flex gap-2">
          {["", "info", "warn", "error", "debug"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                filter === lvl ? "bg-accent text-white" : "bg-dark-700 text-text-secondary hover:bg-dark-600"
              }`}
            >{lvl || "الكل"}</button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-text-secondary" /></div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-text-secondary">
          <FileText size={40} className="mb-3 opacity-50" />
          <p>لا توجد سجلات</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 rounded-lg border border-dark-600 bg-dark-800 p-4">
              <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${levelColor(log.level)}`}>
                {log.level}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">{log.message}</p>
                {log.meta && (
                  <pre className="mt-1 text-xs text-text-secondary overflow-x-auto">
                    {JSON.stringify(JSON.parse(log.meta), null, 2)}
                  </pre>
                )}
              </div>
              <span className="shrink-0 text-xs text-text-secondary">
                {new Date(log.createdAt).toLocaleString("ar-TN")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
