import type {
  AgentMetrics,
  QualityMetrics,
  DecisionAnalytics,
  AgentInsights,
  AgentRecommendations,
  BehaviorPatterns,
  ObservabilitySummary,
  PerformanceTrends,
} from "./types"

export const mockAgentMetrics: AgentMetrics = {
  agent_name: "decision_engine",
  total_traces: 68,
  success_rate: 0.9559,
  average_quality_score: 0.7509,
  average_duration_ms: 38842,
  average_decisions_per_trace: 0.25,
  average_decision_quality: 0.951,
  failed_traces: 3,
  error_types: {
    AppException: 1,
    AttributeError: 1,
    step_failed: 1,
  },
  performance_trend: "stable",
  quality_distribution: {
    excellent: 7,
    good: 25,
    acceptable: 22,
    needs_improvement: 14,
    poor: 0,
  },
  recommendations: [],
}

export const mockQualityMetrics: QualityMetrics = {
  group_by: "operation",
  time_window_hours: 24,
  total_traces: 68,
  groups: {
    task_execution: {
      trace_count: 13,
      average_quality: 0.704,
      min_quality: 0.704,
      max_quality: 0.704,
      median_quality: 0.704,
      success_rate: 1.0,
      quality_distribution: {
        excellent: 0,
        good: 5,
        acceptable: 6,
        needs_improvement: 2,
        poor: 0,
      },
    },
    llm_call: {
      trace_count: 15,
      average_quality: 0.564,
      min_quality: 0.42,
      max_quality: 0.71,
      median_quality: 0.564,
      success_rate: 0.933,
      quality_distribution: {
        excellent: 0,
        good: 3,
        acceptable: 7,
        needs_improvement: 5,
        poor: 0,
      },
    },
    agent_learning: {
      trace_count: 20,
      average_quality: 0.82,
      min_quality: 0.65,
      max_quality: 0.95,
      median_quality: 0.82,
      success_rate: 0.95,
      quality_distribution: {
        excellent: 4,
        good: 10,
        acceptable: 5,
        needs_improvement: 1,
        poor: 0,
      },
    },
    step_input_validation: {
      trace_count: 10,
      average_quality: 0.68,
      min_quality: 0.55,
      max_quality: 0.82,
      median_quality: 0.68,
      success_rate: 1.0,
      quality_distribution: {
        excellent: 1,
        good: 3,
        acceptable: 4,
        needs_improvement: 2,
        poor: 0,
      },
    },
    error_handling: {
      trace_count: 10,
      average_quality: 0.59,
      min_quality: 0.4,
      max_quality: 0.78,
      median_quality: 0.59,
      success_rate: 0.8,
      quality_distribution: {
        excellent: 0,
        good: 2,
        acceptable: 4,
        needs_improvement: 3,
        poor: 1,
      },
    },
  },
  overall_metrics: {
    average: 0.634,
    median: 0.634,
    min: 0.564,
    max: 0.704,
    std_dev: 0.099,
  },
}

export const mockDecisionAnalytics: DecisionAnalytics = {
  time_window_hours: 24,
  total_decisions: 17,
  average_decisions_per_trace: 0.25,
  average_decision_quality: 0.951,
  average_context_length: 147,
  decision_type_analysis: {
    execution_plan_selected: {
      count: 14,
      average_quality: 0.967,
      percentage: 0.8235,
    },
    condition_evaluated: {
      count: 1,
      average_quality: 0.967,
      percentage: 0.0588,
    },
    agent_decision_with_rationale: {
      count: 2,
      average_quality: 0.833,
      percentage: 0.1176,
    },
  },
  quality_distribution: {
    excellent: 15,
    good: 2,
    acceptable: 0,
    needs_improvement: 0,
    poor: 0,
  },
  success_correlation: {
    successful_trace_decisions_avg_quality: 0.951,
    failed_trace_decisions_avg_quality: 0.0,
    quality_difference: 0.951,
  },
}

