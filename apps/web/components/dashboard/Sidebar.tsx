"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, FolderKanban, Terminal, ListTodo,
  Bot, Brain, FileText, Settings, LogOut, Cpu,
} from "lucide-react"
import { Crown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const links = [
  { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/dashboard/console", label: "مركز الأوامر", icon: Terminal },
  { href: "/dashboard/agents", label: "الوكلاء", icon: Cpu },
  { href: "/dashboard/projects", label: "المشاريع", icon: FolderKanban },
  { href: "/dashboard/tasks", label: "المهام", icon: ListTodo },
  { href: "/dashboard/providers", label: "مزودات AI", icon: Bot },
  { href: "/dashboard/memory", label: "الذاكرة", icon: Brain },
  { href: "/dashboard/logs", label: "السجلات", icon: FileText },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const isPremium = user?.plan === "premium"

  return (
    <aside className="fixed right-0 top-0 z-40 flex h-full w-64 flex-col border-l border-dark-600 bg-dark-800">
      <div className="flex items-center justify-between border-b border-dark-600 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
            AI
          </div>
          <span className="font-semibold">AI Control Studio</span>
        </div>
        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
          isPremium ? "bg-yellow-500/10 text-yellow-500" : "bg-dark-600 text-text-secondary"
        }`}>
          <Crown size={10} />
          {isPremium ? "PRO" : "Free"}
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-text-secondary hover:bg-dark-700 hover:text-text-primary"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-dark-600 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-dark-700 hover:text-red-400"
        >
          <LogOut size={18} />
          تسجيل خروج
        </button>
      </div>
    </aside>
  )
}
