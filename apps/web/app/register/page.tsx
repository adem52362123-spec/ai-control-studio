"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { register } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    try {
      await register(email, password, name)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "فشل إنشاء الحساب")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-xl font-bold text-white">
            AI
          </div>
          <h1 className="text-2xl font-bold">إنشاء حساب</h1>
          <p className="mt-1 text-sm text-text-secondary">ابدأ رحلتك مع AI Control Studio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm text-text-secondary">الاسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full rounded-lg border border-dark-600 bg-dark-800 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent"
              placeholder="اسمك الكامل"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-text-secondary">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-dark-600 bg-dark-800 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-text-secondary">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-dark-600 bg-dark-800 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent"
              placeholder="******"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            إنشاء حساب
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          عندي حساب؟{" "}
          <Link href="/login" className="text-accent hover:underline">
            تسجيل دخول
          </Link>
        </p>
      </div>
    </div>
  )
}
