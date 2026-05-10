import { AgentService, AgentInput, okResult } from "./types"

export const backend: AgentService = {
  name: "backend",

  async analyze(input: AgentInput) {
    const start = Date.now()
    const text = input.commandInput.toLowerCase()

    const findings: string[] = []
    const suggestions: string[] = []

    if (/\b(api|route|endpoint|سيرفر|api|route)\b/i.test(text)) {
      findings.push("مراجعة API routes المرتبطة")
      suggestions.push("تأكد من إضافة middleware المصادقة (auth)")
      suggestions.push("أضف Zod validation لجميع الـ inputs")
    }
    if (/\b(db|database|query|prisma|schema|قاعدة|بيانات|prisma)\b/i.test(text)) {
      findings.push("مراجعة queries قاعدة البيانات")
      suggestions.push("تأكد من استخدام indexes على الحقول المكررة")
      suggestions.push("استخدم transactions للعمليات المتعددة")
    }
    if (/\b(error|fix|أصلح|خطأ)\b/i.test(text)) {
      findings.push("تحليل الأخطاء في الخلفية")
      suggestions.push("أضف try/catch حول جميع الـ async handlers")
      suggestions.push("سجل الأخطاء في نظام logs")
    }

    if (findings.length === 0) {
      findings.push("لا توجد مشاكل واضحة في الخلفية")
      suggestions.push("النظام الخلفي يعمل بشكل طبيعي")
    }

    const result = okResult("backend", "تحليل الخلفية اكتمل", findings, suggestions)
    result.duration = Date.now() - start
    return result
  },
}
