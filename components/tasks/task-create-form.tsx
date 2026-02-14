"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2 } from "lucide-react"
import type { TaskType, TaskCreatePayload } from "@/lib/types"
import { createTask } from "@/lib/api"

const TASK_TYPES: { value: TaskType; label: string; description: string }[] = [
  { value: "summarize", label: "Summarize", description: "Condense content into a summary" },
  { value: "analyze", label: "Analyze", description: "Analyze data or text for patterns" },
  { value: "classify", label: "Classify", description: "Categorize input into classes" },
  { value: "extract", label: "Extract", description: "Extract structured data from text" },
  { value: "translate", label: "Translate", description: "Translate content to another language" },
]

interface TaskCreateFormProps {
  onTaskCreated: () => void
}

export function TaskCreateForm({ onTaskCreated }: TaskCreateFormProps) {
  const [taskType, setTaskType] = useState<TaskType>("summarize")
  const [inputText, setInputText] = useState("")
  const [maxLength, setMaxLength] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("")
  const [categories, setCategories] = useState("")
  const [format, setFormat] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const payload: TaskCreatePayload = {
      task_type: taskType,
      input_data: { text: inputText },
      parameters: {},
    }
    if (maxLength) payload.parameters.max_length = Number(maxLength)
    if (targetLanguage) payload.parameters.target_language = targetLanguage
    if (categories) payload.parameters.categories = categories.split(",").map((c) => c.trim())
    if (format) payload.parameters.format = format

    try {
      const task = await createTask(payload)
      setLastCreatedId(task.id)
      setInputText("")
      onTaskCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Plus className="h-4 w-4" />
          Create New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-type" className="text-foreground">Task Type</Label>
            <Select value={taskType} onValueChange={(v) => setTaskType(v as TaskType)}>
              <SelectTrigger id="task-type" className="bg-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <div className="flex items-center gap-2">
                      <span>{t.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {"- "}{t.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="input-text" className="text-foreground">Input Text</Label>
            <Textarea
              id="input-text"
              placeholder="Enter the text to process..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[100px] bg-secondary"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(taskType === "summarize" || taskType === "extract") && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="max-length" className="text-foreground">Max Length</Label>
                <Input
                  id="max-length"
                  type="number"
                  placeholder="500"
                  value={maxLength}
                  onChange={(e) => setMaxLength(e.target.value)}
                  className="bg-secondary"
                />
              </div>
            )}
            {taskType === "translate" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="target-lang" className="text-foreground">Target Language</Label>
                <Input
                  id="target-lang"
                  placeholder="e.g., Spanish"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="bg-secondary"
                />
              </div>
            )}
            {taskType === "classify" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="categories" className="text-foreground">Categories</Label>
                <Input
                  id="categories"
                  placeholder="tech, science, art"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  className="bg-secondary"
                />
                <p className="text-xs text-muted-foreground">Comma-separated list</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="format" className="text-foreground">Output Format</Label>
              <Input
                id="format"
                placeholder="e.g., json, markdown"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="bg-secondary"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {lastCreatedId && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
              <span className="text-sm text-foreground">Task created:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {lastCreatedId}
              </Badge>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting || !inputText} className="self-end">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
