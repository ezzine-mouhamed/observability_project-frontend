"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts"
import { SectionWrapper } from "./section-wrapper"
import type { AgentMetrics, PerformanceTrends } from "@/lib/types"
import {
  formatPercentage,
  formatScore,
  formatDuration,
  QUALITY_COLORS,
} from "@/lib/formatters"

interface PerformanceSectionProps {
  metrics: AgentMetrics | undefined
  trends: PerformanceTrends | undefined
  isLoading: boolean
  trendLoading: boolean
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-lg">
      <p className="mb-1 font-medium text-popover-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-muted-foreground" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === "number" && entry.value < 1 ? formatPercentage(entry.value) : entry.value}
        </p>
      ))}
    </div>
  )
}

export function PerformanceSection({
  metrics,
  trends,
  isLoading,
  trendLoading,
}: PerformanceSectionProps) {
  const qualityDistData = metrics
    ? [
        {
          name: "Excellent",
          count: metrics.quality_distribution.excellent,
          fill: QUALITY_COLORS.excellent,
        },
        {
          name: "Good",
          count: metrics.quality_distribution.good,
          fill: QUALITY_COLORS.good,
        },
        {
          name: "Acceptable",
          count: metrics.quality_distribution.acceptable,
          fill: QUALITY_COLORS.acceptable,
        },
        {
          name: "Needs Improvement",
          count: metrics.quality_distribution.needs_improvement,
          fill: QUALITY_COLORS.needs_improvement,
        },
        {
          name: "Poor",
          count: metrics.quality_distribution.poor,
          fill: QUALITY_COLORS.poor,
        },
      ]
    : []

  const trendData = trends?.daily.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    "Avg Quality": d.avg_quality,
    "Success Rate": d.success_rate,
  }))

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SectionWrapper
        title="Quality Distribution"
        description="Distribution of trace quality scores"
        isLoading={isLoading}
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={qualityDistData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 18%)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "hsl(220 10% 55%)" }}
                axisLine={{ stroke: "hsl(220 16% 18%)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(220 10% 55%)" }}
                axisLine={{ stroke: "hsl(220 16% 18%)" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {qualityDistData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {metrics && (
          <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Avg Duration</p>
              <p className="text-sm font-medium text-foreground">
                {formatDuration(metrics.average_duration_ms)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Decisions/Trace</p>
              <p className="text-sm font-medium text-foreground">
                {metrics.average_decisions_per_trace.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Error Types</p>
              <p className="text-sm font-medium text-foreground">
                {Object.keys(metrics.error_types).length}
              </p>
            </div>
          </div>
        )}
      </SectionWrapper>

      <SectionWrapper
        title="Performance Trends"
        description="Quality and success rate over time"
        isLoading={trendLoading}
      >
        {trendData && trendData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(220 16% 18%)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "hsl(220 10% 55%)" }}
                  axisLine={{ stroke: "hsl(220 16% 18%)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(220 10% 55%)" }}
                  axisLine={{ stroke: "hsl(220 16% 18%)" }}
                  tickLine={false}
                  domain={[0, 1]}
                  tickFormatter={(v: number) => formatPercentage(v)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", color: "hsl(220 10% 55%)" }}
                />
                <Line
                  type="monotone"
                  dataKey="Avg Quality"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#34d399" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Success Rate"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#60a5fa" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No trend data available
            </p>
          </div>
        )}
        {metrics && (
          <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Quality Score</p>
              <p className="text-sm font-medium text-foreground">
                {formatScore(metrics.average_quality_score)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
              <p className="text-sm font-medium text-foreground">
                {formatPercentage(metrics.success_rate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trend</p>
              <p className="text-sm font-medium capitalize text-foreground">
                {metrics.performance_trend}
              </p>
            </div>
          </div>
        )}
      </SectionWrapper>
    </div>
  )
}
