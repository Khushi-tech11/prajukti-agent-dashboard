<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-border">
      <div>
        <h1 class="text-xl font-semibold text-foreground">Trace View</h1>
        <p class="text-sm text-muted-foreground">Deep-dive execution analysis</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="isLiveUpdating = !isLiveUpdating"
          :class="[
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            isLiveUpdating
              ? 'bg-emerald-500/20 text-emerald-500'
              : 'bg-secondary text-muted-foreground'
          ]"
        >
          <RefreshCw :class="['w-4 h-4', isLiveUpdating && 'animate-spin']" />
          {{ isLiveUpdating ? 'Live' : 'Paused' }}
        </button>
      </div>
    </div>
    
    <!-- Split Pane View -->
    <div class="flex-1 flex min-h-0">
      <!-- Left: Execution List -->
      <div class="w-80 border-r border-border flex flex-col">
        <!-- Search & Filter -->
        <div class="p-4 border-b border-border space-y-3">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search executions..."
              class="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <div class="flex gap-1">
            <button
              v-for="status in ['all', 'running', 'completed', 'failed']"
              :key="status"
              @click="filterStatus = status"
              :class="[
                'px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors',
                filterStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              ]"
            >
              {{ status }}
            </button>
          </div>
        </div>
        
        <!-- Execution List -->
        <div class="flex-1 overflow-y-auto p-2 space-y-1">
          <button
            v-for="exec in filteredExecutions"
            :key="exec.id"
            @click="selectedExecution = exec"
            :class="[
              'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors',
              selectedExecution?.id === exec.id
                ? 'bg-primary/10 border border-primary/30'
                : 'hover:bg-secondary border border-transparent'
            ]"
          >
            <div :class="['p-2 rounded-lg', getStatusBg(exec.status)]">
              <component :is="getStatusIcon(exec.status)" :class="['w-4 h-4', getStatusColor(exec.status)]" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{{ exec.name }}</p>
              <p class="text-xs text-muted-foreground mt-0.5">{{ exec.pipeline }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-[10px] font-mono text-muted-foreground">{{ exec.id.slice(0, 12) }}</span>
                <span class="text-[10px] text-muted-foreground">{{ exec.startTime }}</span>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <!-- Right: Trace Details -->
      <div class="flex-1 flex flex-col min-w-0">
        <template v-if="selectedExecution">
          <!-- Execution Header -->
          <div class="px-6 py-4 border-b border-border">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-3">
                  <h2 class="text-lg font-semibold text-foreground">{{ selectedExecution.name }}</h2>
                  <span :class="[
                    'px-2 py-0.5 text-xs font-medium rounded-full',
                    getStatusBg(selectedExecution.status),
                    getStatusColor(selectedExecution.status)
                  ]">
                    {{ selectedExecution.status.toUpperCase() }}
                  </span>
                </div>
                <p class="text-sm text-muted-foreground mt-1">{{ selectedExecution.pipeline }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-mono text-muted-foreground">{{ selectedExecution.id }}</p>
                <p class="text-xs text-muted-foreground mt-1">
                  Duration: <span class="font-mono">{{ selectedExecution.duration }}</span>
                </p>
              </div>
            </div>
            
            <!-- Latency Bar Chart -->
            <div class="mt-4">
              <p class="text-xs font-medium text-muted-foreground mb-2">Step Latency (seconds)</p>
              <div class="flex items-end gap-1 h-12">
                <div
                  v-for="(step, index) in selectedExecution.steps"
                  :key="index"
                  class="flex-1 flex flex-col items-center"
                >
                  <div
                    :style="{ height: `${(step.latency / maxLatency) * 100}%` }"
                    :class="[
                      'w-full rounded-t transition-all',
                      step.status === 'completed' ? 'bg-emerald-500' :
                      step.status === 'running' ? 'bg-amber-500' :
                      step.status === 'error' ? 'bg-red-500' : 'bg-muted'
                    ]"
                  />
                  <span class="text-[9px] font-mono text-muted-foreground mt-1">{{ step.latency.toFixed(1) }}s</span>
                </div>
              </div>
            </div>

            <!-- Latency Gantt Trace -->
            <div class="mt-4 p-4 bg-zinc-900 rounded border border-zinc-800 font-mono text-[11px]">
              <div class="text-zinc-500 uppercase mb-2">Execution Trace</div>
              <div
                v-for="step in selectedExecution.steps"
                :key="step.id"
                class="flex items-center gap-2 mb-1"
              >
                <div class="w-32 truncate text-zinc-300">{{ step.nodeName }}</div>
                <div class="flex-1 h-2 bg-zinc-800 rounded overflow-hidden">
                  <div
                    class="h-full transition-all duration-500"
                    :class="[
                      step.status === 'completed' ? 'bg-emerald-500/70' :
                      step.status === 'running' ? 'bg-amber-500/70' :
                      step.status === 'error' ? 'bg-red-500/70' : 'bg-zinc-600/70'
                    ]"
                    :style="{ width: `${(step.latency / maxLatency) * 100}%` }"
                  ></div>
                </div>
                <div class="w-12 text-right text-zinc-500">{{ step.latency.toFixed(2) }}s</div>
              </div>
            </div>
          </div>
          
          <!-- Trace Steps -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div
              v-for="(step, index) in selectedExecution.steps"
              :key="step.id"
              class="border border-border rounded-lg overflow-hidden"
            >
              <!-- Step Header -->
              <button
                @click="toggleStep(step.id)"
                class="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-secondary/50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-xs font-mono text-muted-foreground">
                    {{ index + 1 }}
                  </div>
                  <div :class="['p-1.5 rounded-md', getNodeBg(step.nodeType)]">
                    <component :is="getNodeIcon(step.nodeType)" :class="['w-4 h-4', getNodeColor(step.nodeType)]" />
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-medium text-foreground">{{ step.nodeName }}</p>
                    <p class="text-xs text-muted-foreground">{{ step.nodeType }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span :class="['text-xs font-mono', getStatusColor(step.status)]">
                    {{ step.latency.toFixed(2) }}s
                  </span>
                  <div :class="['w-2 h-2 rounded-full', getStatusDot(step.status)]" />
                  <ChevronDown :class="['w-4 h-4 text-muted-foreground transition-transform', expandedSteps.includes(step.id) && 'rotate-180']" />
                </div>
              </button>
              
              <!-- Step Details (Expandable) -->
              <Transition name="expand">
                <div v-if="expandedSteps.includes(step.id)" class="border-t border-border">
                  <!-- Input/Output JSON -->
                  <div class="grid grid-cols-2 divide-x divide-border">
                    <div class="p-4">
                      <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Input</p>
                      <div class="code-block text-xs overflow-x-auto max-h-40">
                        <pre><code v-html="formatJson(step.input)"></code></pre>
                      </div>
                    </div>
                    <div class="p-4">
                      <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Output</p>
                      <div class="code-block text-xs overflow-x-auto max-h-40">
                        <pre><code v-html="formatJson(step.output)"></code></pre>
                      </div>
                    </div>
                  </div>
                  
                  <!-- System Logs (Chain-of-Thought) -->
                  <div class="border-t border-border p-4">
                    <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      System Logs (Chain-of-Thought)
                    </p>
                    <div class="terminal rounded-lg p-3 max-h-48 overflow-y-auto">
                      <div
                        v-for="(log, logIndex) in step.logs"
                        :key="logIndex"
                        class="flex gap-2 mb-1"
                      >
                        <span class="timestamp text-[10px] shrink-0">[{{ log.timestamp }}]</span>
                        <span :class="[
                          'text-xs',
                          log.type === 'thought' ? 'text-blue-400' :
                          log.type === 'action' ? 'text-emerald-400' :
                          log.type === 'error' ? 'text-red-400' : 'text-muted-foreground'
                        ]">
                          <span class="prompt">{{ log.type }}:</span> {{ log.content }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
            
            <!-- Typing indicator for running executions -->
            <div
              v-if="selectedExecution.status === 'running' && isLiveUpdating"
              class="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg"
            >
              <div class="flex gap-1">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style="animation-delay: 0ms" />
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style="animation-delay: 150ms" />
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style="animation-delay: 300ms" />
              </div>
              <span class="text-sm text-amber-500">Execution in progress...</span>
            </div>
          </div>
        </template>
        
        <!-- Empty State -->
        <div v-else class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <Layers class="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 class="mt-4 text-lg font-medium text-foreground">No execution selected</h3>
            <p class="mt-1 text-sm text-muted-foreground">Select an execution to view its trace</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  Search, RefreshCw, ChevronDown, Layers,
  Play, CheckCircle2, AlertCircle, Clock,
  Bot, Wrench, GitFork, Flag
} from 'lucide-vue-next'

