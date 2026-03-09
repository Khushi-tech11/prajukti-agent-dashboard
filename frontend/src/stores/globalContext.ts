import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface GlobalContextState {
  activeAgentsCount: number
  runningTasksCount: number
  activePipelinesCount: number
  lastSync: Date | null
  connectionStatus: 'connected' | 'disconnected' | 'syncing'
}

export interface RecentActivity {
  id: string
  type: 'agent_created' | 'agent_updated' | 'pipeline_created' | 'task_completed' | 'task_failed'
  entityName: string
  timestamp: Date
}

export const useGlobalContextStore = defineStore('globalContext', () => {
  const state = ref<GlobalContextState>({
    activeAgentsCount: 0,
    runningTasksCount: 0,
    activePipelinesCount: 0,
    lastSync: null,
    connectionStatus: 'connected'
  })
  
  const recentActivities = ref<RecentActivity[]>([])
  
  const contextSummary = computed(() => ({
    agents: state.value.activeAgentsCount,
    tasks: state.value.runningTasksCount,
    pipelines: state.value.activePipelinesCount,
    status: state.value.connectionStatus
  }))
  
  function updateAgentsCount(count: number) {
    state.value.activeAgentsCount = count
    state.value.lastSync = new Date()
  }
  
  function updateRunningTasksCount(count: number) {
    state.value.runningTasksCount = count
    state.value.lastSync = new Date()
  }
  
  function updatePipelinesCount(count: number) {
    state.value.activePipelinesCount = count
    state.value.lastSync = new Date()
  }
  
  function addActivity(activity: Omit<RecentActivity, 'id' | 'timestamp'>) {
    const newActivity: RecentActivity = {
      ...activity,
      id: `activity_${Date.now()}`,
      timestamp: new Date()
    }
    recentActivities.value.unshift(newActivity)
    
    // Keep only last 50 activities
    if (recentActivities.value.length > 50) {
      recentActivities.value = recentActivities.value.slice(0, 50)
    }
  }
  
  function setConnectionStatus(status: GlobalContextState['connectionStatus']) {
    state.value.connectionStatus = status
  }
  
  function syncAll() {
    state.value.connectionStatus = 'syncing'
    // Simulate sync
    setTimeout(() => {
      state.value.connectionStatus = 'connected'
      state.value.lastSync = new Date()
    }, 1000)
  }
  
  return {
    state,
    recentActivities,
    contextSummary,
    updateAgentsCount,
    updateRunningTasksCount,
    updatePipelinesCount,
    addActivity,
    setConnectionStatus,
    syncAll
  }
})
