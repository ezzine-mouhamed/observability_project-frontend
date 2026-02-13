"use client"

import { useState, useCallback, useMemo } from "react"
import { DashboardHeader } from "./dashboard-header"
import { SummaryCards } from "./summary-cards"
import { KeyInsightsBanner } from "./key-insights-banner"
import { PerformanceSection } from "./performance-section"
import { QualityMetricsSection } from "./quality-metrics-section"
import { DecisionAnalyticsSection } from "./decision-analytics-section"
import { InsightsSection } from "./insights-section"
import { BehaviorPatternsSection } from "./behavior-patterns-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useAgentMetrics,
  useQualityMetrics,
  useDecisionAnalytics,
  useAgentInsights,
  useAgentRecommendations,
  useBehaviorPatterns,
  useSummary,
  usePerformanceTrends,
} from "@/hooks/use-dashboard-data"

export function Dashboard() {
  const [timeWindow, setTimeWindow] = useState("24h")
  const [agent, setAgent] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Summary is always fetched -- it populates top-level cards and the agent list
  const { data: summary, mutate: mutateSummary, isLoading: summaryLoading } =
    useSummary(timeWindow)

  // Derive available agents from the summary response
  const agentOptions = useMemo(() => {
    if (!summary?.agent_performance) return []
    return Object.keys(summary.agent_performance)
  }, [summary])

  // Resolve which agent id to pass to per-agent hooks
  const resolvedAgent = agent === "all" ? (agentOptions[0] ?? "decision_engine") : agent

  const { data: metrics, isLoading: metricsLoading, mutate: mutateMetrics } =
    useAgentMetrics(resolvedAgent, timeWindow)
  const {
    data: qualityMetrics,
    isLoading: qualityLoading,
    mutate: mutateQuality,
  } = useQualityMetrics("operation", timeWindow)
  const {
    data: decisionAnalytics,
    isLoading: decisionsLoading,
    mutate: mutateDecisions,
  } = useDecisionAnalytics(timeWindow)
  const {
    data: insights,
    isLoading: insightsLoading,
    mutate: mutateInsights,
  } = useAgentInsights(resolvedAgent, timeWindow)
  const {
    data: recommendations,
    isLoading: recsLoading,
    mutate: mutateRecs,
  } = useAgentRecommendations(resolvedAgent, timeWindow)
  const {
    data: behaviorPatterns,
    isLoading: patternsLoading,
    mutate: mutatePatterns,
  } = useBehaviorPatterns(resolvedAgent, timeWindow)
  const { data: trends, isLoading: trendsLoading, mutate: mutateTrends } =
    usePerformanceTrends()

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await Promise.all([
      mutateSummary(),
      mutateMetrics(),
      mutateQuality(),
      mutateDecisions(),
      mutateInsights(),
      mutateRecs(),
      mutatePatterns(),
      mutateTrends(),
    ])
    setIsRefreshing(false)
  }, [
    mutateSummary,
    mutateMetrics,
    mutateQuality,
    mutateDecisions,
    mutateInsights,
    mutateRecs,
    mutatePatterns,
    mutateTrends,
  ])

  const keyInsights = summary?.key_insights ?? []

  // Build summary card data from the summary endpoint
  const summaryCardData = summary
    ? {
        total_traces: summary.summary.total_traces,
        success_rate: summary.summary.overall_success_rate,
        quality_score: summary.summary.overall_quality,
        agent_count: summary.summary.agent_count,
        decision_quality: summary.decision_insights.average_decision_quality,
      }
    : undefined

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        timeWindow={timeWindow}
        onTimeWindowChange={setTimeWindow}
        agent={agent}
        onAgentChange={setAgent}
        agentOptions={agentOptions}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <SummaryCards data={summaryCardData} isLoading={summaryLoading} />

      {keyInsights.length > 0 && <KeyInsightsBanner insights={keyInsights} />}

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="w-full justify-start bg-secondary">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="decisions">Decisions</TabsTrigger>
          <TabsTrigger value="insights">
            {"Insights & Recommendations"}
          </TabsTrigger>
          <TabsTrigger value="behavior">Behavior Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-4 flex flex-col gap-4">
          <PerformanceSection
            metrics={metrics}
            trends={trends}
            isLoading={metricsLoading}
            trendLoading={trendsLoading}
          />
          <QualityMetricsSection
            data={qualityMetrics}
            isLoading={qualityLoading}
          />
        </TabsContent>

        <TabsContent value="decisions" className="mt-4">
          <DecisionAnalyticsSection
            data={decisionAnalytics}
            isLoading={decisionsLoading}
          />
        </TabsContent>

        <TabsContent value="insights" className="mt-4">
          <InsightsSection
            insights={insights}
            recommendations={recommendations}
            isLoading={insightsLoading || recsLoading}
          />
        </TabsContent>

        <TabsContent value="behavior" className="mt-4">
          <BehaviorPatternsSection
            data={behaviorPatterns}
            isLoading={patternsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