interface LogEntry {
  timestamp: string
  type: 'thought' | 'action' | 'result' | 'error'
  content: string
}

interface ExecutionStep {
  id: string
  nodeName: string
  nodeType: 'input' | 'llm-agent' | 'tool-api' | 'condition' | 'output'
  status: 'pending' | 'running' | 'completed' | 'error'
  latency: number
  input: Record<string, unknown>
  output: Record<string, unknown>
  logs: LogEntry[]
}

interface Execution {
  id: string
  name: string
  pipeline: string
  status: 'running' | 'completed' | 'failed'
  startTime: string
  duration: string
  steps: ExecutionStep[]
}

const searchQuery = ref('')
const filterStatus = ref('all')
const isLiveUpdating = ref(true)
const selectedExecution = ref<Execution | null>(null)
const expandedSteps = ref<string[]>([])

const executions = ref<Execution[]>([
  {
    id: 'exec_a1b2c3d4e5f6',
    name: 'Customer Support Query #1247',
    pipeline: 'Customer Support Flow',
    status: 'completed',
    startTime: '2 min ago',
    duration: '4.2s',
    steps: [
      {
        id: 'step_1',
        nodeName: 'Customer Query',
        nodeType: 'input',
        status: 'completed',
        latency: 0.12,
        input: { query: "How do I reset my password?", userId: "usr_123", channel: "chat" },
        output: { normalized: true, language: "en", intent: "password_reset" },
        logs: [
          { timestamp: '14:32:01.123', type: 'action', content: 'Received incoming query from chat channel' },
          { timestamp: '14:32:01.145', type: 'action', content: 'Normalized input text and detected language' }
        ]
      },
      {
        id: 'step_2',
        nodeName: 'Classifier Agent',
        nodeType: 'llm-agent',
        status: 'completed',
        latency: 1.85,
        input: { query: "How do I reset my password?", context: { userId: "usr_123" } },
        output: { priority: "low", category: "account", confidence: 0.94 },
        logs: [
          { timestamp: '14:32:01.150', type: 'thought', content: 'Analyzing query to determine priority level...' },
          { timestamp: '14:32:02.100', type: 'thought', content: 'Query appears to be a standard account-related question' },
          { timestamp: '14:32:02.500', type: 'action', content: 'Classified as low priority with 94% confidence' },
          { timestamp: '14:32:03.000', type: 'result', content: 'Classification complete: category=account, priority=low' }
        ]
      },
      {
        id: 'step_3',
        nodeName: 'Priority Check',
        nodeType: 'condition',
        status: 'completed',
        latency: 0.05,
        input: { priority: "low", threshold: "high" },
        output: { branch: "false", reason: "priority_below_threshold" },
        logs: [
          { timestamp: '14:32:03.050', type: 'action', content: 'Evaluating condition: priority === "high"' },
          { timestamp: '14:32:03.100', type: 'result', content: 'Condition evaluated to FALSE, routing to Auto Responder' }
        ]
      },
      {
        id: 'step_4',
        nodeName: 'Auto Responder',
        nodeType: 'llm-agent',
        status: 'completed',
        latency: 2.1,
        input: { query: "How do I reset my password?", category: "account", templates: ["password_reset_guide"] },
        output: { response: "To reset your password, click on 'Forgot Password' on the login page...", sources: ["kb_article_42"] },
        logs: [
          { timestamp: '14:32:03.150', type: 'thought', content: 'Searching knowledge base for password reset instructions...' },
          { timestamp: '14:32:04.200', type: 'thought', content: 'Found relevant article: kb_article_42' },
          { timestamp: '14:32:04.800', type: 'action', content: 'Generating response using template and context' },
          { timestamp: '14:32:05.250', type: 'result', content: 'Response generated successfully, 156 characters' }
        ]
      },
      {
        id: 'step_5',
        nodeName: 'Response Output',
        nodeType: 'output',
        status: 'completed',
        latency: 0.08,
        input: { response: "To reset your password...", channel: "chat", userId: "usr_123" },
        output: { delivered: true, messageId: "msg_789", timestamp: "2024-01-15T14:32:05.330Z" },
        logs: [
          { timestamp: '14:32:05.300', type: 'action', content: 'Sending response to chat channel' },
          { timestamp: '14:32:05.330', type: 'result', content: 'Response delivered successfully' }
        ]
      }
    ]
  },
  {
    id: 'exec_f7g8h9i0j1k2',
    name: 'Content Generation Request',
    pipeline: 'Content Generation',
    status: 'running',
    startTime: '30 sec ago',
    duration: '2.1s',
    steps: [
      {
        id: 'step_1',
        nodeName: 'Topic Input',
        nodeType: 'input',
        status: 'completed',
        latency: 0.15,
        input: { topic: "AI trends 2024", length: 500, tone: "professional" },
        output: { validated: true, wordCount: 500 },
        logs: [
          { timestamp: '14:35:01.000', type: 'action', content: 'Received content generation request' }
        ]
      },
      {
        id: 'step_2',
        nodeName: 'Research Agent',
        nodeType: 'llm-agent',
        status: 'running',
        latency: 1.95,
        input: { topic: "AI trends 2024" },
        output: {},
        logs: [
          { timestamp: '14:35:01.150', type: 'thought', content: 'Initiating research on AI trends for 2024...' },
          { timestamp: '14:35:02.500', type: 'thought', content: 'Identifying key areas: LLMs, multimodal AI, agents...' },
          { timestamp: '14:35:03.100', type: 'action', content: 'Gathering information from multiple sources...' }
        ]
      }
    ]
  },
  {
    id: 'exec_l3m4n5o6p7q8',
    name: 'Data Analysis Failed',
    pipeline: 'Data Analysis Pipeline',
    status: 'failed',
    startTime: '15 min ago',
    duration: '1.2s',
    steps: [
      {
        id: 'step_1',
        nodeName: 'Data Input',
        nodeType: 'input',
        status: 'completed',
        latency: 0.1,
        input: { source: "database", query: "SELECT * FROM sales" },
        output: { connected: true },
        logs: [
          { timestamp: '14:20:00.000', type: 'action', content: 'Connecting to database...' }
        ]
      },
      {
        id: 'step_2',
        nodeName: 'SQL Query Tool',
        nodeType: 'tool-api',
        status: 'error',
        latency: 1.1,
        input: { query: "SELECT * FROM sales WHERE date > '2024-01-01'" },
        output: { error: "Connection timeout", code: "DB_TIMEOUT" },
        logs: [
          { timestamp: '14:20:00.100', type: 'action', content: 'Executing SQL query...' },
          { timestamp: '14:20:01.100', type: 'error', content: 'Database connection timeout after 1000ms' },
          { timestamp: '14:20:01.200', type: 'error', content: 'Failed to retrieve data: DB_TIMEOUT' }
        ]
      }
    ]
  }
])

