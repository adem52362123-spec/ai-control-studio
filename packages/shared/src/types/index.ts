export type TaskStatus = "pending" | "running" | "done" | "failed" | "cancelled"
export type CommandStatus = "received" | "analyzing" | "executing" | "done" | "failed"
export type LogLevel = "info" | "warn" | "error" | "debug"
export type AiProviderName = "openai" | "claude" | "openrouter"
export type ProjectStatus = "active" | "archived"
export type AgentName = "orchestrator" | "analyzer" | "backend" | "frontend" | "integration" | "logger" | "performance"
export type AgentStatus = "idle" | "analyzing" | "done" | "error"
export type PlanType = "free" | "premium"

export interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

export interface Project {
  id: string
  name: string
  slug: string
  description: string | null
  status: ProjectStatus
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  type: string
  status: TaskStatus
  progress: number
  plan: string | null
  result: string | null
  error: string | null
  projectId: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Command {
  id: string
  input: string
  analysis: string | null
  type: string
  status: CommandStatus
  projectId: string | null
  userId: string
  taskId: string | null
  createdAt: string
}

export interface AiProvider {
  id: string
  name: AiProviderName
  apiKey: string
  baseUrl: string | null
  isActive: boolean
  userId: string
  createdAt: string
}

export interface AiMemory {
  id: string
  key: string
  content: string
  projectId: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Log {
  id: string
  level: LogLevel
  message: string
  meta: string | null
  taskId: string | null
  userId: string | null
  createdAt: string
}

export interface AgentResult {
  agent: AgentName
  status: AgentStatus
  summary: string
  findings: string[]
  suggestions: string[]
  confidence: number
  duration: number
}

export interface AgentTask {
  id: string
  commandId: string
  commandInput: string
  agent: AgentName
  status: AgentStatus
  result: AgentResult | null
  createdAt: string
  completedAt: string | null
}

export interface SubscriptionPlan {
  type: PlanType
  label: string
  price: number
  features: string[]
}
