"use client"

import { useState, useCallback } from "react"
import { TaskCreateForm } from "./task-create-form"
import { TaskList } from "./task-list"
import { TaskDetail } from "./task-detail"
import { useRecentTasks } from "@/hooks/use-dashboard-data"

export function TasksPage() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const { data: tasks, isLoading, mutate } = useRecentTasks()

  const handleTaskCreated = useCallback(() => {
    mutate()
  }, [mutate])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TaskCreateForm onTaskCreated={handleTaskCreated} />
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          selectedTaskId={selectedTaskId}
          onSelectTask={setSelectedTaskId}
        />
      </div>

      {selectedTaskId && <TaskDetail taskId={selectedTaskId} />}
    </div>
  )
}