export const mockAgentInsights: AgentInsights = {
  agent_name: "decision_engine",
  observation_count: 2,
  decision_count: 8,
  self_evaluation_count: 0,
  average_decision_quality: 0.8119,
  average_quality_score: 0.73,
  behavior_patterns: [],
  performance_trend: "stable",
  confidence_distribution: {
    average: 0.0,
    min: 0.0,
    max: 0.0,
  },
  recommendations: [],
  generated_at: "2026-02-13T18:27:49.790Z",
  time_window_hours: 24,
}

export const mockRecommendations: AgentRecommendations = {
  agent_name: "decision_engine",
  recommendations: [
    {
      type: "quality",
      priority: "high",
      action: "Implement additional quality checks",
      reason: "Quality score (0.75) below threshold",
    },
    {
      type: "efficiency",
      priority: "medium",
      action: "Optimize slow operations",
      reason: "Average duration (38842ms) is high",
    },
    {
      type: "reliability",
      priority: "medium",
      action: "Add retry logic for flaky operations",
      reason: "3 failed traces detected in the last 24 hours",
    },
    {
      type: "monitoring",
      priority: "low",
      action: "Set up alerting for quality degradation",
      reason: "14 traces need improvement",
    },
  ],
  insights_summary: "stable",
  quality_score: 0.75,
  time_window_hours: 24,
}

export const mockBehaviorPatterns: BehaviorPatterns = {
  agent_name: "decision_engine",
  time_window_hours: 24,
  total_traces_analyzed: 68,
  operation_sequences: {
    decision_engine: {
      total_operations: 68,
      success_rate: 0.9559,
      common_sequences: {
        "agent_learning -> task_execution": 10,
        "task_execution -> llm_call": 7,
        "step_input_validation -> llm_call": 3,
        "llm_call -> error_handling": 2,
        "error_handling -> agent_learning": 2,
      },
      average_duration: 38842,
    },
  },
  error_patterns: {
    AppException: 1,
    AttributeError: 1,
    step_failed: 1,
  },
  timing_patterns: {
    "15": { count: 26, avg_duration: 40538 },
    "11": { count: 20, avg_duration: 48550 },
    "08": { count: 12, avg_duration: 32100 },
    "20": { count: 10, avg_duration: 29800 },
  },
  behavioral_consistency: {
    decision_engine: {
      consistency_score: 0.235,
      unique_operations: 16,
      total_operations: 68,
      consistency_level: "high",
    },
  },
  insights: [
    "Most common error: AttributeError",
    "Agent decision_engine shows high behavioral consistency (predictable)",
    "Peak activity observed at 15:00 with 26 operations",
    "Average response time is 38.8 seconds",
  ],
}

export const mockSummary: ObservabilitySummary = {
  summary: {
    time_window_hours: 24,
    generated_at: "2026-02-13T18:30:00Z",
    agent_count: 1,
    total_traces: 68,
    overall_success_rate: 0.9559,
    overall_quality: 0.634,
  },
  agent_performance: {
    decision_engine: mockAgentMetrics,
  },
  quality_overview: mockQualityMetrics,
  decision_insights: mockDecisionAnalytics,
  key_insights: [
    "High overall success rate (95.6%) - system is performing well",
    "Decision quality is excellent at 95.1%",
    "Average quality score (0.75) has room for improvement",
    "3 failed traces need investigation",
  ],
}

export const mockPerformanceTrends: PerformanceTrends = {
  daily: [
    { date: "2026-02-07", avg_quality: 0.72, success_rate: 0.94 },
    { date: "2026-02-08", avg_quality: 0.68, success_rate: 0.91 },
    { date: "2026-02-09", avg_quality: 0.74, success_rate: 0.96 },
    { date: "2026-02-10", avg_quality: 0.71, success_rate: 0.93 },
    { date: "2026-02-11", avg_quality: 0.76, success_rate: 0.95 },
    { date: "2026-02-12", avg_quality: 0.73, success_rate: 0.94 },
    { date: "2026-02-13", avg_quality: 0.75, success_rate: 0.96 },
  ],
}
