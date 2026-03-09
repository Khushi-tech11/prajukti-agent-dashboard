<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  Bot,
  Zap,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-vue-next'
import { Line, Bar, Doughnut, Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

import { useAnalyticsStore } from '@/stores/analytics'
import { useAgentsStore } from '@/stores/agents'
import { useTasksStore } from '@/stores/tasks'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

const analyticsStore = useAnalyticsStore()
const agentsStore = useAgentsStore()
const tasksStore = useTasksStore()

const { data: analytics } = storeToRefs(analyticsStore)
const { metrics: agentMetrics } = storeToRefs(agentsStore)
const { metrics: taskMetrics } = storeToRefs(tasksStore)

const selectedPeriod = ref<'daily' | 'weekly' | 'monthly'>('daily')

// Performance Overview Chart
const performanceChartData = computed(() => {
  const periodData = analytics.value.performance[selectedPeriod.value]
  return {
    labels: periodData.map(d => 'date' in d ? d.date.split('-').pop() : 'week' in d ? d.week : d.month),
    datasets: [
      {
        label: 'Total Tasks',
        data: periodData.map(d => d.tasks),
        borderColor: 'hsl(142, 76%, 36%)',
        backgroundColor: 'hsla(142, 76%, 36%, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Successful',
        data: periodData.map(d => d.success),
        borderColor: 'hsl(217, 91%, 60%)',
        backgroundColor: 'hsla(217, 91%, 60%, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

const performanceChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: 'hsl(0, 0%, 63.9%)', usePointStyle: true, padding: 20 }
    }
  },
  scales: {
    x: { grid: { color: 'hsla(240, 3.7%, 15.9%, 0.5)' }, ticks: { color: 'hsl(0, 0%, 63.9%)' } },
    y: { grid: { color: 'hsla(240, 3.7%, 15.9%, 0.5)' }, ticks: { color: 'hsl(0, 0%, 63.9%)' } }
  }
}

// Avg Response Time Chart
const responseTimeChartData = computed(() => {
  const periodData = analytics.value.performance[selectedPeriod.value]
  return {
    labels: periodData.map(d => 'date' in d ? d.date.split('-').pop() : 'week' in d ? d.week : d.month),
    datasets: [{
      label: 'Avg Response Time (s)',
      data: periodData.map(d => d.avgTime),
      borderColor: 'hsl(48, 96%, 53%)',
      backgroundColor: 'hsla(48, 96%, 53%, 0.2)',
      fill: true,
      tension: 0.4
    }]
  }
})

// Peak Hours Chart
const peakHoursChartData = computed(() => ({
  labels: analytics.value.usage.peakHours.map(h => `${h.hour}:00`),
  datasets: [{
    label: 'Tasks',
    data: analytics.value.usage.peakHours.map(h => h.count),
    backgroundColor: 'hsl(142, 76%, 36%)',
    borderRadius: 4
  }]
}))

const peakHoursChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: 'hsl(0, 0%, 63.9%)', maxRotation: 45 } },
    y: { grid: { color: 'hsla(240, 3.7%, 15.9%, 0.5)' }, ticks: { color: 'hsl(0, 0%, 63.9%)' } }
  }
}

// Tool Usage Chart
const toolUsageChartData = computed(() => ({
  labels: analytics.value.usage.toolUsage.map(t => t.tool),
  datasets: [{
    data: analytics.value.usage.toolUsage.map(t => t.count),
    backgroundColor: [
      'hsl(142, 76%, 36%)',
      'hsl(217, 91%, 60%)',
      'hsl(48, 96%, 53%)',
      'hsl(262, 83%, 58%)',
      'hsl(0, 84%, 60%)'
    ],
    borderWidth: 0
  }]
}))

const toolUsageChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'right' as const,
      labels: { color: 'hsl(0, 0%, 63.9%)', usePointStyle: true, padding: 12, font: { size: 11 } }
    }
  }
}

// Agent Performance Radar
const agentRadarChartData = computed(() => ({
  labels: ['Tasks', 'Success Rate', 'Avg Time', 'Efficiency', 'Reliability'],
  datasets: analytics.value.usage.agentPerformance.slice(0, 3).map((agent, i) => ({
    label: agent.agent,
    data: [
      agent.tasks / 10,
      agent.success / agent.tasks * 100,
      100 - agent.avgTime * 10,
      (agent.success / agent.tasks) * 100,
      90 + Math.random() * 10
    ],
    borderColor: ['hsl(142, 76%, 36%)', 'hsl(217, 91%, 60%)', 'hsl(48, 96%, 53%)'][i],
    backgroundColor: ['hsla(142, 76%, 36%, 0.2)', 'hsla(217, 91%, 60%, 0.2)', 'hsla(48, 96%, 53%, 0.2)'][i]
  }))
}))

const agentRadarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      grid: { color: 'hsla(240, 3.7%, 15.9%, 0.5)' },
      angleLines: { color: 'hsla(240, 3.7%, 15.9%, 0.5)' },
      pointLabels: { color: 'hsl(0, 0%, 63.9%)', font: { size: 11 } },
      ticks: { display: false }
    }
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { color: 'hsl(0, 0%, 63.9%)', usePointStyle: true, padding: 16 }
    }
  }
}

// Cost Trend Chart
const costChartData = computed(() => ({
  labels: analytics.value.costs.daily.map(d => d.date.split('-').pop()),
  datasets: [{
    label: 'Daily Cost ($)',
    data: analytics.value.costs.daily.map(d => d.cost),
    borderColor: 'hsl(262, 83%, 58%)',
    backgroundColor: 'hsla(262, 83%, 58%, 0.1)',
    fill: true,
    tension: 0.4
  }]
}))

// Cost by Agent Chart
const costByAgentChartData = computed(() => ({
  labels: analytics.value.costs.byAgent.map(a => a.agent),
  datasets: [{
    label: 'Cost ($)',
    data: analytics.value.costs.byAgent.map(a => a.cost),
    backgroundColor: [
      'hsl(142, 76%, 36%)',
      'hsl(217, 91%, 60%)',
      'hsl(48, 96%, 53%)',
      'hsl(262, 83%, 58%)',
      'hsl(0, 84%, 60%)'
    ],
    borderRadius: 6
  }]
}))

const costByAgentChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'hsla(240, 3.7%, 15.9%, 0.5)' }, ticks: { color: 'hsl(0, 0%, 63.9%)' } },
    y: { grid: { display: false }, ticks: { color: 'hsl(0, 0%, 63.9%)', font: { size: 11 } } }
  }
}

