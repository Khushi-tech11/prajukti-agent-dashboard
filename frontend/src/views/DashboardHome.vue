<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { 
  Bot, 
  Activity, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  Play,
  Plus,
  DollarSign,
  Zap,
  X
} from 'lucide-vue-next'
import { Line, Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

import { useAgentsStore } from '@/stores/agents'
import { useTasksStore } from '@/stores/tasks'
import { useAnalyticsStore } from '@/stores/analytics'

// Modal states
const showActiveAgentsModal = ref(false)
const showRunningTasksModal = ref(false)
const showCompletedTodayModal = ref(false)
const showCreateAgentModal = ref(false)
const showRunTaskModal = ref(false)

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const router = useRouter()

// Use Pinia stores
const agentsStore = useAgentsStore()
const tasksStore = useTasksStore()
const analyticsStore = useAnalyticsStore()

const { activeAgents, totalAgents, averageSuccessRate } = storeToRefs(agentsStore)
const { tasks, metrics: taskMetrics, runningTasks, completedTasks } = storeToRefs(tasksStore)
const { data: analyticsData } = storeToRefs(analyticsStore)

// Computed stats from stores
const stats = computed(() => [
  { 
    label: 'Active Agents', 
    value: activeAgents.value.length.toString(), 
    icon: Bot, 
    change: `${totalAgents.value} total`, 
    color: 'primary',
    clickable: true,
    action: () => showActiveAgentsModal.value = true
  },
  { 
    label: 'Running Tasks', 
    value: taskMetrics.value.runningNow.toString(), 
    icon: Activity, 
    change: `${taskMetrics.value.pendingQueue} pending`, 
    color: 'warning',
    clickable: true,
    action: () => showRunningTasksModal.value = true
  },
  { 
    label: 'Completed Today', 
    value: taskMetrics.value.completedToday.toString(), 
    icon: CheckCircle2, 
    change: `${taskMetrics.value.successRate}% success rate`, 
    color: 'success',
    clickable: true,
    action: () => showCompletedTodayModal.value = true
  },
  { 
    label: 'Avg. Response Time', 
    value: `${analyticsData.value.overview.avgResponseTime}s`, 
    icon: Clock, 
    change: '-0.3s vs last week', 
    color: 'info',
    clickable: false,
    action: () => {}
  },
])

// Recent activity from tasks store
const recentActivity = computed(() => {
  return tasks.value.slice(0, 5).map(task => ({
    id: task.id,
    agent: task.agentName,
    task: task.title,
    status: task.status,
    time: getRelativeTime(task.createdAt)
  }))
})

// Top agents from agents store
const topAgents = computed(() => {
  return agentsStore.agents
    .sort((a, b) => b.tasksCompleted - a.tasksCompleted)
    .slice(0, 4)
    .map(agent => ({
      id: agent.id,
      name: agent.name,
      tasks: agent.tasksCompleted,
      successRate: agent.successRate
    }))
})

// Chart configurations
const taskTrendChartData = computed(() => ({
  labels: taskMetrics.value.taskTrend.map(t => t.date),
  datasets: [
    {
      label: 'Completed',
      data: taskMetrics.value.taskTrend.map(t => t.completed),
      borderColor: 'hsl(142, 76%, 36%)',
      backgroundColor: 'hsla(142, 76%, 36%, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6
    },
    {
      label: 'Failed',
      data: taskMetrics.value.taskTrend.map(t => t.failed),
      borderColor: 'hsl(0, 84%, 60%)',
      backgroundColor: 'hsla(0, 84%, 60%, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6
    }
  ]
}))

const taskTrendChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'hsl(0, 0%, 63.9%)',
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'hsl(240, 10%, 3.9%)',
      borderColor: 'hsl(240, 3.7%, 15.9%)',
      borderWidth: 1,
      titleColor: 'hsl(0, 0%, 98%)',
      bodyColor: 'hsl(0, 0%, 63.9%)',
      padding: 12
    }
  },
  scales: {
    x: {
      grid: { color: 'hsla(240, 3.7%, 15.9%, 0.5)' },
      ticks: { color: 'hsl(0, 0%, 63.9%)' }
    },
    y: {
      grid: { color: 'hsla(240, 3.7%, 15.9%, 0.5)' },
      ticks: { color: 'hsl(0, 0%, 63.9%)' }
    }
  }
}