const filteredExecutions = computed(() => {
  let filtered = executions.value
  
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(e => e.status === filterStatus.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(e => 
      e.name.toLowerCase().includes(query) ||
      e.pipeline.toLowerCase().includes(query) ||
      e.id.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

const maxLatency = computed(() => {
  if (!selectedExecution.value) return 1
  return Math.max(...selectedExecution.value.steps.map(s => s.latency), 0.1)
})

// Set initial selected execution
selectedExecution.value = executions.value[0]

function getStatusIcon(status: string) {
  switch (status) {
    case 'running': return Play
    case 'completed': return CheckCircle2
    case 'failed': return AlertCircle
    default: return Clock
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'running': return 'text-amber-500'
    case 'completed': return 'text-emerald-500'
    case 'failed': return 'text-red-500'
    case 'error': return 'text-red-500'
    default: return 'text-muted-foreground'
  }
}

function getStatusBg(status: string) {
  switch (status) {
    case 'running': return 'bg-amber-500/20'
    case 'completed': return 'bg-emerald-500/20'
    case 'failed': return 'bg-red-500/20'
    case 'error': return 'bg-red-500/20'
    default: return 'bg-muted'
  }
}

function getStatusDot(status: string) {
  switch (status) {
    case 'running': return 'bg-amber-500 animate-pulse'
    case 'completed': return 'bg-emerald-500'
    case 'error': return 'bg-red-500'
    default: return 'bg-muted'
  }
}

function getNodeIcon(type: string) {
  switch (type) {
    case 'input': return Play
    case 'llm-agent': return Bot
    case 'tool-api': return Wrench
    case 'condition': return GitFork
    case 'output': return Flag
    default: return Layers
  }
}

function getNodeColor(type: string) {
  switch (type) {
    case 'input': return 'text-emerald-500'
    case 'llm-agent': return 'text-blue-500'
    case 'tool-api': return 'text-purple-500'
    case 'condition': return 'text-amber-500'
    case 'output': return 'text-rose-500'
    default: return 'text-muted-foreground'
  }
}

function getNodeBg(type: string) {
  switch (type) {
    case 'input': return 'bg-emerald-500/20'
    case 'llm-agent': return 'bg-blue-500/20'
    case 'tool-api': return 'bg-purple-500/20'
    case 'condition': return 'bg-amber-500/20'
    case 'output': return 'bg-rose-500/20'
    default: return 'bg-muted'
  }
}

function toggleStep(stepId: string) {
  const index = expandedSteps.value.indexOf(stepId)
  if (index > -1) {
    expandedSteps.value.splice(index, 1)
  } else {
    expandedSteps.value.push(stepId)
  }
}

function formatJson(obj: Record<string, unknown>): string {
  const json = JSON.stringify(obj, null, 2)
  return json
    .replace(/"([^"]+)":/g, '<span class="key">"$1"</span>:')
    .replace(/: "([^"]+)"/g, ': <span class="string">"$1"</span>')
    .replace(/: (\d+\.?\d*)/g, ': <span class="number">$1</span>')
    .replace(/: (true|false)/g, ': <span class="boolean">$1</span>')
}

// Simulate live updates
let updateInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateInterval = setInterval(() => {
    if (!isLiveUpdating.value) return
    
    const runningExec = executions.value.find(e => e.status === 'running')
    if (runningExec) {
      const runningStep = runningExec.steps.find(s => s.status === 'running')
      if (runningStep) {
        runningStep.latency += 0.1
        const thoughts = [
          'Processing gathered information...',
          'Analyzing context and patterns...',
          'Formulating response strategy...',
          'Cross-referencing with knowledge base...'
        ]
        runningStep.logs.push({
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + String(Date.now() % 1000).padStart(3, '0'),
          type: 'thought',
          content: thoughts[Math.floor(Math.random() * thoughts.length)]
        })
      }
    }
  }, 2000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
}
</style>
