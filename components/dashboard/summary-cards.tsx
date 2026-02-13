"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Activity,
  CheckCircle,
  Gauge,
  Brain,
  Users,
} from "lucide-react"
import {
  formatPercentage,
  formatScore,
  formatNumber,
  qualityColor,
} from "@/lib/formatters"

export interface SummaryCardData {
  total_traces: number
  success_rate: number
  quality_score: number
  agent_count: number
  decision_quality: number
}

interface SummaryCardsProps {
  data: SummaryCardData | undefined
  isLoading: boolean
}

function MetricCardSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="mt-3 h-8 w-20" />
        <Skeleton className="mt-2 h-3 w-16" />
      </CardContent>
    </Card>
  )
}

interface MetricCardProps {
  label: string
  value: string
  icon: React.ReactNode
  subtitle?: string
  valueClassName?: string
}

function MetricCard({
  label,
  value,
  icon,
  subtitle,
  valueClassName = "text-foreground",
}: MetricCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            {icon}
          </div>
        </div>
        <p className={`mt-2 text-2xl font-semibold tracking-tight ${valueClassName}`}>
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <MetricCard
        label="Total Traces"
        value={formatNumber(data.total_traces)}
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        subtitle="Across all agents"
      />
      <MetricCard
        label="Success Rate"
        value={formatPercentage(data.success_rate)}
        icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        valueClassName={qualityColor(data.success_rate)}
        subtitle="Overall success"
      />
      <MetricCard
        label="Avg Quality Score"
        value={formatScore(data.quality_score)}
        icon={<Gauge className="h-4 w-4 text-muted-foreground" />}
        valueClassName={qualityColor(data.quality_score)}
        subtitle="Across operations"
      />
      <MetricCard
        label="Total Agents"
        value={data.agent_count.toString()}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        subtitle="Active agents"
      />
      <MetricCard
        label="Decision Quality"
        value={formatScore(data.decision_quality)}
        icon={<Brain className="h-4 w-4 text-muted-foreground" />}
        valueClassName={qualityColor(data.decision_quality)}
        subtitle="Avg decision quality"
      />
    </div>
  )
}
