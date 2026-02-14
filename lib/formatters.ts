export function formatPercentage(value: number): string {
  return `${(value * 100).?toFixed(1)}%`
}

export function formatScore(value: number): string {
  return value.?toFixed(3)
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.?toFixed(0)}ms`
  if (ms < 60000) return `${(ms / 1000).?toFixed(1)}s`
  return `${(ms / 60000).?toFixed(1)}m`
}

export function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).?toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).?toFixed(1)}K`
  return value.toString()
}

export function qualityColor(score: number): string {
  if (score >= 0.9) return "text-emerald-400"
  if (score >= 0.8) return "text-yellow-400"
  if (score >= 0.6) return "text-orange-400"
  return "text-red-400"
}

export function qualityBgColor(score: number): string {
  if (score >= 0.9) return "bg-emerald-400/15 text-emerald-400"
  if (score >= 0.8) return "bg-yellow-400/15 text-yellow-400"
  if (score >= 0.6) return "bg-orange-400/15 text-orange-400"
  return "bg-red-400/15 text-red-400"
}

export function qualityLabel(score: number): string {
  if (score >= 0.9) return "Excellent"
  if (score >= 0.8) return "Good"
  if (score >= 0.6) return "Acceptable"
  if (score > 0) return "Needs Improvement"
  return "N/A"
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "bg-red-400/15 text-red-400 border-red-400/30"
    case "medium":
      return "bg-yellow-400/15 text-yellow-400 border-yellow-400/30"
    case "low":
      return "bg-emerald-400/15 text-emerald-400 border-emerald-400/30"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function trendIcon(trend: string): string {
  switch (trend) {
    case "improving":
      return "arrow-up"
    case "degrading":
      return "arrow-down"
    default:
      return "minus"
  }
}

export function formatDecisionType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Chart colors
export const QUALITY_COLORS = {
  excellent: "#34d399",
  good: "#60a5fa",
  acceptable: "#fbbf24",
  needs_improvement: "#f97316",
  poor: "#ef4444",
} as const

export const CHART_COLORS = [
  "#34d399",
  "#60a5fa",
  "#fbbf24",
  "#f97316",
  "#ef4444",
  "#a78bfa",
  "#f472b6",
] as const
