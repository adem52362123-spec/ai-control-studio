"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { Bot, Plus, Loader2, Trash2, CheckCircle, XCircle } from "lucide-react"

interface Provider {
  id: string
  name: string
  baseUrl: string | null
  isActive: boolean
  createdAt: string
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("openai")
  const [apiKey, setApiKey] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [error, setError] = useState("")

  async function loadProviders() {
    try {
      const list = await api.get<Provider[]>("/api/providers")
      setProviders(list)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadProviders() }, [])

  async function addProvider() {
    setError("")
    try {
      await api.post("/api/providers", { name, apiKey, baseUrl: baseUrl || undefined })
      setApiKey(""); setBaseUrl(""); setShowForm(false)
      loadProviders()
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function deleteProvider(id: string) {
    try {
      await api.delete(`/api/providers/${id}`)
      loadProviders()
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function testProvider(id: string) {
    try {
      const res = await api.post<{ status: string }>(`/api/providers/${id}/test`)
      alert(`الحالة: ${res.status}`)
    } catch (e: any) {
      alert(`خطأ: ${e.message}`)
    }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-text-secondary" /></div>
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مزودات AI</h1>
          <p className="text-sm text-text-secondary">إدارة مفاتيح API</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          <Plus size={16} /> إضافة مزود
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>
      )}

      {showForm && (
        <div className="mb-6 rounded-xl border border-dark-600 bg-dark-800 p-6 space-y-4">
          <select
            value={name} onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-dark-600 bg-dark-700 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent"
          >
            <option value="openai">OpenAI</option>
            <option value="claude">Claude</option>
            <option value="openrouter">OpenRouter</option>
          </select>
          <input
            value={apiKey} onChange={(e) => setApiKey(e.target.value)}
            placeholder="API Key"
            type="password"
            className="w-full rounded-lg border border-dark-600 bg-dark-700 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent"
          />
          <input
            value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="Base URL (اختياري)"
            className="w-full rounded-lg border border-dark-600 bg-dark-700 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent"
          />
          <div className="flex gap-3">
            <button onClick={addProvider} className="rounded-lg bg-accent px-6 py-2 text-sm text-white hover:bg-accent-hover">إضافة</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-dark-600 px-6 py-2 text-sm text-text-secondary hover:bg-dark-700">إلغاء</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {providers.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border border-dark-600 bg-dark-800 p-5">
            <div className="flex items-center gap-3">
              <Bot className="text-accent" size={24} />
              <div>
                <span className="font-medium text-text-primary">{p.name}</span>
                {p.baseUrl && <span className="mr-2 text-xs text-text-secondary">{p.baseUrl}</span>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {p.isActive ? <CheckCircle size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
              <button onClick={() => testProvider(p.id)} className="rounded-lg bg-dark-700 px-3 py-1.5 text-xs text-text-secondary hover:bg-dark-600">اختبار</button>
              <button onClick={() => deleteProvider(p.id)} className="text-text-secondary hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {providers.length === 0 && (
          <div className="flex flex-col items-center py-12 text-text-secondary">
            <Bot size={40} className="mb-3 opacity-50" />
            <p>لا توجد مزودات. أضف أول مزود AI</p>
          </div>
        )}
      </div>
    </div>
  )
}
