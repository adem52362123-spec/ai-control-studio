"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-dark-600/50 backdrop-blur-xl bg-dark-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
            AI
          </div>
          <span className="text-lg font-semibold text-text-primary">AI Control Studio</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
            المميزات
          </Link>
          <Link href="#workflows" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
            كيفية العمل
          </Link>
          <Link href="#capabilities" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
            القدرات
          </Link>
          <Link href="#pricing" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
            الأسعار
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg bg-dark-600 px-4 py-2 text-sm text-text-primary transition-colors hover:bg-dark-500"
              >
                لوحة التحكم
              </Link>
              <button
                onClick={logout}
                className="rounded-lg bg-accent px-4 py-2 text-sm text-white transition-colors hover:bg-accent-hover"
              >
                تسجيل خروج
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                دخول
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-accent px-4 py-2 text-sm text-white transition-colors hover:bg-accent-hover"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
