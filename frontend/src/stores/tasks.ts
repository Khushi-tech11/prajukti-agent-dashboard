import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Task {
  id: string
  title: string
  description: string
  agentId: string
  agentName: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  duration?: number
  result?: string
  error?: string
}

export interface TaskMetrics {
  totalToday: number
  completedToday: number
  runningNow: number
  pendingQueue: number
  avgDuration: number
  successRate: number
  tasksByStatus: { status: string; count: number }[]
  tasksByAgent: { agent: string; count: number }[]
  taskTrend: { date: string; completed: number; failed: number }[]
  responseTimeDistribution: { range: string; count: number }[]
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([
    {
      id: '1',
      title: 'Market analysis for Q4',
      description: 'Comprehensive analysis of market trends and competitor activities',
      agentId: '1',
      agentName: 'Research Assistant',
      status: 'completed',
      priority: 'high',
      createdAt: new Date(Date.now() - 300000),
      startedAt: new Date(Date.now() - 280000),
      completedAt: new Date(Date.now() - 60000),
      duration: 220,
      result: 'Analysis complete with 15 key insights'
    },
    {
      id: '2',
      title: 'Blog post about AI trends',
      description: 'Write an engaging blog post about emerging AI trends in 2024',
      agentId: '2',
      agentName: 'Content Writer',
      status: 'running',
      priority: 'medium',
      createdAt: new Date(Date.now() - 720000),
      startedAt: new Date(Date.now() - 600000)
    },
    {
      id: '3',
      title: 'Sales report generation',
      description: 'Generate monthly sales report with visualizations',
      agentId: '3',
      agentName: 'Data Analyzer',
      status: 'completed',
      priority: 'high',
      createdAt: new Date(Date.now() - 3600000),
      startedAt: new Date(Date.now() - 3500000),
      completedAt: new Date(Date.now() - 3000000),
      duration: 500,
      result: 'Report generated with 8 charts'
    },
    {
      id: '4',
      title: 'Newsletter draft review',
      description: 'Review and optimize the weekly newsletter draft',
      agentId: '4',
      agentName: 'Email Assistant',
      status: 'pending',
      priority: 'low',
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      id: '5',
      title: 'Competitor analysis',
      description: 'Deep dive into competitor product features',
      agentId: '1',
      agentName: 'Research Assistant',
      status: 'completed',
      priority: 'medium',
      createdAt: new Date(Date.now() - 10800000),
      startedAt: new Date(Date.now() - 10700000),
      completedAt: new Date(Date.now() - 9000000),
      duration: 1700,
      result: 'Competitive analysis document ready'
    }
  ])

  const metrics = ref<TaskMetrics>({
    totalToday: 47,
    completedToday: 38,
    runningNow: 4,
    pendingQueue: 5,
    avgDuration: 180,
    successRate: 96.5,
    tasksByStatus: [
      { status: 'Completed', count: 847 },
      { status: 'Running', count: 4 },
      { status: 'Pending', count: 12 },
      { status: 'Failed', count: 23 }
    ],
    tasksByAgent: [
      { agent: 'Research Assistant', count: 234 },
      { agent: 'Content Writer', count: 189 },
      { agent: 'Data Analyzer', count: 156 },
      { agent: 'Email Assistant', count: 142 },
      { agent: 'Code Assistant', count: 98 }
    ],
    taskTrend: [
      { date: 'Mon', completed: 42, failed: 2 },
      { date: 'Tue', completed: 38, failed: 1 },
      { date: 'Wed', completed: 55, failed: 3 },
      { date: 'Thu', completed: 48, failed: 2 },
      { date: 'Fri', completed: 62, failed: 1 },
      { date: 'Sat', completed: 35, failed: 0 },
      { date: 'Sun', completed: 28, failed: 1 }
    ],
    responseTimeDistribution: [
      { range: '0-1s', count: 245 },
      { range: '1-2s', count: 312 },
      { range: '2-5s', count: 198 },
      { range: '5-10s', count: 87 },
      { range: '10s+', count: 44 }
    ]
  })

  const completedTasks = computed(() => tasks.value.filter(t => t.status === 'completed'))
  const runningTasks = computed(() => tasks.value.filter(t => t.status === 'running'))
  const pendingTasks = computed(() => tasks.value.filter(t => t.status === 'pending'))
  const failedTasks = computed(() => tasks.value.filter(t => t.status === 'failed'))

  function addTask(task: Omit<Task, 'id' | 'createdAt' | 'status'>) {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'pending'
    }
    tasks.value.unshift(newTask)
    return newTask
  }

  function updateTaskStatus(id: string, status: Task['status'], result?: string, error?: string) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.status = status
      if (status === 'running') {
        task.startedAt = new Date()
      } else if (status === 'completed' || status === 'failed') {
        task.completedAt = new Date()
        if (task.startedAt) {
          task.duration = Math.floor((task.completedAt.getTime() - task.startedAt.getTime()) / 1000)
        }
        if (result) task.result = result
        if (error) task.error = error
      }
    }
  }

  function getTaskById(id: string) {
    return tasks.value.find(t => t.id === id)
  }

  function getTasksByAgent(agentId: string) {
    return tasks.value.filter(t => t.agentId === agentId)
  }

  return {
    tasks,
    metrics,
    completedTasks,
    runningTasks,
    pendingTasks,
    failedTasks,
    addTask,
    updateTaskStatus,
    getTaskById,
    getTasksByAgent
  }
})
