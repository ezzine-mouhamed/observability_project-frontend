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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SectionWrapper } from "./section-wrapper"
import type { DecisionAnalytics } from "@/lib/types"
import {
  formatPercentage,
  formatScore,
  formatDecisionType,
  qualityColor,
  QUALITY_COLORS,
} from "@/lib/formatters"

interface DecisionAnalyticsSectionProps {
  data: DecisionAnalytics | undefined
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
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

export function DecisionAnalyticsSection({
  data,
  isLoading,
}: DecisionAnalyticsSectionProps) {
  if (!data) {
    return (
      <SectionWrapper title="Decision Analytics" isLoading={isLoading}>
        <div />
      </SectionWrapper>
    )
  }

  const decisionTypes = Object.entries(data.decision_type_analysis).map(
    ([key, val]) => ({
      name: formatDecisionType(key),
      count: val.count,
      quality: val.average_quality,
      percentage: val.percentage,
    })
  )

  const qualityDistData = [
    {
      name: "Excellent",
      count: data.quality_distribution.excellent,
      fill: QUALITY_COLORS.excellent,
    },
    {
      name: "Good",
      count: data.quality_distribution.good,
      fill: QUALITY_COLORS.good,
    },
    {
      name: "Acceptable",
      count: data.quality_distribution.acceptable,
      fill: QUALITY_COLORS.acceptable,
    },
    {
      name: "Needs Improv.",
      count: data.quality_distribution.needs_improvement,
      fill: QUALITY_COLORS.needs_improvement,
    },
    {
      name: "Poor",
      count: data.quality_distribution.poor,
      fill: QUALITY_COLORS.poor,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SectionWrapper
        title="Decision Types"
        description={`${data.total_decisions} total decisions analyzed`}
        isLoading={isLoading}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-right text-muted-foreground">
                  Count
                </TableHead>
                <TableHead className="text-right text-muted-foreground">
                  Quality
                </TableHead>
                <TableHead className="text-right text-muted-foreground">
                  Share
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decisionTypes.map((dt) => (
                <TableRow key={dt.name} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {dt.name}
                  </TableCell>
                  <TableCell className="text-right font-mono text-foreground">
                    {dt.count}
                  </TableCell>
                  <TableCell
                    className={`text-right font-mono ${qualityColor(dt.quality)}`}
                  >
                    {formatScore(dt.quality)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {formatPercentage(dt.percentage)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <h4 className="mb-2 text-sm font-medium text-foreground">
            Success Correlation
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-xs text-muted-foreground">
                Successful Traces Avg
              </p>
              <p
                className={`text-lg font-semibold ${qualityColor(data.success_correlation.successful_trace_decisions_avg_quality)}`}
              >
                {formatScore(
                  data.success_correlation
                    .successful_trace_decisions_avg_quality
                )}
              </p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-xs text-muted-foreground">
                Failed Traces Avg
              </p>
              <p
                className={`text-lg font-semibold ${qualityColor(data.success_correlation.failed_trace_decisions_avg_quality)}`}
              >
                {formatScore(
                  data.success_correlation.failed_trace_decisions_avg_quality
                )}
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper
        title="Decision Quality Distribution"
        description="Quality breakdown of all decisions"
        isLoading={isLoading}
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={qualityDistData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 18%)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(220 10% 55%)" }}
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
        <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Avg Quality</p>
            <p
              className={`text-sm font-medium ${qualityColor(data.average_decision_quality ?? 0)}`}
            >
              {formatScore(data.average_decision_quality ?? 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Context Length</p>
            <p className="text-sm font-medium text-foreground">
              {data.average_context_length}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Decisions/Trace</p>
            <p className="text-sm font-medium text-foreground">
              {data.average_decisions_per_trace.toFixed(2)}
            </p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}
