"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { CheckCircle, Clock, AlertCircle, FolderKanban, Bot, Crown, Zap } from "lucide-react"

interface Stats {
  totalTasks: number
  runningTasks: number
  doneTasks: number
  failedTasks: number
  totalProjects: number
  totalProviders: number
  successRate: number
}

export default function DashboardOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState("")
  const isPremium = user?.plan === "premium"

  useEffect(() => {
    api.get<Stats>("/api/stats/overview")
      .then(setStats)
      .catch((e) => setError(e.message))
  }, [])

  if (error) {
    return <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-400">{error}</div>
  }

  const cards = [
    { label: "إجمالي المهام", value: stats?.totalTasks ?? "-", icon: Clock, color: "text-blue-400" },
    { label: "قيد التشغيل", value: stats?.runningTasks ?? "-", icon: Clock, color: "text-yellow-400" },
    { label: "مكتملة", value: stats?.doneTasks ?? "-", icon: CheckCircle, color: "text-green-400" },
    { label: "فاشلة", value: stats?.failedTasks ?? "-", icon: AlertCircle, color: "text-red-400" },
    { label: "المشاريع", value: stats?.totalProjects ?? "-", icon: FolderKanban, color: "text-purple-400" },
    { label: "مزودات AI", value: stats?.totalProviders ?? "-", icon: Bot, color: "text-accent" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">نظرة عامة</h1>
        <p className="text-sm text-text-secondary">حالة النظام والمهام</p>
      </div>

      {stats && (
        <div className="mb-8 rounded-xl border border-dark-600 bg-dark-800 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">معدل النجاح</span>
            <span className="text-3xl font-bold text-green-400">{stats.successRate}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-dark-700">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${stats.successRate}%` }}
            />
          </div>
        </div>
      )}

      {!isPremium && (
        <div className="mb-6 rounded-xl border border-yellow-500/20 bg-gradient-to-r from-dark-800 to-yellow-500/5 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <Crown size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="font-medium">الخطة المجانية</p>
                <p className="text-sm text-text-secondary">رقّ خطتك لفتح جميع الميزات</p>
              </div>
            </div>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover"
            >
              <Zap size={16} />
              ترقية
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-dark-600 bg-dark-800 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">{card.label}</span>
              <card.icon size={20} className={card.color} />
            </div>
            <div className="mt-2 text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
