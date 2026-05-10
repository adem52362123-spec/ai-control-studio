import { AgentService, AgentInput, okResult } from "./types"

export const frontend: AgentService = {
  name: "frontend",

  async analyze(input: AgentInput) {
    const start = Date.now()
    const text = input.commandInput.toLowerCase()

    const findings: string[] = []
    const suggestions: string[] = []

    if (/\b(ui|page|component|interface|واجهة|صفحة|مكون)\b/i.test(text)) {
      findings.push("مراجعة مكونات واجهة المستخدم")
      suggestions.push('تأكد من استخدام "use client" في المكونات التفاعلية')
      suggestions.push("أضف حالات التحميل (loading states) لجميع البيانات")
    }
    if (/\b(form|input|button|زر|حقل|مدخل)\b/i.test(text)) {
      findings.push("مراجعة عناصر الإدخال")
      suggestions.push("أضف validation للـ forms قبل الإرسال")
      suggestions.push("استخدم disabled state أثناء التحميل")
    }
    if (/\b(design|style|color|theme|تصميم|لون|شكل)\b/i.test(text)) {
      findings.push("تحليل التصميم الحالي")
      suggestions.push("حافظ على تناسق الألوان الداكنة")
      suggestions.push("استخدم Tailwind classes بدل CSS المباشر")
    }

    if (findings.length === 0) {
      findings.push("لا توجد مشاكل واضحة في الواجهة")
      suggestions.push("الواجهة تعمل بشكل طبيعي")
    }

    const result = okResult("frontend", "تحليل الواجهة اكتمل", findings, suggestions)
    result.duration = Date.now() - start
    return result
  },
}
