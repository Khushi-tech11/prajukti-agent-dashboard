import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Agent {
  id: string
  name: string
  role: string
  description: string
  personality: string
  tools: string[]
  status: 'active' | 'inactive' | 'paused'
  tasksCompleted: number
  successRate: number
  avgResponseTime: number
  createdAt: Date
  lastActive: Date
}

export interface AgentMetrics {
  totalTasks: number
  successfulTasks: number
  failedTasks: number
  avgResponseTime: number
  dailyTasks: { date: string; count: number }[]
  hourlyActivity: { hour: number; count: number }[]
}

export const useAgentsStore = defineStore('agents', () => {
  const agents = ref<Agent[]>([
    {
      id: '1',
      name: 'Research Assistant',
      role: 'researcher',
      description: 'Conducts comprehensive research and analysis',
      personality: 'Thorough and analytical',
      tools: ['web-search', 'document-reader', 'summarizer'],
      status: 'active',
      tasksCompleted: 234,
      successRate: 98,
      avgResponseTime: 1.2,
      createdAt: new Date('2024-01-15'),
      lastActive: new Date()
    },
    {
      id: '2',
      name: 'Content Writer',
      role: 'writer',
      description: 'Creates engaging content and copy',
      personality: 'Creative and engaging',
      tools: ['text-generator', 'grammar-checker', 'seo-optimizer'],
      status: 'active',
      tasksCompleted: 189,
      successRate: 95,
      avgResponseTime: 2.1,
      createdAt: new Date('2024-02-20'),
      lastActive: new Date()
    },
    {
      id: '3',
      name: 'Data Analyzer',
      role: 'analyst',
      description: 'Processes and analyzes complex datasets',
      personality: 'Precise and methodical',
      tools: ['data-processor', 'chart-generator', 'calculator'],
      status: 'active',
      tasksCompleted: 156,
      successRate: 97,
      avgResponseTime: 3.5,
      createdAt: new Date('2024-03-10'),
      lastActive: new Date()
    },
    {
      id: '4',
      name: 'Email Assistant',
      role: 'communicator',
      description: 'Drafts and manages email communications',
      personality: 'Professional and concise',
      tools: ['email-composer', 'calendar-access', 'contact-manager'],
      status: 'active',
      tasksCompleted: 142,
      successRate: 94,
      avgResponseTime: 0.8,
      createdAt: new Date('2024-04-05'),
      lastActive: new Date()
    },
    {
      id: '5',
      name: 'Code Assistant',
      role: 'developer',
      description: 'Helps with code generation and debugging',
      personality: 'Technical and detail-oriented',
      tools: ['code-generator', 'debugger', 'documentation'],
      status: 'paused',
      tasksCompleted: 98,
      successRate: 92,
      avgResponseTime: 4.2,
      createdAt: new Date('2024-05-15'),
      lastActive: new Date(Date.now() - 86400000)
    }
  ])

  const metrics = ref<AgentMetrics>({
    totalTasks: 819,
    successfulTasks: 789,
    failedTasks: 30,
    avgResponseTime: 2.36,
    dailyTasks: [
      { date: '2024-03-01', count: 45 },
      { date: '2024-03-02', count: 52 },
      { date: '2024-03-03', count: 38 },
      { date: '2024-03-04', count: 61 },
      { date: '2024-03-05', count: 55 },
      { date: '2024-03-06', count: 67 },
      { date: '2024-03-07', count: 72 },
      { date: '2024-03-08', count: 48 },
      { date: '2024-03-09', count: 59 }
    ],
    hourlyActivity: [
      { hour: 0, count: 12 }, { hour: 1, count: 8 }, { hour: 2, count: 5 },
      { hour: 3, count: 3 }, { hour: 4, count: 4 }, { hour: 5, count: 7 },
      { hour: 6, count: 15 }, { hour: 7, count: 28 }, { hour: 8, count: 45 },
      { hour: 9, count: 62 }, { hour: 10, count: 78 }, { hour: 11, count: 85 },
      { hour: 12, count: 72 }, { hour: 13, count: 68 }, { hour: 14, count: 82 },
      { hour: 15, count: 76 }, { hour: 16, count: 65 }, { hour: 17, count: 52 },
      { hour: 18, count: 38 }, { hour: 19, count: 32 }, { hour: 20, count: 28 },
      { hour: 21, count: 22 }, { hour: 22, count: 18 }, { hour: 23, count: 14 }
    ]
  })

  const activeAgents = computed(() => agents.value.filter(a => a.status === 'active'))
  const totalAgents = computed(() => agents.value.length)
  const averageSuccessRate = computed(() => {
    const total = agents.value.reduce((sum, a) => sum + a.successRate, 0)
    return Math.round(total / agents.value.length)
  })

  function addAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'lastActive' | 'tasksCompleted' | 'successRate' | 'avgResponseTime'>) {
    const newAgent: Agent = {
      ...agent,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastActive: new Date(),
      tasksCompleted: 0,
      successRate: 100,
      avgResponseTime: 0
    }
    agents.value.push(newAgent)
    return newAgent
  }

  function updateAgent(id: string, updates: Partial<Agent>) {
    const index = agents.value.findIndex(a => a.id === id)
    if (index !== -1) {
      agents.value[index] = { ...agents.value[index], ...updates }
    }
  }

  function deleteAgent(id: string) {
    const index = agents.value.findIndex(a => a.id === id)
    if (index !== -1) {
      agents.value.splice(index, 1)
    }
  }

  function getAgentById(id: string) {
    return agents.value.find(a => a.id === id)
  }

  return {
    agents,
    metrics,
    activeAgents,
    totalAgents,
    averageSuccessRate,
    addAgent,
    updateAgent,
    deleteAgent,
    getAgentById
  }
})
