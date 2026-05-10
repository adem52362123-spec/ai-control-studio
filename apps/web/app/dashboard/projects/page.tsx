"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { Plus, FolderKanban, Loader2, Trash2 } from "lucide-react"
import type { Project } from "@ai-control/shared"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  async function loadProjects() {
    try {
      const list = await api.get<Project[]>("/api/projects")
      setProjects(list)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadProjects() }, [])

  async function createProject() {
    setError("")
    try {
      await api.post("/api/projects", { name, slug, description })
      setName(""); setSlug(""); setDescription(""); setShowForm(false)
      loadProjects()
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function deleteProject(id: string) {
    try {
      await api.delete(`/api/projects/${id}`)
      loadProjects()
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
          <h1 className="text-2xl font-bold">المشاريع</h1>
          <p className="text-sm text-text-secondary">إدارة مشاريعك</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          <Plus size={16} /> مشروع جديد
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>
      )}

      {showForm && (
        <div className="mb-6 rounded-xl border border-dark-600 bg-dark-800 p-6 space-y-4">
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="اسم المشروع"
            className="w-full rounded-lg border border-dark-600 bg-dark-700 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent"
          />
          <input
            value={slug} onChange={(e) => setSlug(e.target.value)}
            placeholder="slug-project"
            className="w-full rounded-lg border border-dark-600 bg-dark-700 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent"
          />
          <input
            value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف (اختياري)"
            className="w-full rounded-lg border border-dark-600 bg-dark-700 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent"
          />
          <div className="flex gap-3">
            <button onClick={createProject} className="rounded-lg bg-accent px-6 py-2 text-sm text-white hover:bg-accent-hover">إنشاء</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-dark-600 px-6 py-2 text-sm text-text-secondary hover:bg-dark-700">إلغاء</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <div key={p.id} className="rounded-xl border border-dark-600 bg-dark-800 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FolderKanban className="text-accent" size={24} />
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <span className="text-xs text-text-secondary">{p.slug}</span>
                </div>
              </div>
              <button onClick={() => deleteProject(p.id)} className="text-text-secondary hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            {p.description && <p className="mt-3 text-sm text-text-secondary">{p.description}</p>}
            <div className="mt-4 flex items-center gap-2 text-xs text-text-secondary">
              <span className={`rounded-full px-2 py-0.5 ${p.status === "active" ? "bg-green-500/10 text-green-400" : "bg-dark-600"}`}>
                {p.status}
              </span>
              <span className="mr-auto">{new Date(p.createdAt).toLocaleDateString("ar-TN")}</span>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-12 text-text-secondary">
            <FolderKanban size={40} className="mb-3 opacity-50" />
            <p>لا توجد مشاريع بعد</p>
          </div>
        )}
      </div>
    </div>
  )
}
