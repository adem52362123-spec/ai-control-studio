import type { AgentName, AgentResult } from "@ai-control/shared"
export type { AgentResult }

export interface AgentInput {
  commandId: string
  commandInput: string
  userId: string
  projectId?: string
  context?: Record<string, any>
}

export interface AgentService {
  name: AgentName
  analyze(input: AgentInput): Promise<AgentResult>
}

export function okResult(agent: AgentName, summary: string, findings: string[], suggestions: string[]): AgentResult {
  return {
    agent,
    status: "done",
    summary,
    findings,
    suggestions,
    confidence: suggestions.length > 0 ? 0.85 : 0.7,
    duration: 0,
  }
}

export function errorResult(agent: AgentName, error: string): AgentResult {
  return {
    agent,
    status: "error",
    summary: error,
    findings: [],
    suggestions: [],
    confidence: 0,
    duration: 0,
  }
}
