"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { SectionWrapper } from "./section-wrapper"
import type { QualityMetrics } from "@/lib/types"
import {
  formatPercentage,
  formatScore,
  formatDecisionType,
  qualityColor,
  CHART_COLORS,
} from "@/lib/formatters"

interface QualityMetricsSectionProps {
  data: QualityMetrics | undefined
  isLoading: boolean
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
          {entry.name}: {typeof entry.value === "number" && entry.value < 2 ? formatScore(entry.value) : entry.value}
        </p>
      ))}
    </div>
  )
}

export function QualityMetricsSection({
  data,
  isLoading,
}: QualityMetricsSectionProps) {
  if (!data) {
    return (
      <SectionWrapper title="Quality by Operation" isLoading={isLoading}>
        <div />
      </SectionWrapper>
    )
  }

  const operationData = Object.entries(data.groups ?? {}).map(([key, val], i) => ({
    name: formatDecisionType(key),
    quality: val.average_quality,
    traces: val.trace_count,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <SectionWrapper
      title="Quality by Operation"
      description={`${data.total_traces ?? 0} traces across ${Object.keys(data.groups ?? {}).length} operation types`}
      isLoading={isLoading}
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={operationData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 18%)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "hsl(220 10% 55%)" }}
              axisLine={{ stroke: "hsl(220 16% 18%)" }}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "hsl(220 10% 55%)" }}
              axisLine={{ stroke: "hsl(220 16% 18%)" }}
              tickLine={false}
              domain={[0, 1]}
              tickFormatter={(v: number) => formatScore(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="quality" name="Avg Quality" radius={[4, 4, 0, 0]}>
              {operationData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-4 border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Overall Avg</p>
          <p className={`text-sm font-medium ${qualityColor(data.overall_metrics?.average ?? 0)}`}>
            {formatScore(data.overall_metrics?.average ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Median</p>
          <p className="text-sm font-medium text-foreground">
            {formatScore(data.overall_metrics?.median ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Min</p>
          <p className="text-sm font-medium text-foreground">
            {formatScore(data.overall_metrics?.min ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Max</p>
          <p className="text-sm font-medium text-foreground">
            {formatScore(data.overall_metrics?.max ?? 0)}
          </p>
        </div>
      </div>
    </SectionWrapper>
  )
}
