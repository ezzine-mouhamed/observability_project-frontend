"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SectionWrapper } from "./section-wrapper"
import type { BehaviorPatterns } from "@/lib/types"
import { formatDuration } from "@/lib/formatters"
import {
  ArrowRight,
  AlertTriangle,
  Shield,
  Clock,
  Info,
} from "lucide-react"

interface BehaviorPatternsSectionProps {
  data: BehaviorPatterns | undefined
  isLoading: boolean
}

function ConsistencyBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    high: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
    medium: "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
    low: "bg-red-400/15 text-red-400 border-red-400/30",
  }
  return (
    <Badge variant="outline" className={`capitalize ${colors[level] || ""}`}>
      {level} Consistency
    </Badge>
  )
}

export function BehaviorPatternsSection({
  data,
  isLoading,
}: BehaviorPatternsSectionProps) {
  if (!data) {
    return (
      <SectionWrapper title="Behavior Patterns" isLoading={isLoading}>
        <div />
      </SectionWrapper>
    )
  }

  const errorEntries = Object.entries(data.error_patterns)
  const sequences = data.operation_sequences?.decision_engine
  const sequenceEntries = sequences?.common_sequences
    ? Object.entries(sequences.common_sequences).sort(
        ([, a], [, b]) => b - a
      )
    : []
  const consistency = data.behavioral_consistency?.decision_engine
  const timingEntries = Object.entries(data.timing_patterns)
    .sort(([a], [b]) => Number(a) - Number(b))

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Operation Sequences */}
      <SectionWrapper
        title="Operation Sequences"
        description={`${data.total_traces_analyzed} traces analyzed`}
        isLoading={isLoading}
      >
        <div className="flex flex-col gap-2">
          {sequenceEntries.map(([seq, count]) => {
            const [from, to] = seq.split(" -> ")
            return (
              <div
                key={seq}
                className="flex items-center justify-between rounded-lg bg-secondary p-3"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-foreground">{from}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-foreground">{to}</span>
                </div>
                <Badge variant="outline" className="font-mono">
                  {count}x
                </Badge>
              </div>
            )
          })}
        </div>
        {consistency && (
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Behavioral Consistency
              </span>
            </div>
            <ConsistencyBadge level={consistency.consistency_level} />
          </div>
        )}
      </SectionWrapper>

      {/* Error Patterns & Timing */}
      <SectionWrapper
        title="Error Patterns"
        description={`${errorEntries.reduce((s, [, c]) => s + c, 0)} total errors`}
        isLoading={isLoading}
      >
        {errorEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow key="header" className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Error</TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    Count
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errorEntries.map(([error, count]) => (
                  <TableRow key={error} className="border-border">
                    <TableCell className="font-mono text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-red-400" />
                        {error}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {count}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No errors detected</p>
        )}

        {/* Timing Patterns */}
        <div className="mt-4 border-t border-border pt-4">
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-medium text-foreground">
              Timing Patterns
            </h4>
          </div>
          <div className="flex flex-col gap-2">
            {timingEntries.map(([hour, data]) => (
              <div
                key={hour}
                className="flex items-center justify-between rounded bg-secondary px-3 py-2 text-sm"
              >
                <span className="font-mono text-muted-foreground">
                  {hour}:00
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-foreground">
                    {data.count} ops
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {formatDuration(data.avg_duration)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Insights */}
      <SectionWrapper
        title="Behavioral Insights"
        description="AI-generated observations"
        isLoading={isLoading}
      >
        <div className="flex flex-col gap-3">
          {data.insights.map((insight, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg bg-secondary p-3"
            >
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm text-foreground">{insight}</p>
            </div>
          ))}
        </div>
        {consistency && (
          <div className="mt-4 border-t border-border pt-4">
            <h4 className="mb-2 text-sm font-medium text-foreground">
              Consistency Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Score</p>
                <p className="text-lg font-semibold text-foreground">
                  {consistency.consistency_score.toFixed(3)}
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">
                  Unique / Total Ops
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {consistency.unique_operations} / {consistency.total_operations}
                </p>
              </div>
            </div>
          </div>
        )}
      </SectionWrapper>
    </div>
  )
}
