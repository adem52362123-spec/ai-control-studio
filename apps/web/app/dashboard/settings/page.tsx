"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api-client"
import { Settings, Shield, Crown, Loader2, Check, Zap } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const isPremium = user?.plan === "premium"

  async function handleUpgrade() {
    setLoading(true)
    setMsg("")
    try {
      const res = await api.post<{ plan: string; message: string }>("/api/subscription/upgrade", {})
      setMsg(res.message)
      window.location.reload()
    } catch {
      setMsg("فشلت الترقية، حاول مجدداً")
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    setLoading(true)
    setMsg("")
    try {
      const res = await api.post<{ plan: string; message: string }>("/api/subscription/cancel", {})
      setMsg(res.message)
      window.location.reload()
    } catch {
      setMsg("فشل الإلغاء، حاول مجدداً")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-sm text-text-secondary">إعدادات الحساب والنظام</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Settings size={20} className="text-accent" />
            معلومات الحساب
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-dark-700 pb-2">
              <span className="text-text-secondary text-sm">الاسم</span>
              <span className="text-text-primary text-sm">{user?.name}</span>
            </div>
            <div className="flex justify-between border-b border-dark-700 pb-2">
              <span className="text-text-secondary text-sm">البريد الإلكتروني</span>
              <span className="text-text-primary text-sm">{user?.email}</span>
            </div>
            <div className="flex justify-between border-b border-dark-700 pb-2">
              <span className="text-text-secondary text-sm">الصلاحية</span>
              <span className="text-text-primary text-sm">{user?.role}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Crown size={20} className="text-yellow-500" />
            الاشتراك
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-dark-900 p-4">
              <div>
                <p className="font-medium">
                  {isPremium ? "الخطة الاحترافية" : "الخطة المجانية"}
                </p>
                <p className="text-sm text-text-secondary">
                  {isPremium
                    ? "جميع الميزات متاحة لك"
                    : "رقّ خطتك للحصول على المزيد"}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                isPremium ? "bg-yellow-500/10 text-yellow-500" : "bg-dark-600 text-text-secondary"
              }`}>
                {isPremium ? "Premium" : "Free"}
              </span>
            </div>

            {!isPremium && (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 font-semibold text-white transition-all hover:bg-accent-hover disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                {loading ? "جاري الترقية..." : "ترقية إلى $99/شهر"}
              </button>
            )}

            {isPremium && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 py-3 font-semibold text-red-400 transition-all hover:bg-red-500/10 disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                {loading ? "جاري الإلغاء..." : "إلغاء الاشتراك"}
              </button>
            )}

            {msg && (
              <div className="flex items-center gap-2 text-sm text-green-500">
                <Check size={16} />
                {msg}
              </div>
            )}

            <div className="space-y-2 text-sm text-text-secondary">
              <p className="flex items-center gap-2">
                <Check size={14} className="text-green-500" /> 3 مشاريع (مجاني) ← غير محدودة (احترافي)
              </p>
              <p className="flex items-center gap-2">
                <Check size={14} className="text-green-500" /> مزود AI واحد (مجاني) ← جميع المزودات (احترافي)
              </p>
              <p className="flex items-center gap-2">
                <Check size={14} className="text-green-500" /> 50 أمر/يوم (مجاني) ← غير محدود (احترافي)
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-dark-600 bg-dark-800 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Shield size={20} className="text-accent" />
            الأمان
          </h2>
          <div className="space-y-3 text-sm text-text-secondary">
            <p>✓ جميع مفاتيح API مشفرة باستخدام AES-256-GCM</p>
            <p>✓ التوثيق عبر JWT مع Refresh Tokens</p>
            <p>✓ النظام مخصص لصاحب الحساب فقط (Owner-only)</p>
            <p>✓ Rate limiting مفعل على جميع المسارات</p>
          </div>
        </div>
      </div>
    </div>
  )
}
