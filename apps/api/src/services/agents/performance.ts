import { AgentService, AgentInput, okResult } from "./types"

export const performance: AgentService = {
  name: "performance",

  async analyze(input: AgentInput) {
    const start = Date.now()
    const text = input.commandInput.toLowerCase()

    const findings: string[] = []
    const suggestions: string[] = []

    if (/\b(slow|speed|performance|cache|loading|بطيء|أداء|سرعة|تحميل)\b/i.test(text)) {
      findings.push("تحليل أداء النظام للعلامات المرتبطة بالسرعة")
      suggestions.push("استخدم React.lazy و dynamic import للمكونات الكبيرة")
      suggestions.push("أضف pagination للقوائم الطويلة")
    }
    if (/\b(db|query|database|prisma|قاعدة)\b/i.test(text)) {
      findings.push("مراجعة أداء قاعدة البيانات")
      suggestions.push("أضف indexes على الحقول المستعملة في where")
      suggestions.push("استخدم select لتحديد الحقول المطلوبة فقط")
    }
    if (/\b(api|route|endpoint)\b/i.test(text)) {
      findings.push("تحليل أداء API")
      suggestions.push("أضف caching للـ responses المتكررة")
      suggestions.push("استخدم pagination في list endpoints")
    }

    suggestions.push("راجع bundle size للصفحات الكبيرة")
    suggestions.push("استخدم Next.js Image component للصور")

    const result = okResult("performance", "تحليل الأداء اكتمل", findings, suggestions)
    result.duration = Date.now() - start
    return result
  },
}