// KPI Cards
const kpis = computed(() => [
  {
    label: 'Total Tasks',
    value: analytics.value.overview.totalTasks.toLocaleString(),
    change: '+23%',
    trend: 'up',
    icon: Activity
  },
  {
    label: 'Success Rate',
    value: `${analytics.value.overview.avgSuccessRate}%`,
    change: '+2.4%',
    trend: 'up',
    icon: CheckCircle2
  },
  {
    label: 'Avg Response Time',
    value: `${analytics.value.overview.avgResponseTime}s`,
    change: '-0.3s',
    trend: 'down',
    icon: Clock
  },
  {
    label: 'Active Agents',
    value: analytics.value.overview.activeAgents.toString(),
    change: '+3',
    trend: 'up',
    icon: Bot
  },
  {
    label: 'Monthly Cost',
    value: `$${analytics.value.costs.totalMonth.toFixed(2)}`,
    change: '+12%',
    trend: 'up',
    icon: DollarSign
  },
  {
    label: 'Failed Tasks',
    value: (analytics.value.overview.totalTasks - analytics.value.overview.completedTasks).toString(),
    change: '-8%',
    trend: 'down',
    icon: XCircle
  }
])
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[hsl(var(--foreground))]">Analytics</h1>
        <p class="text-sm text-[hsl(var(--muted-foreground))]">Monitor performance metrics and usage patterns</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-for="period in ['daily', 'weekly', 'monthly'] as const"
          :key="period"
          @click="selectedPeriod = period"
          :class="[
            'rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors',
            selectedPeriod === period
              ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
              : 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]'
          ]"
        >
          {{ period }}
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <div
        v-for="kpi in kpis"
        :key="kpi.label"
        class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--primary)/0.15)]">
            <component :is="kpi.icon" class="h-4 w-4 text-[hsl(var(--primary))]" />
          </div>
          <div :class="[
            'flex items-center gap-1 text-xs font-medium',
            kpi.trend === 'up' && kpi.label !== 'Monthly Cost' && kpi.label !== 'Failed Tasks' ? 'text-[hsl(var(--success))]' : '',
            kpi.trend === 'down' && (kpi.label === 'Avg Response Time' || kpi.label === 'Failed Tasks') ? 'text-[hsl(var(--success))]' : '',
            kpi.trend === 'up' && (kpi.label === 'Monthly Cost' || kpi.label === 'Failed Tasks') ? 'text-[hsl(var(--warning))]' : '',
            kpi.trend === 'down' && kpi.label !== 'Avg Response Time' && kpi.label !== 'Failed Tasks' ? 'text-[hsl(var(--destructive))]' : ''
          ]">
            <TrendingUp v-if="kpi.trend === 'up'" class="h-3 w-3" />
            <TrendingDown v-else class="h-3 w-3" />
            {{ kpi.change }}
          </div>
        </div>
        <div class="mt-3">
          <p class="text-2xl font-bold text-[hsl(var(--foreground))]">{{ kpi.value }}</p>
          <p class="text-xs text-[hsl(var(--muted-foreground))]">{{ kpi.label }}</p>
        </div>
      </div>
    </div>

    <!-- Main Charts Row -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Performance Over Time -->
      <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="mb-4 flex items-center gap-2">
          <BarChart3 class="h-5 w-5 text-[hsl(var(--primary))]" />
          <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Performance Over Time</h2>
        </div>
        <div class="h-72">
          <Line :data="performanceChartData" :options="performanceChartOptions" />
        </div>
      </div>

      <!-- Response Time Trend -->
      <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="mb-4 flex items-center gap-2">
          <Clock class="h-5 w-5 text-[hsl(var(--warning))]" />
          <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Response Time Trend</h2>
        </div>
        <div class="h-72">
          <Line :data="responseTimeChartData" :options="performanceChartOptions" />
        </div>
      </div>
    </div>

    <!-- Usage Analytics Row -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Peak Hours -->
      <div class="lg:col-span-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="mb-4 flex items-center gap-2">
          <Calendar class="h-5 w-5 text-[hsl(var(--primary))]" />
          <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Peak Usage Hours</h2>
        </div>
        <div class="h-64">
          <Bar :data="peakHoursChartData" :options="peakHoursChartOptions" />
        </div>
      </div>

      <!-- Tool Usage -->
      <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="mb-4 flex items-center gap-2">
          <PieChart class="h-5 w-5 text-[hsl(var(--primary))]" />
          <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Tool Usage</h2>
        </div>
        <div class="h-64">
          <Doughnut :data="toolUsageChartData" :options="toolUsageChartOptions" />
        </div>
      </div>
    </div>

    <!-- Agent Performance & Cost Row -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Agent Performance Radar -->
      <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="mb-4 flex items-center gap-2">
          <Bot class="h-5 w-5 text-[hsl(var(--primary))]" />
          <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Agent Performance Comparison</h2>
        </div>
        <div class="h-72">
          <Radar :data="agentRadarChartData" :options="agentRadarChartOptions" />
        </div>
      </div>

      <!-- Cost by Agent -->
      <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="mb-4 flex items-center gap-2">
          <DollarSign class="h-5 w-5 text-[hsl(var(--primary))]" />
          <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Cost by Agent</h2>
        </div>
        <div class="h-72">
          <Bar :data="costByAgentChartData" :options="costByAgentChartOptions" />
        </div>
      </div>
    </div>

    <!-- Cost Trend -->
    <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <TrendingUp class="h-5 w-5 text-[hsl(var(--primary))]" />
          <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Daily Cost Trend</h2>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm text-[hsl(var(--muted-foreground))]">Total This Month</p>
            <p class="text-xl font-bold text-[hsl(var(--foreground))]">${{ analytics.costs.totalMonth.toFixed(2) }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-[hsl(var(--muted-foreground))]">Projected</p>
            <p class="text-xl font-bold text-[hsl(var(--warning))]">${{ analytics.costs.projection.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      <div class="h-64">
        <Line :data="costChartData" :options="performanceChartOptions" />
      </div>
    </div>

    <!-- Agent Performance Table -->
    <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div class="border-b border-[hsl(var(--border))] px-5 py-4">
        <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Agent Performance Details</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-[hsl(var(--border))] text-left text-sm text-[hsl(var(--muted-foreground))]">
              <th class="px-5 py-3 font-medium">Agent</th>
              <th class="px-5 py-3 font-medium">Total Tasks</th>
              <th class="px-5 py-3 font-medium">Successful</th>
              <th class="px-5 py-3 font-medium">Success Rate</th>
              <th class="px-5 py-3 font-medium">Avg Time</th>
              <th class="px-5 py-3 font-medium">Cost</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[hsl(var(--border))]">
            <tr
              v-for="(agent, index) in analytics.usage.agentPerformance"
              :key="agent.agent"
              class="text-sm transition-colors hover:bg-[hsl(var(--secondary)/0.5)]"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary)/0.15)]">
                    <Bot class="h-4 w-4 text-[hsl(var(--primary))]" />
                  </div>
                  <span class="font-medium text-[hsl(var(--foreground))]">{{ agent.agent }}</span>
                </div>
              </td>
              <td class="px-5 py-4 text-[hsl(var(--foreground))]">{{ agent.tasks }}</td>
              <td class="px-5 py-4 text-[hsl(var(--foreground))]">{{ agent.success }}</td>
              <td class="px-5 py-4">
                <span :class="[
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  (agent.success / agent.tasks) * 100 >= 95 
                    ? 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]' 
                    : 'bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]'
                ]">
                  {{ ((agent.success / agent.tasks) * 100).toFixed(1) }}%
                </span>
              </td>
              <td class="px-5 py-4 text-[hsl(var(--foreground))]">{{ agent.avgTime }}s</td>
              <td class="px-5 py-4 text-[hsl(var(--foreground))]">${{ analytics.costs.byAgent[index]?.cost.toFixed(2) || '0.00' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
