"use client"

import { Activity, RefreshCw } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  timeWindow: string
  onTimeWindowChange: (value: string) => void
  agent: string
  onAgentChange: (value: string) => void
  agentOptions: string[]
  onRefresh: () => void
  isRefreshing: boolean
}

const TIME_OPTIONS = [
  { value: "1h", label: "Last 1 hour" },
  { value: "6h", label: "Last 6 hours" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
]

export function DashboardHeader({
  timeWindow,
  onTimeWindowChange,
  agent,
  onAgentChange,
  agentOptions,
  onRefresh,
  isRefreshing,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            AI Agentic Observability
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor agent behavior, decisions, and performance
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Select value={agent} onValueChange={onAgentChange}>
          <SelectTrigger className="w-[200px] bg-card">
            <SelectValue placeholder="Select agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <span className="text-sm">All Agents</span>
            </SelectItem>
            {agentOptions.map((name) => (
              <SelectItem key={name} value={name}>
                <span className="font-mono text-sm">{name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={timeWindow} onValueChange={onTimeWindowChange}>
          <SelectTrigger className="w-[160px] bg-card">
            <SelectValue placeholder="Time window" />
          </SelectTrigger>
          <SelectContent>
            {TIME_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="bg-card"
          aria-label="Refresh data"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
    </header>
  )
}
