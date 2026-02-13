"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { List } from "lucide-react"
import type { Task } from "@/lib/types"
import { formatDecisionType, formatScore, qualityColor } from "@/lib/formatters"

interface TaskListProps {
  tasks: Task[] | undefined
  isLoading: boolean
  selectedTaskId: string | null
  onSelectTask: (taskId: string) => void
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
    running: "bg-blue-400/15 text-blue-400 border-blue-400/30",
    completed: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
    failed: "bg-red-400/15 text-red-400 border-red-400/30",
  }
  return (
    <Badge variant="outline" className={`capitalize ${styles[status] || ""}`}>
      {status}
    </Badge>
  )
}

export function TaskList({
  tasks,
  isLoading,
  selectedTaskId,
  onSelectTask,
}: TaskListProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <List className="h-4 w-4" />
          Recent Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !tasks || tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              No tasks found. Create one to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right text-muted-foreground">Quality</TableHead>
                  <TableHead className="text-right text-muted-foreground">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.task_id}
                    className={`cursor-pointer border-border transition-colors ${
                      selectedTaskId === task.task_id
                        ? "bg-primary/10"
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => onSelectTask(task.task_id)}
                  >
                    <TableCell className="font-mono text-xs text-foreground">
                      {task.task_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatDecisionType(task.task_type)}
                    </TableCell>
                    <TableCell>{statusBadge(task.status)}</TableCell>
                    <TableCell className="text-right">
                      {task.quality_score != null ? (
                        <span className={`font-mono ${qualityColor(task.quality_score)}`}>
                          {formatScore(task.quality_score)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {new Date(task.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
