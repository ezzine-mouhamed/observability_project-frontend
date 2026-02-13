"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionWrapper } from "./section-wrapper"
import type { AgentInsights, AgentRecommendations } from "@/lib/types"
import {
  formatScore,
  qualityColor,
  qualityBgColor,
  qualityLabel,
  priorityColor,
} from "@/lib/formatters"
import {
  Lightbulb,
  AlertCircle,
  ArrowRight,
  Eye,
  Brain,
  Target,
} from "lucide-react"

interface InsightsSectionProps {
  insights: AgentInsights | undefined
  recommendations: AgentRecommendations | undefined
  isLoading: boolean
}

export function InsightsSection({
  insights,
  recommendations,
  isLoading,
}: InsightsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Agent Insights */}
      <SectionWrapper
        title="Agent Insights"
        description={
          insights
            ? `Generated ${new Date(insights.generated_at).toLocaleString()}`
            : undefined
        }
        isLoading={isLoading}
      >
        {insights && (
          <div className="flex flex-col gap-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Observations</p>
                  <p className="text-lg font-semibold text-foreground">
                    {insights.observation_count}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Decisions</p>
                  <p className="text-lg font-semibold text-foreground">
                    {insights.decision_count}
                  </p>
                </div>
              </div>
            </div>

            {/* Quality Overview */}
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">
                  Quality Overview
                </h4>
                <Badge
                  className={qualityBgColor(insights.average_quality_score)}
                  variant="outline"
                >
                  {qualityLabel(insights.average_quality_score)}
                </Badge>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Decision Quality
                  </span>
                  <span
                    className={`font-mono text-sm font-medium ${qualityColor(insights.average_decision_quality)}`}
                  >
                    {formatScore(insights.average_decision_quality)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Overall Quality
                  </span>
                  <span
                    className={`font-mono text-sm font-medium ${qualityColor(insights.average_quality_score)}`}
                  >
                    {formatScore(insights.average_quality_score)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trend</span>
                  <span className="text-sm font-medium capitalize text-foreground">
                    {insights.performance_trend}
                  </span>
                </div>
              </div>
            </div>

            {/* Target */}
            <div className="flex items-start gap-3 rounded-lg bg-secondary p-3">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Decision Quality Target
                </p>
                <p className="text-xs text-muted-foreground">
                  {"Current: "}
                  {formatScore(insights.average_decision_quality)}
                  {" | Target: 0.900 | Gap: "}
                  {formatScore(
                    Math.max(
                      0,
                      0.9 - insights.average_decision_quality
                    )
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </SectionWrapper>

      {/* Recommendations */}
      <SectionWrapper
        title="Recommendations"
        description={
          recommendations
            ? `${recommendations.recommendations.length} actionable items`
            : undefined
        }
        isLoading={isLoading}
      >
        {recommendations && (
          <div className="flex flex-col gap-3">
            {recommendations.recommendations.map((rec, i) => (
              <Card key={i} className="border-border bg-secondary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {rec.priority === "high" ? (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        ) : (
                          <Lightbulb className="h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {rec.action}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {rec.reason}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-xs capitalize ${priorityColor(rec.priority)}`}
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="capitalize">{rec.type}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>Action Required</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionWrapper>
    </div>
  )
}
