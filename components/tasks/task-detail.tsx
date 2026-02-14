"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  FileText,
  ChevronDown,
  Brain,
  Zap,
  Eye,
} from "lucide-react"
import type { Task, TaskTrace } from "@/lib/types"
import { useTask, useTaskTraces } from "@/hooks/use-dashboard-data"
import {
  formatScore,
  formatDuration,
  formatDecisionType,
  qualityColor,
} from "@/lib/formatters"

interface TaskDetailProps {
  taskId: string
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
    running: "bg-blue-400/15 text-blue-400 border-blue-400/30",
    completed: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
    failed: "bg-red-400/15 text-red-400 border-red-400/30",
    success: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
    error: "bg-red-400/15 text-red-400 border-red-400/30",
  }
  return (
    <Badge variant="outline" className={`capitalize ${styles[status] || ""}`}>
      {status}
    </Badge>
  )
}

function TaskOverview({ task }: { task: Task }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg bg-secondary p-3">
          <p className="text-xs text-muted-foreground">Type</p>
          <p className="text-sm font-medium text-foreground">
            {formatDecisionType(task.task_type)}
          </p>
        </div>
        <div className="rounded-lg bg-secondary p-3">
          <p className="text-xs text-muted-foreground">Status</p>
          <div className="mt-1">{statusBadge(task.status)}</div>
        </div>
        <div className="rounded-lg bg-secondary p-3">
          <p className="text-xs text-muted-foreground">Quality</p>
          <p
            className={`text-sm font-medium font-mono ${
              task.quality_score != null
                ? qualityColor(task.quality_score)
                : "text-muted-foreground"
            }`}
          >
            {task.quality_score != null ? formatScore(task.quality_score) : "--"}
          </p>
        </div>
        <div className="rounded-lg bg-secondary p-3">
          <p className="text-xs text-muted-foreground">Created</p>
          <p className="text-sm font-medium text-foreground">
            {new Date(task.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {task.input_data && (
        <div className="rounded-lg border border-border p-4">
          <h4 className="mb-2 text-sm font-medium text-foreground">Input Data</h4>
          <pre className="overflow-x-auto rounded-md bg-secondary p-3 text-xs text-foreground font-mono whitespace-pre-wrap">
            {JSON.stringify(task.input_data, null, 2)}
          </pre>
        </div>
      )}

      {task.result && (
        <div className="rounded-lg border border-border p-4">
          <h4 className="mb-2 text-sm font-medium text-foreground">Result</h4>
          <pre className="overflow-x-auto rounded-md bg-secondary p-3 text-xs text-foreground font-mono whitespace-pre-wrap">
            {JSON.stringify(task.result, null, 2)}
          </pre>
        </div>
      )}

      {task.error && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/5 p-4">
          <h4 className="mb-2 text-sm font-medium text-red-400">Error</h4>
          <p className="text-sm text-red-400">{task.error}</p>
        </div>
      )}
    </div>
  )
}

function TraceItem({ trace }: { trace: TaskTrace }) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-secondary p-4 text-left transition-colors hover:bg-secondary/80">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {trace?.id?.toString().slice(0, 8)}
          </span>
          <span className="text-sm font-medium text-foreground">
            {formatDecisionType(trace.operation)}
          </span>
          {statusBadge(trace.status)}
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-mono text-sm ${qualityColor(trace.quality_score)}`}>
            {formatScore(trace.quality_score)}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDuration(trace.duration_ms)}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform [[data-state=open]_&]:rotate-180" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 flex flex-col gap-3 pl-4">
        {trace.decisions.length > 0 && (
          <div className="rounded-lg border border-border p-3">
            <div className="mb-2 flex items-center gap-2">
              <Brain className="h-3.5 w-3.5 text-primary" />
              <h5 className="text-xs font-medium text-foreground">
                Decisions ({trace.decisions.length})
              </h5>
            </div>
            {trace.decisions.map((d, i) => (
              <div key={i} className="mb-2 rounded bg-secondary p-2 text-xs last:mb-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    {formatDecisionType(d.decision_type)}
                  </span>
                  <span className={`font-mono ${qualityColor(d.quality)}`}>
                    {formatScore(d.quality)}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground">{d.rationale}</p>
              </div>
            ))}
          </div>
        )}

        {trace.events.length > 0 && (
          <div className="rounded-lg border border-border p-3">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <h5 className="text-xs font-medium text-foreground">
                Events ({trace.events.length})
              </h5>
            </div>
            {trace.events.map((ev, i) => (
              <div key={i} className="mb-2 rounded bg-secondary p-2 text-xs last:mb-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    {formatDecisionType(ev.event_type)}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <pre className="mt-1 whitespace-pre-wrap text-muted-foreground font-mono">
                  {JSON.stringify(ev.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}

        {trace?.observations?.length > 0 && (
          <div className="rounded-lg border border-border p-3">
            <div className="mb-2 flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-primary" />
              <h5 className="text-xs font-medium text-foreground">
                Observations ({trace?.observations?.length})
              </h5>
            </div>
            {trace?.observations?.map((obs, i) => (
              <div key={i} className="mb-2 rounded bg-secondary p-2 text-xs last:mb-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    {formatDecisionType(obs?.observation_type)}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    conf: {obs?.confidence?.toFixed(2)}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground">{obs?.content}</p>
              </div>
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

function TracesView({ taskId }: { taskId: string }) {
  const { data: traces, isLoading } = useTaskTraces(taskId)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (!traces || traces.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">No execution traces available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {traces.map((trace) => (
        <TraceItem key={trace.id} trace={trace} />
      ))}
    </div>
  )
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const { data: task, isLoading } = useTask(taskId)

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!task) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">Task not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <FileText className="h-4 w-4" />
          Task Detail
          <Badge variant="outline" className="ml-2 font-mono text-xs">
            {task.id}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="bg-secondary">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traces">Execution Traces</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <TaskOverview task={task} />
          </TabsContent>
          <TabsContent value="traces" className="mt-4">
            <TracesView taskId={taskId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
