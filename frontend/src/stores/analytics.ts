import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AnalyticsData {
  overview: {
    totalAgents: number
    activeAgents: number
    totalTasks: number
    completedTasks: number
    avgSuccessRate: number
    avgResponseTime: number
  }
  performance: {
    daily: { date: string; tasks: number; success: number; avgTime: number }[]
    weekly: { week: string; tasks: number; success: number; avgTime: number }[]
    monthly: { month: string; tasks: number; success: number; avgTime: number }[]
  }
  usage: {
    peakHours: { hour: number; count: number }[]
    toolUsage: { tool: string; count: number; percentage: number }[]
    agentPerformance: { agent: string; tasks: number; success: number; avgTime: number }[]
  }
  costs: {
    daily: { date: string; cost: number }[]
    byAgent: { agent: string; cost: number }[]
    totalMonth: number
    projection: number
  }
}

export const useAnalyticsStore = defineStore('analytics', () => {
  const data = ref<AnalyticsData>({
    overview: {
      totalAgents: 12,
      activeAgents: 8,
      totalTasks: 2847,
      completedTasks: 2734,
      avgSuccessRate: 96.0,
      avgResponseTime: 2.4
    },
    performance: {
      daily: [
        { date: '2024-03-01', tasks: 89, success: 87, avgTime: 2.3 },
        { date: '2024-03-02', tasks: 102, success: 98, avgTime: 2.1 },
        { date: '2024-03-03', tasks: 78, success: 75, avgTime: 2.5 },
        { date: '2024-03-04', tasks: 115, success: 112, avgTime: 2.2 },
        { date: '2024-03-05', tasks: 98, success: 95, avgTime: 2.4 },
        { date: '2024-03-06', tasks: 124, success: 120, avgTime: 2.0 },
        { date: '2024-03-07', tasks: 136, success: 132, avgTime: 1.9 },
        { date: '2024-03-08', tasks: 92, success: 89, avgTime: 2.6 },
        { date: '2024-03-09', tasks: 108, success: 104, avgTime: 2.3 }
      ],
      weekly: [
        { week: 'Week 1', tasks: 456, success: 442, avgTime: 2.4 },
        { week: 'Week 2', tasks: 512, success: 498, avgTime: 2.2 },
        { week: 'Week 3', tasks: 489, success: 478, avgTime: 2.3 },
        { week: 'Week 4', tasks: 534, success: 521, avgTime: 2.1 }
      ],
      monthly: [
        { month: 'Jan', tasks: 1823, success: 1756, avgTime: 2.6 },
        { month: 'Feb', tasks: 2012, success: 1948, avgTime: 2.4 },
        { month: 'Mar', tasks: 2847, success: 2734, avgTime: 2.2 }
      ]
    },
    usage: {
      peakHours: [
        { hour: 9, count: 245 }, { hour: 10, count: 312 }, { hour: 11, count: 378 },
        { hour: 12, count: 298 }, { hour: 13, count: 267 }, { hour: 14, count: 356 },
        { hour: 15, count: 334 }, { hour: 16, count: 289 }, { hour: 17, count: 198 }
      ],
      toolUsage: [
        { tool: 'Web Search', count: 892, percentage: 31.3 },
        { tool: 'Text Generator', count: 678, percentage: 23.8 },
        { tool: 'Document Reader', count: 534, percentage: 18.8 },
        { tool: 'Data Processor', count: 423, percentage: 14.9 },
        { tool: 'Email Composer', count: 320, percentage: 11.2 }
      ],
      agentPerformance: [
        { agent: 'Research Assistant', tasks: 634, success: 621, avgTime: 2.1 },
        { agent: 'Content Writer', tasks: 512, success: 492, avgTime: 3.2 },
        { agent: 'Data Analyzer', tasks: 489, success: 478, avgTime: 4.1 },
        { agent: 'Email Assistant', tasks: 456, success: 445, avgTime: 1.2 },
        { agent: 'Code Assistant', tasks: 398, success: 378, avgTime: 5.2 }
      ]
    },
    costs: {
      daily: [
        { date: '2024-03-01', cost: 12.45 },
        { date: '2024-03-02', cost: 15.23 },
        { date: '2024-03-03', cost: 10.87 },
        { date: '2024-03-04', cost: 18.92 },
        { date: '2024-03-05', cost: 14.56 },
        { date: '2024-03-06', cost: 19.34 },
        { date: '2024-03-07', cost: 21.12 },
        { date: '2024-03-08', cost: 13.78 },
        { date: '2024-03-09', cost: 16.45 }
      ],
      byAgent: [
        { agent: 'Research Assistant', cost: 45.67 },
        { agent: 'Content Writer', cost: 38.92 },
        { agent: 'Data Analyzer', cost: 32.45 },
        { agent: 'Email Assistant', cost: 15.23 },
        { agent: 'Code Assistant', cost: 28.45 }
      ],
      totalMonth: 142.72,
      projection: 485.50
    }
  })

  const successRateByDay = computed(() => {
    return data.value.performance.daily.map(d => ({
      date: d.date,
      rate: Math.round((d.success / d.tasks) * 100)
    }))
  })

  const totalCostThisMonth = computed(() => data.value.costs.totalMonth)
  const projectedCost = computed(() => data.value.costs.projection)

  return {
    data,
    successRateByDay,
    totalCostThisMonth,
    projectedCost
  }
})
