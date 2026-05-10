"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { Brain, Plus, Loader2, Trash2 } from "lucide-react"

interface Memory {
  id: string
  key: string
  content: string
  projectId: string | null
  createdAt: string
}

export default function MemoryPage() {
  const [entries, setEntries] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [key, setKey] = useState("")
  const [content, setContent] = useState("")
  const [projectId, setProjectId] = useState("")
  const [error, setError] = useState("")

  async function loadMemory() {
    try {
      const list = await api.get<Memory[]>("/api/memory")
      setEntries(list)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadMemory() }, [])

  async function addMemory() {
    setError("")
    try {
      await api.post("/api/memory", { key, content, projectId: projectId || undefined })
      setKey(""); setContent(""); setProjectId(""); setShowForm(false)
      loadMemory()
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function deleteMemory(id: string) {
    try {
      await api.delete(`/api/memory/${id}`)
      loadMemory()
    } catch (e: any) {
      setError(e.message)
    }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-text-secondary" /></div>
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الذاكرة</h1>
          <p className="text-sm text-text-secondary">ذاكرة AI الدائمة</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover">
          <Plus size={16} /> إضافة
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>
      )}

      {showForm && (
        <div className="mb-6 rounded-xl border border-dark-600 bg-dark-800 p-6 space-y-4">
          <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="المفتاح"
            className="w-full rounded-lg border border-dark-600 bg-dark-700 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="المحتوى" rows={3}
            className="w-full rounded-lg border border-dark-600 bg-dark-700 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent" />
          <input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="Project ID (اختياري)"
            className="w-full rounded-lg border border-dark-600 bg-dark-700 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent" />
          <div className="flex gap-3">
            <button onClick={addMemory} className="rounded-lg bg-accent px-6 py-2 text-sm text-white hover:bg-accent-hover">حفظ</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-dark-600 px-6 py-2 text-sm text-text-secondary hover:bg-dark-700">إلغاء</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((e) => (
          <div key={e.id} className="flex items-start justify-between rounded-xl border border-dark-600 bg-dark-800 p-5">
            <div className="flex items-start gap-3">
              <Brain className="mt-1 text-accent" size={20} />
              <div>
                <span className="font-medium text-text-primary">{e.key}</span>
                <p className="mt-1 text-sm text-text-secondary">{e.content}</p>
                {e.projectId && <span className="mt-1 inline-block text-xs text-text-secondary">project: {e.projectId}</span>}
              </div>
            </div>
            <button onClick={() => deleteMemory(e.id)} className="text-text-secondary hover:text-red-400"><Trash2 size={16} /></button>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="flex flex-col items-center py-12 text-text-secondary">
            <Brain size={40} className="mb-3 opacity-50" />
            <p>الذاكرة فارغة</p>
          </div>
        )}
      </div>
    </div>
  )
}
