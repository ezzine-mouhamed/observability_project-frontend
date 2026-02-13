"use client"

import useSWR from "swr"
import {
  fetchAgentMetrics,
  fetchQualityMetrics,
  fetchDecisionAnalytics,
  fetchAgentInsights,
  fetchAgentRecommendations,
  fetchBehaviorPatterns,
  fetchSummary,
  fetchPerformanceTrends,
  fetchRecentTasks,
  fetchTask,
  fetchTaskTraces,
} from "@/lib/api"
import {
  mockAgentMetrics,
  mockQualityMetrics,
  mockDecisionAnalytics,
  mockAgentInsights,
  mockRecommendations,
  mockBehaviorPatterns,
  mockSummary,
  mockPerformanceTrends,
} from "@/lib/mock-data"

/**
 * Wraps an API call so that it falls back to mock data
 * if the real backend is unreachable.
 */
function withFallback<T>(apiFn: () => Promise<T>, mock: T) {
  return async (): Promise<T> => {
    try {
      return await apiFn()
    } catch {
      // Backend not available -- serve mock data so the UI is still useful
      return mock
    }
  }
}

const SWR_OPTS = { revalidateOnFocus: false, dedupingInterval: 30_000 } as const

// ---- Observability hooks ----

export function useSummary(timeWindow: string) {
  return useSWR(
    ["summary", timeWindow],
    withFallback(() => fetchSummary(timeWindow), mockSummary),
    SWR_OPTS,
  )
}

export function usePerformanceTrends(days = 7) {
  return useSWR(
    ["performance-trends", days],
    withFallback(() => fetchPerformanceTrends(days), mockPerformanceTrends),
    { ...SWR_OPTS, dedupingInterval: 60_000 },
  )
}

export function useAgentMetrics(agent: string, timeWindow: string) {
  return useSWR(
    ["agent-metrics", agent, timeWindow],
    withFallback(() => fetchAgentMetrics(agent, timeWindow), mockAgentMetrics),
    SWR_OPTS,
  )
}

export function useQualityMetrics(groupBy: string, timeWindow: string) {
  return useSWR(
    ["quality-metrics", groupBy, timeWindow],
    withFallback(() => fetchQualityMetrics(groupBy, timeWindow), mockQualityMetrics),
    SWR_OPTS,
  )
}

export function useDecisionAnalytics(timeWindow: string) {
  return useSWR(
    ["decision-analytics", timeWindow],
    withFallback(() => fetchDecisionAnalytics(timeWindow), mockDecisionAnalytics),
    SWR_OPTS,
  )
}

export function useAgentInsights(agent: string, timeWindow: string) {
  return useSWR(
    ["agent-insights", agent, timeWindow],
    withFallback(() => fetchAgentInsights(agent, timeWindow), mockAgentInsights),
    SWR_OPTS,
  )
}

export function useAgentRecommendations(agent: string, timeWindow: string) {
  return useSWR(
    ["agent-recommendations", agent, timeWindow],
    withFallback(
      () => fetchAgentRecommendations(agent, timeWindow),
      mockRecommendations,
    ),
    SWR_OPTS,
  )
}

export function useBehaviorPatterns(agent: string, timeWindow: string) {
  return useSWR(
    ["behavior-patterns", agent, timeWindow],
    withFallback(
      () => fetchBehaviorPatterns(agent, timeWindow),
      mockBehaviorPatterns,
    ),
    SWR_OPTS,
  )
}

// ---- Task hooks ----

export function useRecentTasks() {
  return useSWR(
    "recent-tasks",
    withFallback(() => fetchRecentTasks(), []),
    SWR_OPTS,
  )
}

export function useTask(taskId: string | null) {
  return useSWR(
    taskId ? ["task", taskId] : null,
    taskId
      ? withFallback(() => fetchTask(taskId), null as never)
      : null,
    SWR_OPTS,
  )
}

export function useTaskTraces(taskId: string | null) {
  return useSWR(
    taskId ? ["task-traces", taskId] : null,
    taskId
      ? withFallback(() => fetchTaskTraces(taskId), [])
      : null,
    SWR_OPTS,
  )
}
