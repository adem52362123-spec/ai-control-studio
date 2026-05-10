export const TASK_STATUS = {
  PENDING: "pending",
  RUNNING: "running",
  DONE: "done",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const

export const COMMAND_STATUS = {
  RECEIVED: "received",
  ANALYZING: "analyzing",
  EXECUTING: "executing",
  DONE: "done",
  FAILED: "failed",
} as const

export const LOG_LEVELS = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  DEBUG: "debug",
} as const

export const AI_PROVIDERS = {
  OPENAI: "openai",
  CLAUDE: "claude",
  OPENROUTER: "openrouter",
} as const

export const PROJECT_STATUS = {
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const

export const AGENTS = {
  ORCHESTRATOR: { id: "orchestrator", label: "🧠 Orchestrator", desc: "المسؤول الرئيسي عن توزيع المهام" },
  ANALYZER: { id: "analyzer", label: "🔍 Analyzer", desc: "تحليل الأخطاء والمشاكل" },
  BACKEND: { id: "backend", label: "⚙️ Backend", desc: "مراجعة API وتحسين الأداء" },
  FRONTEND: { id: "frontend", label: "🎨 Frontend", desc: "تحسين واجهة المستخدم" },
  INTEGRATION: { id: "integration", label: "🔌 Integration", desc: "ربط frontend + backend + realtime" },
  LOGGER: { id: "logger", label: "🧾 Logger", desc: "تتبع العمليات وتحليل logs" },
  PERFORMANCE: { id: "performance", label: "🚀 Performance", desc: "تحسين السرعة والأداء" },
} as const

export const AGENT_LIST = Object.values(AGENTS)

export const PLANS = {
  FREE: { type: "free" as const, label: "مجاني", price: 0, features: ["3 مشاريع", "مزود AI واحد", "50 أمر/يوم", "سجل 7 أيام"] },
  PREMIUM: { type: "premium" as const, label: "احترافي", price: 99, features: ["مشاريع غير محدودة", "جميع مزودات AI", "أوامر غير محدودة", "سجل كامل", "7 وكلاء AI", "دعم أولوية"] },
} as const