const tasksByStatusChartData = computed(() => ({
  labels: taskMetrics.value.tasksByStatus.map(t => t.status),
  datasets: [{
    data: taskMetrics.value.tasksByStatus.map(t => t.count),
    backgroundColor: [
      'hsl(142, 76%, 36%)',
      'hsl(48, 96%, 53%)',
      'hsl(240, 3.7%, 25.9%)',
      'hsl(0, 84%, 60%)'
    ],
    borderWidth: 0,
    spacing: 4
  }]
}))

const tasksByStatusChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: 'hsl(0, 0%, 63.9%)',
        usePointStyle: true,
        padding: 16,
        font: { size: 12 }
      }
    }
  }
}

const tasksByAgentChartData = computed(() => ({
  labels: taskMetrics.value.tasksByAgent.map(t => t.agent),
  datasets: [{
    label: 'Tasks',
    data: taskMetrics.value.tasksByAgent.map(t => t.count),
    backgroundColor: 'hsl(142, 76%, 36%)',
    borderRadius: 6,
    barThickness: 24
  }]
}))

const tasksByAgentChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      grid: { color: 'hsla(240, 3.7%, 15.9%, 0.5)' },
      ticks: { color: 'hsl(0, 0%, 63.9%)' }
    },
    y: {
      grid: { display: false },
      ticks: { 
        color: 'hsl(0, 0%, 63.9%)',
        font: { size: 11 }
      }
    }
  }
}

const responseTimeChartData = computed(() => ({
  labels: taskMetrics.value.responseTimeDistribution.map(t => t.range),
  datasets: [{
    label: 'Tasks',
    data: taskMetrics.value.responseTimeDistribution.map(t => t.count),
    backgroundColor: [
      'hsl(142, 76%, 46%)',
      'hsl(142, 76%, 40%)',
      'hsl(48, 96%, 53%)',
      'hsl(25, 95%, 53%)',
      'hsl(0, 84%, 60%)'
    ],
    borderRadius: 6
  }]
}))

const responseTimeChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: 'hsl(0, 0%, 63.9%)' }
    },
    y: {
      grid: { color: 'hsla(240, 3.7%, 15.9%, 0.5)' },
      ticks: { color: 'hsl(0, 0%, 63.9%)' }
    }
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${Math.floor(hours / 24)} day${hours >= 48 ? 's' : ''} ago`
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-[hsl(var(--success))]'
    case 'running': return 'text-[hsl(var(--warning))]'
    case 'pending': return 'text-[hsl(var(--muted-foreground))]'
    case 'failed': return 'text-[hsl(var(--destructive))]'
    default: return 'text-[hsl(var(--foreground))]'
  }
}

const getStatusBg = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-[hsl(var(--success)/0.15)]'
    case 'running': return 'bg-[hsl(var(--warning)/0.15)]'
    case 'pending': return 'bg-[hsl(var(--muted)/0.5)]'
    case 'failed': return 'bg-[hsl(var(--destructive)/0.15)]'
    default: return 'bg-[hsl(var(--muted))]'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        @click="stat.clickable ? stat.action() : null"
        :class="[
          'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5',
          stat.clickable ? 'cursor-pointer hover:border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--card)/0.8)] transition-colors' : ''
        ]"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-[hsl(var(--muted-foreground))]">{{ stat.label }}</p>
            <p class="mt-1 text-3xl font-bold text-[hsl(var(--foreground))]">{{ stat.value }}</p>
          </div>
          <div :class="[
            'flex h-10 w-10 items-center justify-center rounded-lg',
            stat.color === 'primary' ? 'bg-[hsl(var(--primary)/0.15)]' : '',
            stat.color === 'warning' ? 'bg-[hsl(var(--warning)/0.15)]' : '',
            stat.color === 'success' ? 'bg-[hsl(var(--success)/0.15)]' : '',
            stat.color === 'info' ? 'bg-[hsl(var(--info)/0.15)]' : ''
          ]">
            <component 
              :is="stat.icon" 
              :class="[
                'h-5 w-5',
                stat.color === 'primary' ? 'text-[hsl(var(--primary))]' : '',
                stat.color === 'warning' ? 'text-[hsl(var(--warning))]' : '',
                stat.color === 'success' ? 'text-[hsl(var(--success))]' : '',
                stat.color === 'info' ? 'text-[hsl(var(--info))]' : ''
              ]"
            />
          </div>
        </div>
        <p class="mt-3 flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
          <TrendingUp class="h-3 w-3 text-[hsl(var(--success))]" />
          {{ stat.change }}
        </p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex flex-wrap gap-3">
      <button
        @click="showCreateAgentModal = true"
        class="flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[hsl(var(--primary)/0.9)] cursor-pointer"
      >
        <Plus class="h-4 w-4" />
        Create Agent
      </button>
      <button
        @click="showRunTaskModal = true"
        class="flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--secondary))] cursor-pointer"
      >
        <Play class="h-4 w-4" />
        Run Task
      </button>
    </div>

    <!-- Charts Row 1: Task Trend & Task Status -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Task Trend Chart -->
      <div class="lg:col-span-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Task Trend</h2>
            <p class="text-sm text-[hsl(var(--muted-foreground))]">Completed vs Failed tasks this week</p>
          </div>
          <div class="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <Zap class="h-4 w-4 text-[hsl(var(--primary))]" />
            {{ taskMetrics.successRate }}% success
          </div>
        </div>
        <div class="h-64">
          <Line :data="taskTrendChartData" :options="taskTrendChartOptions" />
        </div>
      </div>

      <!-- Task Status Doughnut -->
      <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Task Status</h2>
          <p class="text-sm text-[hsl(var(--muted-foreground))]">Distribution by status</p>
        </div>
        <div class="h-64 flex items-center justify-center">
          <Doughnut :data="tasksByStatusChartData" :options="tasksByStatusChartOptions" />
        </div>
      </div>
    </div>

    <!-- Charts Row 2: Tasks by Agent & Response Time -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Tasks by Agent -->
      <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Tasks by Agent</h2>
          <p class="text-sm text-[hsl(var(--muted-foreground))]">Total tasks completed per agent</p>
        </div>
        <div class="h-64">
          <Bar :data="tasksByAgentChartData" :options="tasksByAgentChartOptions" />
        </div>
      </div>

      <!-- Response Time Distribution -->
      <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Response Time Distribution</h2>
          <p class="text-sm text-[hsl(var(--muted-foreground))]">Number of tasks by response time</p>
        </div>
        <div class="h-64">
          <Bar :data="responseTimeChartData" :options="responseTimeChartOptions" />
        </div>
      </div>
    </div>

    <!-- Bottom Row: Activity & Top Agents -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Recent Activity -->
      <div class="lg:col-span-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div class="flex items-center justify-between border-b border-[hsl(var(--border))] px-5 py-4">
          <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Recent Activity</h2>
          <button 
            @click="router.push('/dashboard/activity')"
            class="flex items-center gap-1 text-sm text-[hsl(var(--primary))] hover:underline cursor-pointer"
          >
            View all
            <ArrowUpRight class="h-3 w-3" />
          </button>
        </div>
        <div class="divide-y divide-[hsl(var(--border))]">
          <div
            v-for="item in recentActivity"
            :key="item.id"
            class="flex items-center justify-between px-5 py-4 transition-colors hover:bg-[hsl(var(--secondary)/0.5)]"
          >
            <div class="flex items-center gap-4">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--primary)/0.15)]">
                <Bot class="h-5 w-5 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <p class="font-medium text-[hsl(var(--foreground))]">{{ item.agent }}</p>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">{{ item.task }}</p>
              </div>
            </div>
            <div class="text-right">
              <span 
                :class="[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                  getStatusBg(item.status),
                  getStatusColor(item.status)
                ]"
              >
                {{ item.status }}
              </span>
              <p class="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{{ item.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Agents -->
      <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div class="flex items-center justify-between border-b border-[hsl(var(--border))] px-5 py-4">
          <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Top Agents</h2>
          <button 
            @click="router.push('/dashboard/agents')"
            class="flex items-center gap-1 text-sm text-[hsl(var(--primary))] hover:underline cursor-pointer"
          >
            View all
            <ArrowUpRight class="h-3 w-3" />
          </button>
        </div>
        <div class="divide-y divide-[hsl(var(--border))]">
          <div
            v-for="agent in topAgents"
            :key="agent.id"
            class="flex items-center justify-between px-5 py-4 transition-colors hover:bg-[hsl(var(--secondary)/0.5)]"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--primary)/0.15)]">
                <Bot class="h-4 w-4 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <p class="font-medium text-[hsl(var(--foreground))]">{{ agent.name }}</p>
                <p class="text-xs text-[hsl(var(--muted-foreground))]">{{ agent.tasks }} tasks</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-sm font-medium text-[hsl(var(--success))]">{{ agent.successRate }}%</span>
              <p class="text-xs text-[hsl(var(--muted-foreground))]">success</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cost Overview Cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--primary)/0.15)]">
            <DollarSign class="h-5 w-5 text-[hsl(var(--primary))]" />
          </div>
          <div>
            <p class="text-sm text-[hsl(var(--muted-foreground))]">Cost This Month</p>
            <p class="text-xl font-bold text-[hsl(var(--foreground))]">${{ analyticsData.costs.totalMonth.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--warning)/0.15)]">
            <TrendingUp class="h-5 w-5 text-[hsl(var(--warning))]" />
          </div>
          <div>
            <p class="text-sm text-[hsl(var(--muted-foreground))]">Projected Cost</p>
            <p class="text-xl font-bold text-[hsl(var(--foreground))]">${{ analyticsData.costs.projection.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--success)/0.15)]">
            <CheckCircle2 class="h-5 w-5 text-[hsl(var(--success))]" />
          </div>
          <div>
            <p class="text-sm text-[hsl(var(--muted-foreground))]">Avg. Success Rate</p>
            <p class="text-xl font-bold text-[hsl(var(--foreground))]">{{ averageSuccessRate }}%</p>
          </div>
        </div>
      </div>
      <div class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--info)/0.15)]">
            <Activity class="h-5 w-5 text-[hsl(var(--info))]" />
          </div>
          <div>
            <p class="text-sm text-[hsl(var(--muted-foreground))]">Total Tasks</p>
            <p class="text-xl font-bold text-[hsl(var(--foreground))]">{{ analyticsData.overview.totalTasks.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Agents Modal -->
    <Teleport to="body">
      <div 
        v-if="showActiveAgentsModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showActiveAgentsModal = false"
      >
        <div class="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-[hsl(var(--primary)/0.15)]">
                <Bot class="h-5 w-5 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Active Agents</h2>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">{{ activeAgents.length }} agents currently active</p>
              </div>
            </div>
            <button
              @click="showActiveAgentsModal = false"
              class="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
            >
              <X class="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            </button>
          </div>
          <div class="divide-y divide-[hsl(var(--border))] max-h-96 overflow-y-auto">
            <div
              v-for="agent in activeAgents"
              :key="agent.id"
              class="px-6 py-4 hover:bg-[hsl(var(--secondary)/0.5)] transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--primary)/0.15)]">
                    <Bot class="h-5 w-5 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <p class="font-medium text-[hsl(var(--foreground))]">{{ agent.name }}</p>
                    <p class="text-sm text-[hsl(var(--muted-foreground))]">{{ agent.role }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-[hsl(var(--success))]">{{ agent.successRate }}%</p>
                  <p class="text-xs text-[hsl(var(--muted-foreground))]">{{ agent.tasksCompleted }} tasks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Running Tasks Modal -->
    <Teleport to="body">
      <div 
        v-if="showRunningTasksModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showRunningTasksModal = false"
      >
        <div class="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-[hsl(var(--warning)/0.15)]">
                <Activity class="h-5 w-5 text-[hsl(var(--warning))]" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Running Tasks</h2>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">{{ runningTasks.length }} tasks currently running</p>
              </div>
            </div>
            <button
              @click="showRunningTasksModal = false"
              class="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
            >
              <X class="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            </button>
          </div>
          <div class="divide-y divide-[hsl(var(--border))] max-h-96 overflow-y-auto">
            <div
              v-for="task in runningTasks"
              :key="task.id"
              class="px-6 py-4 hover:bg-[hsl(var(--secondary)/0.5)] transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--warning)/0.15)]">
                    <Activity class="h-5 w-5 text-[hsl(var(--warning))]" />
                  </div>
                  <div>
                    <p class="font-medium text-[hsl(var(--foreground))]">{{ task.title }}</p>
                    <p class="text-sm text-[hsl(var(--muted-foreground))]">Agent: {{ task.agentName }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-[hsl(var(--warning))] animate-pulse"></div>
                  <span class="text-xs font-medium text-[hsl(var(--warning))]">Running</span>
                </div>
              </div>
            </div>
            <div v-if="runningTasks.length === 0" class="px-6 py-8 text-center">
              <p class="text-[hsl(var(--muted-foreground))]">No tasks currently running</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Completed Today Modal -->
    <Teleport to="body">
      <div 
        v-if="showCompletedTodayModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showCompletedTodayModal = false"
      >
        <div class="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-[hsl(var(--success)/0.15)]">
                <CheckCircle2 class="h-5 w-5 text-[hsl(var(--success))]" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Completed Today</h2>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">{{ completedTasks.length }} tasks completed</p>
              </div>
            </div>
            <button
              @click="showCompletedTodayModal = false"
              class="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
            >
              <X class="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            </button>
          </div>
          <div class="divide-y divide-[hsl(var(--border))] max-h-96 overflow-y-auto">
            <div
              v-for="task in completedTasks"
              :key="task.id"
              class="px-6 py-4 hover:bg-[hsl(var(--secondary)/0.5)] transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--success)/0.15)]">
                    <CheckCircle2 class="h-5 w-5 text-[hsl(var(--success))]" />
                  </div>
                  <div>
                    <p class="font-medium text-[hsl(var(--foreground))]">{{ task.title }}</p>
                    <p class="text-sm text-[hsl(var(--muted-foreground))]">{{ task.result || 'Completed successfully' }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]">
                    Completed
                  </span>
                  <p class="text-xs text-[hsl(var(--muted-foreground))] mt-1">{{ task.duration }}s</p>
                </div>
              </div>
            </div>
            <div v-if="completedTasks.length === 0" class="px-6 py-8 text-center">
              <p class="text-[hsl(var(--muted-foreground))]">No tasks completed today yet</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Create Agent Modal -->
    <Teleport to="body">
      <div 
        v-if="showCreateAgentModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showCreateAgentModal = false"
      >
        <div class="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-lg shadow-xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
            <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Create New Agent</h2>
            <button @click="showCreateAgentModal = false" class="p-1 hover:bg-[hsl(var(--secondary))] rounded-lg">
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="text-sm font-medium text-[hsl(var(--foreground))]">Agent Name</label>
              <input type="text" placeholder="e.g., Research Assistant" class="mt-1 w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-[hsl(var(--foreground))]">Role</label>
                <select class="mt-1 w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
                  <option>Researcher</option>
                  <option>Writer</option>
                  <option>Analyst</option>
                </select>
              </div>
              <div>
                <label class="text-sm font-medium text-[hsl(var(--foreground))]">Personality</label>
                <select class="mt-1 w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
                  <option>Professional</option>
                  <option>Creative</option>
                  <option>Analytical</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex gap-3 px-6 py-4 border-t border-[hsl(var(--border))]">
            <button @click="showCreateAgentModal = false" class="flex-1 px-4 py-2 border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] cursor-pointer">
              Cancel
            </button>
            <button @click="showCreateAgentModal = false" class="flex-1 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg hover:opacity-90 cursor-pointer">
              Create Agent
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Run Task Modal -->
    <Teleport to="body">
      <div 
        v-if="showRunTaskModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showRunTaskModal = false"
      >
        <div class="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-lg shadow-xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
            <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Run Task Simulation</h2>
            <button @click="showRunTaskModal = false" class="p-1 hover:bg-[hsl(var(--secondary))] rounded-lg">
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="text-sm font-medium text-[hsl(var(--foreground))]">Task Description</label>
              <textarea placeholder="Describe your task..." rows="4" class="mt-1 w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"></textarea>
            </div>
            <div>
              <label class="text-sm font-medium text-[hsl(var(--foreground))]">Select Agent/Pipeline</label>
              <select class="mt-1 w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
                <option>Research Assistant</option>
                <option>Content Writer</option>
                <option>Data Analyzer</option>
              </select>
            </div>
            <div class="p-4 rounded-lg bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] text-sm">
              <p class="font-medium">Simulation Mode</p>
              <p class="text-xs mt-1">This will run a simulated task execution to test your agents</p>
            </div>
          </div>
          <div class="flex gap-3 px-6 py-4 border-t border-[hsl(var(--border))]">
            <button @click="showRunTaskModal = false" class="flex-1 px-4 py-2 border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] cursor-pointer">
              Cancel
            </button>
            <button @click="showRunTaskModal = false" class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2 cursor-pointer">
              <Play class="h-4 w-4" />
              Simulate Task
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
