// Agent Performance Metrics
export interface AgentMetrics {
  agent_name: string
  total_traces: number
  success_rate: number
  average_quality_score: number
  average_duration_ms: number
  average_decisions_per_trace: number
  average_decision_quality: number
  failed_traces: number
  error_types: Record<string, number>
  performance_trend: "stable" | "improving" | "degrading"
  quality_distribution: QualityDistribution
  recommendations: string[]
}

export interface QualityDistribution {
  excellent: number
  good: number
  acceptable: number
  needs_improvement: number
  poor: number
}

// Quality Metrics
export interface QualityMetrics {
  group_by: string
  time_window_hours: number
  total_traces: number
  groups: Record<string, QualityGroup>
  overall_metrics: {
    average: number
    median: number
    min: number
    max: number
    std_dev: number
  }
}

export interface QualityGroup {
  trace_count: number
  average_quality: number
  min_quality: number
  max_quality: number
  median_quality: number
  success_rate: number
  quality_distribution: QualityDistribution
}

// Decision Analytics
export interface DecisionAnalytics {
  time_window_hours: number
  total_decisions: number
  average_decisions_per_trace: number
  average_decision_quality: number
  average_context_length: number
  decision_type_analysis: Record<string, DecisionType>
  quality_distribution: QualityDistribution
  success_correlation: {
    successful_trace_decisions_avg_quality: number
    failed_trace_decisions_avg_quality: number
    quality_difference: number
  }
}

export interface DecisionType {
  count: number
  average_quality: number
  percentage: number
}

// Agent Insights
export interface AgentInsights {
  agent_name: string
  observation_count: number
  decision_count: number
  self_evaluation_count: number
  average_decision_quality: number
  average_quality_score: number
  behavior_patterns: string[]
  performance_trend: string
  confidence_distribution: {
    average: number
    min: number
    max: number
  }
  recommendations: string[]
  generated_at: string
  time_window_hours: number
}

// Agent Recommendations
export interface AgentRecommendations {
  agent_name: string
  recommendations: Recommendation[]
  insights_summary: string
  quality_score: number
  time_window_hours: number
}

export interface Recommendation {
  type: string
  priority: "high" | "medium" | "low"
  action: string
  reason: string
}

// Behavior Patterns
export interface BehaviorPatterns {
  agent_name: string
  time_window_hours: number
  total_traces_analyzed: number
  operation_sequences: Record<string, OperationSequence>
  error_patterns: Record<string, number>
  timing_patterns: Record<string, { count: number; avg_duration: number }>
  behavioral_consistency: Record<string, BehavioralConsistency>
  insights: string[]
}

export interface OperationSequence {
  total_operations: number
  success_rate: number
  common_sequences: Record<string, number>
  average_duration: number
}

export interface BehavioralConsistency {
  consistency_score: number
  unique_operations: number
  total_operations: number
  consistency_level: "high" | "medium" | "low"
}

// Summary
export interface ObservabilitySummary {
  summary: {
    time_window_hours: number
    generated_at: string
    agent_count: number
    total_traces: number
    overall_success_rate: number
    overall_quality: number
  }
  agent_performance: Record<string, AgentMetrics>
  quality_overview: QualityMetrics
  decision_insights: DecisionAnalytics
  key_insights: string[]
}

// Performance Trends
export interface PerformanceTrends {
  daily: Array<{
    date: string
    avg_quality: number
    success_rate: number
  }>
}

// Task Management
export type TaskType = "summarize" | "analyze" | "classify" | "extract" | "translate"

export interface TaskCreatePayload {
  task_type: TaskType
  input_data: Record<string, unknown>
  parameters: {
    max_length?: number
    target_language?: string
    categories?: string[]
    format?: string
  }
}

export interface Task {
  id: string
  task_type: TaskType
  status: "pending" | "running" | "completed" | "failed"
  input_data: Record<string, unknown>
  result?: Record<string, unknown>
  quality_score?: number
  created_at: string
  updated_at: string
  error?: string
}

export interface TaskTrace {
  id: string
  task_id: string
  agent_name: string
  operation: string
  status: "success" | "error"
  duration_ms: number
  quality_score: number
  created_at: string
  decisions: TaskDecision[]
  events: TaskEvent[]
  observations: TaskObservation[]
}

export interface TaskDecision {
  decision_type: string
  quality: number
  context_length: number
  rationale: string
}

export interface TaskEvent {
  event_type: string
  timestamp: string
  data: Record<string, unknown>
}

export interface TaskObservation {
  observation_type: string
  content: string
  confidence: number
}
