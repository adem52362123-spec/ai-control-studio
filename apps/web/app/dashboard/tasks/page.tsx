"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { ListTodo, Loader2, CheckCircle, XCircle, Clock, RotateCcw } from "lucide-react"
import type { Task } from "@ai-control/shared"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [error, setError] = useState("")

  async function loadTasks() {
    try {
      const path = filter ? `/api/tasks?status=${filter}` : "/api/tasks"
      const list = await api.get<Task[]>(path)
      setTasks(list)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadTasks() }, [filter])

  async function retryTask(id: string) {
    try {
      await api.post(`/api/tasks/${id}/retry`)
      loadTasks()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const statusIcon = (s: string) => {
    switch (s) {
      case "done": return <CheckCircle size={16} className="text-green-400" />
      case "failed": return <XCircle size={16} className="text-red-400" />
      case "running": return <Clock size={16} className="text-yellow-400" />
      default: return <Clock size={16} className="text-blue-400" />
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">المهام</h1>
          <p className="text-sm text-text-secondary">تتبع وتنفيذ المهام</p>
        </div>
        <div className="flex gap-2">
          {["", "pending", "running", "done", "failed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                filter === s ? "bg-accent text-white" : "bg-dark-700 text-text-secondary hover:bg-dark-600"
              }`}
            >
              {s || "الكل"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-text-secondary" /></div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-text-secondary">
          <ListTodo size={40} className="mb-3 opacity-50" />
          <p>لا توجد مهام</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-xl border border-dark-600 bg-dark-800 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {statusIcon(task.status)}
                  <div>
                    <span className="font-medium text-text-primary">{task.title}</span>
                    <span className="mr-3 text-xs text-text-secondary">{task.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary">{task.progress}%</span>
                  {task.status === "failed" && (
                    <button onClick={() => retryTask(task.id)} className="text-text-secondary hover:text-accent transition-colors">
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-dark-700">
                <div
                  className={`h-full rounded-full transition-all ${
                    task.status === "done" ? "bg-green-500" :
                    task.status === "failed" ? "bg-red-500" :
                    task.status === "running" ? "bg-yellow-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-text-secondary">
                <span>{new Date(task.createdAt).toLocaleString("ar-TN")}</span>
                {task.result && <span className="text-green-400">✓ مكتمل</span>}
                {task.error && <span className="text-red-400">{task.error}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
