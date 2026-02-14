import type {
  AgentMetrics,
  QualityMetrics,
  DecisionAnalytics,
  AgentInsights,
  AgentRecommendations,
  BehaviorPatterns,
  ObservabilitySummary,
  PerformanceTrends,
  Task,
  TaskCreatePayload,
  TaskTrace,
} from "./types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

async function postApi<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export function getTimeWindowParam(timeWindow: string): number {
  switch (timeWindow) {
    case "1h":
      return 1
    case "6h":
      return 6
    case "24h":
      return 24
    case "7d":
      return 168
    case "30d":
      return 720
    default:
      return 24
  }
}

// Observability endpoints
export async function fetchSummary(
  timeWindow: string
): Promise<ObservabilitySummary> {
  const hours = getTimeWindowParam(timeWindow)
  return fetchApi<ObservabilitySummary>(
    `/api/observability/summary?time_window=${hours}`
  )
}

export async function fetchPerformanceTrends(
  days: number = 7
): Promise<PerformanceTrends> {
  return fetchApi<PerformanceTrends>(
    `/api/observability/performance-trends?days=${days}`
  )
}

export async function fetchAgentMetrics(
  agent: string,
  timeWindow: string
): Promise<AgentMetrics> {
  const hours = getTimeWindowParam(timeWindow)
  return fetchApi<AgentMetrics>(
    `/api/observability/agent-metrics?agent=${agent}&time_window=${hours}`
  )
}

export async function fetchQualityMetrics(
  groupBy: string,
  timeWindow: string
): Promise<QualityMetrics> {
  const hours = getTimeWindowParam(timeWindow)
  return fetchApi<QualityMetrics>(
    `/api/observability/quality-metrics?group_by=${groupBy}&time_window=${hours}`
  )
}

export async function fetchDecisionAnalytics(
  timeWindow: string
): Promise<DecisionAnalytics> {
  const hours = getTimeWindowParam(timeWindow)
  return fetchApi<DecisionAnalytics>(
    `/api/observability/decision-analytics?time_window=${hours}`
  )
}

export async function fetchAgentInsights(
  agent: string,
  timeWindow: string
): Promise<AgentInsights> {
  const hours = getTimeWindowParam(timeWindow)
  return fetchApi<AgentInsights>(
    `/api/observability/agent-insights/${agent}?time_window=${hours}`
  )
}

export async function fetchAgentRecommendations(
  agent: string,
  timeWindow: string
): Promise<AgentRecommendations> {
  const hours = getTimeWindowParam(timeWindow)
  return fetchApi<AgentRecommendations>(
    `/api/observability/agent/${agent}/recommendations?time_window=${hours}`
  )
}

export async function fetchBehaviorPatterns(
  agent: string,
  timeWindow: string
): Promise<BehaviorPatterns> {
  const hours = getTimeWindowParam(timeWindow)
  return fetchApi<BehaviorPatterns>(
    `/api/observability/behavior-patterns?agent=${agent}&time_window=${hours}`
  )
}

// Task Management endpoints
export async function createTask(payload: TaskCreatePayload): Promise<Task> {
  return postApi<Task>("/api/tasks", payload)
}

export async function fetchTask(taskId: string): Promise<Task> {
  return fetchApi<Task>(`/api/tasks/${taskId}`)
}

export async function fetchRecentTasks(): Promise<Task[]> {
  return fetchApi<Task[]>("/api/tasks/recent")
}

export async function fetchTaskTraces(taskId: string): Promise<TaskTrace[]> {
  return fetchApi<TaskTrace[]>(`/api/tasks/${taskId}/traces`)
}
