"use client"

import { Zap } from "lucide-react"

interface KeyInsightsBannerProps {
  insights: string[]
}

export function KeyInsightsBanner({ insights }: KeyInsightsBannerProps) {
  if (!insights.length) return null

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Key Insights</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {insights.map((insight, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-md bg-secondary px-3 py-1.5 text-sm text-foreground"
          >
            {insight}
          </span>
        ))}
      </div>
    </div>
  )
}
