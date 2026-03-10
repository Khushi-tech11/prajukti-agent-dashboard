<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Plus, 
  Bot, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  Sparkles,
  Brain,
  MessageSquare,
  Search,
  FileText,
  Calculator,
  Mail,
  ListTodo,
  GripVertical,
  Check
} from 'lucide-vue-next'

interface Agent {
  id: number
  name: string
  role: string
  personality: string
  tools: string[]
  status: 'active' | 'inactive'
  createdAt: string
}

const agents = ref<Agent[]>([
  { id: 1, name: 'Research Assistant', role: 'Researcher', personality: 'Professional', tools: ['Web Search', 'Summarizer'], status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Content Writer', role: 'Writer', personality: 'Creative', tools: ['Web Search', 'Email Drafting'], status: 'active', createdAt: '2024-01-12' },
  { id: 3, name: 'Data Analyzer', role: 'Planner', personality: 'Analytical', tools: ['Calculator', 'Summarizer'], status: 'inactive', createdAt: '2024-01-10' },
])

const showModal = ref(false)
const editingAgent = ref<Agent | null>(null)
const searchQuery = ref('')

const newAgent = ref({
  name: '',
  role: 'Researcher',
  personality: 'Professional',
  tools: [] as string[]
})

const roles = ['Researcher', 'Writer', 'Planner', 'Assistant', 'Analyst']
const personalities = ['Professional', 'Creative', 'Analytical', 'Friendly', 'Concise']
const availableTools = [
  { id: 'web-search', name: 'Web Search', icon: Search },
  { id: 'summarizer', name: 'Summarizer', icon: FileText },
  { id: 'calculator', name: 'Calculator', icon: Calculator },
  { id: 'email-drafting', name: 'Email Drafting', icon: Mail },
  { id: 'todo-manager', name: 'To-Do Manager', icon: ListTodo },
]

const filteredAgents = computed(() => {
  if (!searchQuery.value) return agents.value
  return agents.value.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const openCreateModal = () => {
  editingAgent.value = null
  newAgent.value = { name: '', role: 'Researcher', personality: 'Professional', tools: [] }
  showModal.value = true
}

const openEditModal = (agent: Agent) => {
  editingAgent.value = agent
  newAgent.value = { 
    name: agent.name, 
    role: agent.role, 
    personality: agent.personality, 
    tools: [...agent.tools] 
  }
  showModal.value = true
}

const toggleTool = (toolName: string) => {
  const index = newAgent.value.tools.indexOf(toolName)
  if (index > -1) {
    newAgent.value.tools.splice(index, 1)
  } else {
    newAgent.value.tools.push(toolName)
  }
}

const saveAgent = () => {
  if (editingAgent.value) {
    const index = agents.value.findIndex(a => a.id === editingAgent.value!.id)
    agents.value[index] = {
      ...editingAgent.value,
      name: newAgent.value.name,
      role: newAgent.value.role,
      personality: newAgent.value.personality,
      tools: newAgent.value.tools
    }
  } else {
    agents.value.push({
      id: Date.now(),
      name: newAgent.value.name,
      role: newAgent.value.role,
      personality: newAgent.value.personality,
      tools: newAgent.value.tools,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    })
  }
  showModal.value = false
}

const deleteAgent = (id: number) => {
  agents.value = agents.value.filter(a => a.id !== id)
}

const toggleStatus = (agent: Agent) => {
  agent.status = agent.status === 'active' ? 'inactive' : 'active'
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'Researcher': return Search
    case 'Writer': return MessageSquare
    case 'Planner': return ListTodo
    case 'Analyst': return Brain
    default: return Bot
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-[hsl(var(--foreground))]">Agent Builder</h2>
        <p class="text-[hsl(var(--muted-foreground))]">Create and manage your AI agents</p>
      </div>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[hsl(var(--primary)/0.9)]"
      >
        <Plus class="h-4 w-4" />
        Create Agent
      </button>
    </div>

    <!-- Search -->
    <div class="relative max-w-md">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search agents..."
        class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-10 pr-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
      />
    </div>

    <!-- Agents Grid -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="agent in filteredAgents"
        :key="agent.id"
        class="group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 transition-all hover:border-[hsl(var(--primary)/0.5)]"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.15)]">
              <component :is="getRoleIcon(agent.role)" class="h-6 w-6 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h3 class="font-semibold text-[hsl(var(--foreground))]">{{ agent.name }}</h3>
              <p class="text-sm text-[hsl(var(--muted-foreground))]">{{ agent.role }}</p>
            </div>
          </div>
          <div
            :class="[
              'rounded-full px-2.5 py-1 text-xs font-medium',
              agent.status === 'active' 
                ? 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]' 
                : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
            ]"
          >
            {{ agent.status }}
          </div>
        </div>

        <div class="mt-4 space-y-3">
          <div class="flex items-center gap-2 text-sm">
            <Sparkles class="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <span class="text-[hsl(var(--muted-foreground))]">Personality:</span>
            <span class="text-[hsl(var(--foreground))]">{{ agent.personality }}</span>
          </div>
          
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tool in agent.tools"
              :key="tool"
              class="rounded-md bg-[hsl(var(--secondary))] px-2 py-1 text-xs text-[hsl(var(--foreground))]"
            >
              {{ tool }}
            </span>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4">
          <span class="text-xs text-[hsl(var(--muted-foreground))]">Created {{ agent.createdAt }}</span>
          <div class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              @click="openEditModal(agent)"
              class="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]"
            >
              <Pencil class="h-4 w-4" />
            </button>
            <button
              @click="deleteAgent(agent.id)"
              class="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive)/0.15)] hover:text-[hsl(var(--destructive))]"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredAgents.length === 0"
        class="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-[hsl(var(--border))] py-12"
      >
        <Bot class="h-12 w-12 text-[hsl(var(--muted-foreground))]" />
        <h3 class="mt-4 text-lg font-medium text-[hsl(var(--foreground))]">No agents found</h3>
        <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Create your first agent to get started</p>
        <button
          @click="openCreateModal"
          class="mt-4 flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))]"
        >
          <Plus class="h-4 w-4" />
          Create Agent
        </button>
      </div>
    </div>

   <!-- Modal -->
   <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        @click.self="showModal = false"
      >
        <div class="w-full max-w-lg rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl overflow-hidden">

          <!-- Header -->
          <div class="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/25">
                <Save class="h-4 w-4 text-emerald-400" />
              </div>
              <h3 class="text-base font-semibold text-[hsl(var(--foreground))] tracking-tight">
                {{ editingAgent ? 'Edit Agent' : 'Create New Agent' }}
              </h3>
            </div>
            <button
              @click="showModal = false"
              class="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <div class="space-y-5 p-6">

            <!-- Name -->
            <div class="space-y-1.5">
              <label class="block text-xs font-medium tracking-wide uppercase text-[hsl(var(--muted-foreground))]">Agent Name</label>
              <input
                v-model="newAgent.name"
                type="text"
                placeholder="e.g. Research Assistant"
                class="h-10 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            <!-- Role + Personality side by side -->
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="block text-xs font-medium tracking-wide uppercase text-[hsl(var(--muted-foreground))]">Role</label>
                <select
                  v-model="newAgent.role"
                  class="h-10 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-sm text-[hsl(var(--foreground))] focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                >
                  <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs font-medium tracking-wide uppercase text-[hsl(var(--muted-foreground))]">Personality</label>
                <select
                  v-model="newAgent.personality"
                  class="h-10 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-sm text-[hsl(var(--foreground))] focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                >
                  <option v-for="p in personalities" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>
            </div>

            <!-- Tools -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-medium tracking-wide uppercase text-[hsl(var(--muted-foreground))]">Assign Tools</label>
                <span class="text-[11px] text-[hsl(var(--muted-foreground))] font-mono">
                  {{ newAgent.tools.length }} selected
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="tool in availableTools"
                  :key="tool.id"
                  @click="toggleTool(tool.name)"
                  class="relative flex items-center gap-2.5 rounded-xl border p-3 text-sm transition-all duration-150 text-left overflow-hidden"
                  :class="newAgent.tools.includes(tool.name)
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.15)]'
                    : 'border-[hsl(var(--border))] bg-[hsl(var(--secondary))]/50 text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--muted-foreground))]/50 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]'"
                >
                  <!-- Selected glow strip on left -->
                  <div
                    v-if="newAgent.tools.includes(tool.name)"
                    class="absolute left-0 inset-y-0 w-0.5 bg-emerald-400 rounded-r"
                  />
                  <!-- Icon -->
                  <div
                    class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md transition-colors"
                    :class="newAgent.tools.includes(tool.name)
                      ? 'bg-emerald-500/25'
                      : 'bg-[hsl(var(--border))]/60'"
                  >
                    <component :is="tool.icon" class="h-3.5 w-3.5" />
                  </div>
                  <span class="font-medium text-xs flex-1">{{ tool.name }}</span>
                  <!-- Checkmark -->
                  <div
                    class="flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full transition-all duration-150"
                    :class="newAgent.tools.includes(tool.name)
                      ? 'bg-emerald-500 scale-100'
                      : 'bg-transparent border border-[hsl(var(--border))] scale-90'"
                  >
                    <Check
                      v-if="newAgent.tools.includes(tool.name)"
                      class="h-2.5 w-2.5 text-white"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]/50 px-6 py-4">
            <!-- Left: tool count summary -->
            <div class="flex items-center gap-2">
              <template v-if="newAgent.tools.length > 0">
                <div class="flex -space-x-1">
                  <div
                    v-for="t in newAgent.tools.slice(0, 3)"
                    :key="t"
                    class="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-900 bg-emerald-500/20 text-[9px] text-emerald-400"
                  >
                    <component :is="availableTools.find(at => at.name === t)?.icon" class="h-3 w-3" />
                  </div>
                </div>
                <span class="text-[11px] text-emerald-400 font-medium">
                  {{ newAgent.tools.length }} tool{{ newAgent.tools.length !== 1 ? 's' : '' }} assigned
                </span>
              </template>
              <span v-else class="text-[11px] text-[hsl(var(--muted-foreground))]">No tools selected</span>
            </div>

            <!-- Right: actions -->
            <div class="flex items-center gap-2.5">
              <button
                @click="showModal = false"
                class="rounded-xl border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] transition-all"
              >
                Cancel
              </button>
              <button
                @click="saveAgent"
                :disabled="!newAgent.name"
                class="group relative flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-150 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
                :class="newAgent.name
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-[#0a1a0d] shadow-[0_4px_16px_rgba(52,211,153,0.25)] hover:shadow-[0_4px_24px_rgba(52,211,153,0.4)]'
                  : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]'"
              >
                <Save class="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                {{ editingAgent ? 'Save Changes' : 'Create Agent' }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </Teleport>
  </div>
</template>
