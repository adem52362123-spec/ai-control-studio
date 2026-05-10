import { AgentService, AgentInput, okResult } from "./types"

export const orchestrator: AgentService = {
  name: "orchestrator",

  async analyze(input: AgentInput) {
    const start = Date.now()
    const text = input.commandInput.toLowerCase()

    const findings: string[] = []
    const suggestions: string[] = []

    findings.push("تم استلام الأمر بنجاح")
    findings.push(`نوع الأمر: ${classifyCommand(text)}`)

    if (input.projectId) {
      findings.push(`الموجه للمشروع: ${input.projectId}`)
    }

    suggestions.push("تم توزيع المهمة على الوكلاء المختصين")
    suggestions.push("يمكنك متابعة حالة التنفيذ في لوحة التحكم")

    const result = okResult(
      "orchestrator",
      `تم تحليل الأمر وتوزيعه على ${countRequiredAgents(text)} وكلاء`,
      findings,
      suggestions,
    )
    result.duration = Date.now() - start
    return result
  },
}

function classifyCommand(text: string): string {
  if (/\b(create|new|build|make|add|أنشئ|جديد|بناء|إضافة|أضف)\b/i.test(text)) return "إنشاء"
  if (/\b(fix|error|bug|repair|أصلح|خطأ|مشكلة|bug)\b/i.test(text)) return "إصلاح"
  if (/\b(improve|enhance|optimize|حسن|طور|حسّن)\b/i.test(text)) return "تحسين"
  if (/\b(delete|remove|حذف|إزالة)\b/i.test(text)) return "حذف"
  if (/\b(analyze|analyze|review|حلل|راجع|حلّل)\b/i.test(text)) return "تحليل"
  return "عام"
}

function countRequiredAgents(text: string): number {
  let count = 1
  if (/\b(api|server|backend|database|db|سيرفر|api|قاعدة)\b/i.test(text)) count++
  if (/\b(ui|frontend|page|component|interface|واجهة|صفحة|زر)\b/i.test(text)) count++
  if (/\b(error|bug|fail|خطأ|مشكلة)\b/i.test(text)) count++
  if (/\b(slow|performance|speed|cache|بطيء|أداء)\b/i.test(text)) count++
  return count
}
