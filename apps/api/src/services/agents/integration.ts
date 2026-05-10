import { AgentService, AgentInput, okResult } from "./types"

export const integration: AgentService = {
  name: "integration",

  async analyze(input: AgentInput) {
    const start = Date.now()
    const text = input.commandInput.toLowerCase()

    const findings: string[] = []
    const suggestions: string[] = []

    if (/\b(api|websocket|socket|realtime|ربط|اتصال)\b/i.test(text)) {
      findings.push("التحقق من ربط API مع الواجهة")
      suggestions.push("تأكد من تطابق types بين frontend و backend")
      suggestions.push("تأكد من إرسال Bearer token في جميع الطلبات")
    }
    if (/\b(websocket|socket|realtime|مباشر)\b/i.test(text)) {
      findings.push("مراجعة اتصال WebSocket")
      suggestions.push("تأكد من تمرير token في handshake")
      suggestions.push("أضف reconnect strategy مع exponential backoff")
    }

    findings.push("التحقق من اتساق البيانات")
    suggestions.push("تأكد من أن API returns نفس types المتوقعة في الواجهة")
    suggestions.push("استخدم نفس error format في جميع الـ routes")

    const result = okResult("integration", "تحليل التكامل اكتمل", findings, suggestions)
    result.duration = Date.now() - start
    return result
  },
}
