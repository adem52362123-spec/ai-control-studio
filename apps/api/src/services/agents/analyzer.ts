import { AgentService, AgentInput, okResult } from "./types"

export const analyzer: AgentService = {
  name: "analyzer",

  async analyze(input: AgentInput) {
    const start = Date.now()
    const text = input.commandInput.toLowerCase()

    const findings: string[] = []
    const suggestions: string[] = []

    if (/\b(error|bug|fail|crash|exception|خطأ|مشكلة|عطل)\b/i.test(text)) {
      findings.push("تم اكتشاف خطأ في الأمر")
      findings.push("تحليل السبب الجذري قيد التنفيذ")

      if (/\b(api|server|database|سيرفر)\b/i.test(text)) {
        findings.push("الخطأ محتمل في طبقة الخلفية (Backend)")
        suggestions.push("تحقق من صحة API endpoints")
        suggestions.push("راجع logs السيرفر للبحث عن stack trace")
      }
      if (/\b(ui|page|interface|واجهة|صفحة)\b/i.test(text)) {
        findings.push("الخطأ محتمل في واجهة المستخدم")
        suggestions.push("تحقق من البيانات المرسلة للـ API")
        suggestions.push("تأكد من صحة imports في المكونات")
      }
      if (/\b(db|database|query|قاعدة|بيانات)\b/i.test(text)) {
        findings.push("الخطأ محتمل في قاعدة البيانات")
        suggestions.push("تحقق من صحة Prisma queries")
        suggestions.push("تأكد من وجود العلاقات (relations) المطلوبة")
      }
    } else {
      findings.push("لم يتم اكتشاف أخطاء واضحة")
      suggestions.push("لا توجد مشاكل حرجة في الأمر")
    }

    const result = okResult("analyzer", "تحليل الأخطاء اكتمل", findings, suggestions)
    result.duration = Date.now() - start
    return result
  },
}
