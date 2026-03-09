<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import {
  Search,
  FileText,
  Calculator,
  Mail,
  ListTodo,
  Globe,
  Database,
  Code,
  Image,
  MessageSquare,
  Plus,
  X,
  ExternalLink,
  Check,
  Trash2,
  Edit3,
  Copy,
  Play,
  Settings,
  Zap,
  Shield,
  Clock,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Loader2,
  Filter,
  Grid3X3,
  List,
  Star,
  StarOff,
  Terminal,
  Webhook,
  Bot,
  FileJson,
  Link,
  Key
} from 'lucide-vue-next'

interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon: any
  isCustom: boolean
  isFavorite: boolean
  apiEndpoint?: string
  status: 'active' | 'inactive' | 'error'
  usageCount: number
  lastUsed?: string
  version?: string
  authentication?: 'none' | 'api-key' | 'oauth' | 'bearer'
  rateLimit?: string
  responseTime?: string
  parameters?: ToolParameter[]
}

interface ToolParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
  description: string
  default?: string
}

const router = useRouter()
const toastStore = useToastStore()

const tools = ref<Tool[]>([
  {
    id: '1',
    name: 'Web Search',
    description: 'Search the web for real-time information, news, and data using multiple search engines',
    category: 'Research',
    icon: Globe,
    isCustom: false,
    isFavorite: true,
    status: 'active',
    usageCount: 1523,
    lastUsed: '2 min ago',
    version: '2.1.0',
    authentication: 'api-key',
    rateLimit: '1000/day',
    responseTime: '~1.2s',
    parameters: [
      { name: 'query', type: 'string', required: true, description: 'Search query string' },
      { name: 'limit', type: 'number', required: false, description: 'Max results to return', default: '10' }
    ]
  },
  {
    id: '2',
    name: 'Document Summarizer',
    description: 'AI-powered summarization for long documents, articles, and PDFs with customizable length',
    category: 'Content',
    icon: FileText,
    isCustom: false,
    isFavorite: false,
    status: 'active',
    usageCount: 892,
    lastUsed: '15 min ago',
    version: '1.5.2',
    authentication: 'none',
    rateLimit: '500/day',
    responseTime: '~2.5s',
    parameters: [
      { name: 'content', type: 'string', required: true, description: 'Document content to summarize' },
      { name: 'maxLength', type: 'number', required: false, description: 'Maximum summary length', default: '200' }
    ]
  },
  {
    id: '3',
    name: 'Calculator',
    description: 'Advanced mathematical calculations including algebra, calculus, and statistical operations',
    category: 'Utility',
    icon: Calculator,
    isCustom: false,
    isFavorite: false,
    status: 'active',
    usageCount: 456,
    lastUsed: '1 hour ago',
    version: '3.0.0',
    authentication: 'none',
    rateLimit: 'Unlimited',
    responseTime: '~50ms'
  },
  {
    id: '4',
    name: 'Email Composer',
    description: 'Draft professional emails with tone adjustment, templates, and grammar checking',
    category: 'Communication',
    icon: Mail,
    isCustom: false,
    isFavorite: true,
    status: 'active',
    usageCount: 2341,
    lastUsed: '5 min ago',
    version: '2.0.1',
    authentication: 'oauth',
    rateLimit: '200/day',
    responseTime: '~1.8s'
  },
  {
    id: '5',
    name: 'Task Manager',
    description: 'Create, organize, and track tasks with priorities, deadlines, and dependencies',
    category: 'Productivity',
    icon: ListTodo,
    isCustom: false,
    isFavorite: false,
    status: 'active',
    usageCount: 678,
    lastUsed: '30 min ago',
    version: '1.8.0',
    authentication: 'bearer',
    rateLimit: '1000/day',
    responseTime: '~800ms'
  },
  {
    id: '6',
    name: 'SQL Query Builder',
    description: 'Build and execute SQL queries with natural language, supports multiple databases',
    category: 'Data',
    icon: Database,
    isCustom: false,
    isFavorite: true,
    status: 'active',
    usageCount: 1205,
    lastUsed: '10 min ago',
    version: '2.3.0',
    authentication: 'api-key',
    rateLimit: '500/day',
    responseTime: '~1.5s'
  },
  {
    id: '7',
    name: 'Code Generator',
    description: 'Generate code snippets in multiple languages with explanations and best practices',
    category: 'Development',
    icon: Code,
    isCustom: false,
    isFavorite: false,
    status: 'active',
    usageCount: 3456,
    lastUsed: '3 min ago',
    version: '4.0.0',
    authentication: 'api-key',
    rateLimit: '300/day',
    responseTime: '~2.0s'
  },
  {
    id: '8',
    name: 'Image Analyzer',
    description: 'Analyze images for objects, text, faces, and generate detailed descriptions',
    category: 'Media',
    icon: Image,
    isCustom: false,
    isFavorite: false,
    status: 'active',
    usageCount: 789,
    lastUsed: '45 min ago',
    version: '1.2.0',
    authentication: 'api-key',
    rateLimit: '100/day',
    responseTime: '~3.0s'
  },
  {
    id: '9',
    name: 'Webhook Connector',
    description: 'Connect to external webhooks and APIs for data integration and automation',
    category: 'Integration',
    icon: Webhook,
    isCustom: false,
    isFavorite: false,
    status: 'active',
    usageCount: 234,
    lastUsed: '2 hours ago',
    version: '1.0.0',
    authentication: 'bearer',
    rateLimit: '1000/day',
    responseTime: '~500ms'
  },
  {
    id: '10',
    name: 'JSON Parser',
    description: 'Parse, validate, and transform JSON data with schema validation support',
    category: 'Data',
    icon: FileJson,
    isCustom: false,
    isFavorite: false,
    status: 'inactive',
    usageCount: 156,
    lastUsed: '1 day ago',
    version: '1.1.0',
    authentication: 'none',
    rateLimit: 'Unlimited',
    responseTime: '~100ms'
  },
])

const categories = ['All', 'Research', 'Content', 'Utility', 'Communication', 'Productivity', 'Data', 'Development', 'Media', 'Integration']
const selectedCategory = ref('All')
const searchQuery = ref('')
const showAddModal = ref(false)
const selectedTool = ref<Tool | null>(null)
const viewMode = ref<'grid' | 'list'>('grid')
const showFilters = ref(false)
const statusFilter = ref<'all' | 'active' | 'inactive' | 'error'>('all')
const showFavoritesOnly = ref(false)
const testingTool = ref<string | null>(null)
const testResult = ref<{ success: boolean; message: string } | null>(null)

const newTool = ref({
  name: '',
  description: '',
  category: 'Utility',
  apiEndpoint: '',
  apiKey: '',
  authentication: 'none' as 'none' | 'api-key' | 'oauth' | 'bearer'
})

const filteredTools = computed(() => {
  let filtered = tools.value

  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter(tool => tool.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(tool => tool.status === statusFilter.value)
  }

  if (showFavoritesOnly.value) {
    filtered = filtered.filter(tool => tool.isFavorite)
  }

  return filtered
})

const toolStats = computed(() => ({
  total: tools.value.length,
  active: tools.value.filter(t => t.status === 'active').length,
  custom: tools.value.filter(t => t.isCustom).length,
  favorites: tools.value.filter(t => t.isFavorite).length,
  totalUsage: tools.value.reduce((sum, t) => sum + t.usageCount, 0)
}))

const addTool = () => {
  const newToolObj: Tool = {
    id: Date.now().toString(),
    name: newTool.value.name,
    description: newTool.value.description,
    category: newTool.value.category,
    icon: Webhook,
    isCustom: true,
    isFavorite: false,
    status: 'active',
    usageCount: 0,
    apiEndpoint: newTool.value.apiEndpoint,
    version: '1.0.0',
    authentication: newTool.value.authentication,
    rateLimit: 'Custom',
    responseTime: 'N/A'
  }
  tools.value.push(newToolObj)
  showAddModal.value = false
  newTool.value = { name: '', description: '', category: 'Utility', apiEndpoint: '', apiKey: '', authentication: 'none' }
  toastStore.success('Tool Added', `${newToolObj.name} has been added to your library`)
}

const viewToolDetails = (tool: Tool) => {
  selectedTool.value = tool
  testResult.value = null
}

const toggleFavorite = (tool: Tool, event: Event) => {
  event.stopPropagation()
  tool.isFavorite = !tool.isFavorite
  toastStore.info(tool.isFavorite ? 'Added to Favorites' : 'Removed from Favorites', tool.name)
}

const deleteTool = (tool: Tool) => {
  const index = tools.value.findIndex(t => t.id === tool.id)
  if (index > -1) {
    tools.value.splice(index, 1)
    selectedTool.value = null
    toastStore.success('Tool Deleted', `${tool.name} has been removed`)
  }
}

const duplicateTool = (tool: Tool) => {
  const duplicate: Tool = {
    ...tool,
    id: Date.now().toString(),
    name: `${tool.name} (Copy)`,
    isCustom: true,
    usageCount: 0
  }
  tools.value.push(duplicate)
  toastStore.success('Tool Duplicated', `${duplicate.name} has been created`)
}

const testTool = async (tool: Tool) => {
  testingTool.value = tool.id
  testResult.value = null

  // Simulate API test
  await new Promise(resolve => setTimeout(resolve, 1500))

  const success = Math.random() > 0.2
  testResult.value = {
    success,
    message: success
      ? 'Connection successful! Tool is ready to use.'
      : 'Connection failed. Please check your API endpoint and credentials.'
  }
  testingTool.value = null
}

const getAuthIcon = (auth: string) => {
  switch (auth) {
    case 'api-key': return Key
    case 'oauth': return Shield
    case 'bearer': return Shield
    default: return Shield
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-emerald-500'
    case 'inactive': return 'bg-zinc-500'
    case 'error': return 'bg-red-500'
    default: return 'bg-zinc-500'
  }
}
</script>

<template>
  <div class="h-full flex flex-col bg-[hsl(var(--background))]">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-[hsl(var(--foreground))]">Tool Library</h2>
        <p class="text-[hsl(var(--muted-foreground))] text-sm mt-1">Browse and manage tools for your AI agents</p>
      </div>
      <button @click="showAddModal = true"
        class="flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-all hover:opacity-90">
        <Plus class="h-4 w-4" />
        Add Custom Tool
      </button>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      <div class="px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <p class="text-2xl font-bold text-[hsl(var(--foreground))]">{{ toolStats.total }}</p>
        <p class="text-xs text-[hsl(var(--muted-foreground))]">Total Tools</p>
      </div>
      <div class="px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <p class="text-2xl font-bold text-emerald-400">{{ toolStats.active }}</p>
        <p class="text-xs text-[hsl(var(--muted-foreground))]">Active</p>
      </div>
      <div class="px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <p class="text-2xl font-bold text-amber-400">{{ toolStats.custom }}</p>
        <p class="text-xs text-[hsl(var(--muted-foreground))]">Custom</p>
      </div>
      <div class="px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <p class="text-2xl font-bold text-pink-400">{{ toolStats.favorites }}</p>
        <p class="text-xs text-[hsl(var(--muted-foreground))]">Favorites</p>
      </div>
      <div class="px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <p class="text-2xl font-bold text-cyan-400">{{ toolStats.totalUsage.toLocaleString() }}</p>
        <p class="text-xs text-[hsl(var(--muted-foreground))]">Total Uses</p>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
      <!-- Search -->
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
        <input v-model="searchQuery" type="text" placeholder="Search tools by name, description, or category..."
          class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-10 pr-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:outline-none" />
      </div>

      <!-- Quick Filters -->
      <div class="flex items-center gap-2">
        <button @click="showFavoritesOnly = !showFavoritesOnly" :class="[
          'flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-all',
          showFavoritesOnly
            ? 'border-pink-500/50 bg-pink-500/10 text-pink-400'
            : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
        ]">
          <Star :class="['h-4 w-4', showFavoritesOnly ? 'fill-current' : '']" />
          <span class="hidden sm:inline">Favorites</span>
        </button>

        <button @click="showFilters = !showFilters" :class="[
          'flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-all',
          showFilters
            ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]'
            : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
        ]">
          <Filter class="h-4 w-4" />
          <span class="hidden sm:inline">Filters</span>
        </button>

        <div class="h-6 w-px bg-[hsl(var(--border))]" />

        <!-- View Mode Toggle -->
        <div class="flex items-center rounded-lg border border-[hsl(var(--border))] p-0.5">
          <button @click="viewMode = 'grid'" :class="[
            'p-1.5 rounded-md transition-colors',
            viewMode === 'grid' ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'
          ]">
            <Grid3X3 class="h-4 w-4" />
          </button>
          <button @click="viewMode = 'list'" :class="[
            'p-1.5 rounded-md transition-colors',
            viewMode === 'list' ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'
          ]">
            <List class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Expanded Filters -->
    <Transition name="slide">
      <div v-if="showFilters" class="mb-6 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div class="flex flex-wrap gap-4">
          <div>
            <p class="text-xs text-[hsl(var(--muted-foreground))] mb-2">Status</p>
            <div class="flex gap-2">
              <button v-for="status in ['all', 'active', 'inactive', 'error']" :key="status"
                @click="statusFilter = status as any" :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                  statusFilter === status
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))/80]'
                ]">
                {{ status }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Categories -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button v-for="category in categories" :key="category" @click="selectedCategory = category" :class="[
        'rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
        selectedCategory === category
          ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
          : 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))/80]'
      ]">
        {{ category }}
      </button>
    </div>

    <!-- Tools Grid/List -->
    <div class="flex-1 overflow-y-auto">
      <div :class="viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-3'">
        <div v-for="tool in filteredTools" :key="tool.id" @click="viewToolDetails(tool)" :class="[
          'group cursor-pointer rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all hover:border-[hsl(var(--primary))/50] hover:shadow-lg',
          viewMode === 'grid' ? 'p-5' : 'p-4 flex items-center gap-4'
        ]">
          <!-- Grid View -->
          <template v-if="viewMode === 'grid'">
            <div class="flex items-start justify-between mb-3">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary))/15]">
                <component :is="tool.icon" class="h-6 w-6 text-[hsl(var(--primary))]" />
              </div>
              <div class="flex items-center gap-2">
                <button @click="toggleFavorite(tool, $event)"
                  class="p-1 rounded-md hover:bg-[hsl(var(--secondary))] transition-colors">
                  <Star :class="[
                    'h-4 w-4 transition-colors',
                    tool.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-[hsl(var(--muted-foreground))]'
                  ]" />
                </button>
                <div :class="['w-2 h-2 rounded-full', getStatusColor(tool.status)]" />
              </div>
            </div>

            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold text-[hsl(var(--foreground))] truncate">{{ tool.name }}</h3>
              <span v-if="tool.isCustom"
                class="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                Custom
              </span>
            </div>

            <p class="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2 mb-3">{{ tool.description }}</p>

            <div class="flex items-center justify-between text-xs">
              <span class="rounded-md bg-[hsl(var(--secondary))] px-2 py-1 text-[hsl(var(--foreground))]">
                {{ tool.category }}
              </span>
              <div class="flex items-center gap-3 text-[hsl(var(--muted-foreground))]">
                <span class="flex items-center gap-1">
                  <Zap class="h-3 w-3" />
                  {{ tool.usageCount }}
                </span>
                <span class="flex items-center gap-1">
                  <Clock class="h-3 w-3" />
                  {{ tool.responseTime }}
                </span>
              </div>
            </div>
          </template>

          <!-- List View -->
          <template v-else>
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary))/15]">
              <component :is="tool.icon" class="h-5 w-5 text-[hsl(var(--primary))]" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold text-[hsl(var(--foreground))] truncate">{{ tool.name }}</h3>
                <span v-if="tool.isCustom"
                  class="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                  Custom
                </span>
                <div :class="['w-2 h-2 rounded-full', getStatusColor(tool.status)]" />
              </div>
              <p class="text-sm text-[hsl(var(--muted-foreground))] truncate">{{ tool.description }}</p>
            </div>
            <div class="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
              <span class="rounded-md bg-[hsl(var(--secondary))] px-2 py-1 text-[hsl(var(--foreground))]">
                {{ tool.category }}
              </span>
              <span class="flex items-center gap-1">
                <Zap class="h-3 w-3" />
                {{ tool.usageCount }}
              </span>
              <button @click="toggleFavorite(tool, $event)"
                class="p-1 rounded-md hover:bg-[hsl(var(--secondary))] transition-colors">
                <Star :class="[
                  'h-4 w-4 transition-colors',
                  tool.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-[hsl(var(--muted-foreground))]'
                ]" />
              </button>
            </div>
          </template>
        </div>
      </div>

      <div v-if="filteredTools.length === 0" class="flex flex-col items-center justify-center py-16">
        <div class="w-16 h-16 rounded-2xl bg-[hsl(var(--secondary))] flex items-center justify-center mb-4">
          <Search class="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
        </div>
        <p class="text-[hsl(var(--foreground))] font-medium">No tools found</p>
        <p class="text-sm text-[hsl(var(--muted-foreground))] mt-1">Try adjusting your search or filters</p>
      </div>
    </div>

    <!-- Tool Details Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedTool" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="selectedTool = null" />
          <div
            class="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl">
            <!-- Modal Header -->
            <div class="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
              <div class="flex items-center gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--primary))/15]">
                  <component :is="selectedTool.icon" class="h-6 w-6 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-lg font-semibold text-[hsl(var(--foreground))]">{{ selectedTool.name }}</h3>
                    <span v-if="selectedTool.isCustom"
                      class="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                      Custom
                    </span>
                  </div>
                  <p class="text-sm text-[hsl(var(--muted-foreground))]">v{{ selectedTool.version }}</p>
                </div>
              </div>
              <button @click="selectedTool = null"
                class="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] transition-colors">
                <X class="h-5 w-5" />
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
              <p class="text-[hsl(var(--muted-foreground))] mb-6">{{ selectedTool.description }}</p>

              <!-- Stats Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div class="p-3 rounded-lg bg-[hsl(var(--secondary))]">
                  <p class="text-xs text-[hsl(var(--muted-foreground))] mb-1">Status</p>
                  <div class="flex items-center gap-2">
                    <div :class="['w-2 h-2 rounded-full', getStatusColor(selectedTool.status)]" />
                    <span class="text-sm font-medium text-[hsl(var(--foreground))] capitalize">{{ selectedTool.status
                      }}</span>
                  </div>
                </div>
                <div class="p-3 rounded-lg bg-[hsl(var(--secondary))]">
                  <p class="text-xs text-[hsl(var(--muted-foreground))] mb-1">Usage</p>
                  <p class="text-sm font-medium text-[hsl(var(--foreground))]">{{
                    selectedTool.usageCount.toLocaleString()
                    }}</p>
                </div>
                <div class="p-3 rounded-lg bg-[hsl(var(--secondary))]">
                  <p class="text-xs text-[hsl(var(--muted-foreground))] mb-1">Response Time</p>
                  <p class="text-sm font-medium text-[hsl(var(--foreground))]">{{ selectedTool.responseTime }}</p>
                </div>
                <div class="p-3 rounded-lg bg-[hsl(var(--secondary))]">
                  <p class="text-xs text-[hsl(var(--muted-foreground))] mb-1">Rate Limit</p>
                  <p class="text-sm font-medium text-[hsl(var(--foreground))]">{{ selectedTool.rateLimit }}</p>
                </div>
              </div>

              <!-- Authentication Info -->
              <div class="mb-6 p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                <div class="flex items-center gap-2 mb-2">
                  <component :is="getAuthIcon(selectedTool.authentication || 'none')"
                    class="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <p class="text-sm font-medium text-[hsl(var(--foreground))]">Authentication</p>
                </div>
                <p class="text-sm text-[hsl(var(--muted-foreground))] capitalize">
                  {{ selectedTool.authentication === 'none' ? 'No authentication required' :
                    selectedTool.authentication?.replace('-', ' ') + ' authentication' }}
                </p>
              </div>

              <!-- API Endpoint -->
              <div v-if="selectedTool.apiEndpoint"
                class="mb-6 p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                <div class="flex items-center gap-2 mb-2">
                  <Link class="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <p class="text-sm font-medium text-[hsl(var(--foreground))]">API Endpoint</p>
                </div>
                <code class="text-sm text-[hsl(var(--primary))] font-mono">{{ selectedTool.apiEndpoint }}</code>
              </div>

              <!-- Parameters -->
              <div v-if="selectedTool.parameters && selectedTool.parameters.length > 0" class="mb-6">
                <p class="text-sm font-medium text-[hsl(var(--foreground))] mb-3">Parameters</p>
                <div class="space-y-2">
                  <div v-for="param in selectedTool.parameters" :key="param.name"
                    class="p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                    <div class="flex items-center gap-2 mb-1">
                      <code class="text-sm text-[hsl(var(--primary))] font-mono">{{ param.name }}</code>
                      <span
                        class="px-1.5 py-0.5 rounded text-[10px] bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]">
                        {{ param.type }}
                      </span>
                      <span v-if="param.required" class="px-1.5 py-0.5 rounded text-[10px] bg-red-500/15 text-red-400">
                        required
                      </span>
                    </div>
                    <p class="text-xs text-[hsl(var(--muted-foreground))]">{{ param.description }}</p>
                    <p v-if="param.default" class="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                      Default: <code class="text-[hsl(var(--foreground))]">{{ param.default }}</code>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Test Connection Result -->
              <Transition name="slide">
                <div v-if="testResult" :class="[
                  'p-4 rounded-lg border mb-6',
                  testResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                ]">
                  <div class="flex items-center gap-2">
                    <CheckCircle v-if="testResult.success" class="h-5 w-5 text-emerald-400" />
                    <AlertCircle v-else class="h-5 w-5 text-red-400" />
                    <p :class="testResult.success ? 'text-emerald-400' : 'text-red-400'" class="text-sm font-medium">
                      {{ testResult.message }}
                    </p>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Modal Footer -->
            <div
              class="flex items-center justify-between gap-3 border-t border-[hsl(var(--border))] px-6 py-4 bg-[hsl(var(--secondary))/30]">
              <div class="flex items-center gap-2">
                <button v-if="selectedTool.isCustom" @click="deleteTool(selectedTool)"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm">
                  <Trash2 class="h-4 w-4" />
                  Delete
                </button>
                <button @click="duplicateTool(selectedTool)"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-colors text-sm">
                  <Copy class="h-4 w-4" />
                  Duplicate
                </button>
              </div>
              <div class="flex items-center gap-2">
                <button @click="testTool(selectedTool)" :disabled="testingTool === selectedTool.id"
                  class="flex items-center gap-2 px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-colors disabled:opacity-50">
                  <Loader2 v-if="testingTool === selectedTool.id" class="h-4 w-4 animate-spin" />
                  <Play v-else class="h-4 w-4" />
                  Test Connection
                </button>
                <button @click="selectedTool = null"
                  class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-sm text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Add Custom Tool Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showAddModal = false" />
          <div
            class="relative w-full max-w-lg rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl">
            <div class="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[hsl(var(--primary))/15] flex items-center justify-center">
                  <Plus class="h-5 w-5 text-[hsl(var(--primary))]" />
                </div>
                <h3 class="text-lg font-semibold text-[hsl(var(--foreground))]">Add Custom Tool</h3>
              </div>
              <button @click="showAddModal = false"
                class="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] transition-colors">
                <X class="h-5 w-5" />
              </button>
            </div>

            <div class="space-y-4 p-6">
              <div class="space-y-2">
                <label class="text-sm font-medium text-[hsl(var(--foreground))]">Tool Name</label>
                <input v-model="newTool.name" type="text" placeholder="My Custom Tool"
                  class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none" />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-[hsl(var(--foreground))]">Description</label>
                <textarea v-model="newTool.description" placeholder="What does this tool do?" rows="3"
                  class="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none resize-none"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-[hsl(var(--foreground))]">Category</label>
                  <select v-model="newTool.category"
                    class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none">
                    <option v-for="cat in categories.slice(1)" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-[hsl(var(--foreground))]">Authentication</label>
                  <select v-model="newTool.authentication"
                    class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none">
                    <option value="none">None</option>
                    <option value="api-key">API Key</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="oauth">OAuth</option>
                  </select>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-[hsl(var(--foreground))]">API Endpoint</label>
                <input v-model="newTool.apiEndpoint" type="url" placeholder="https://api.example.com/v1/endpoint"
                  class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-[hsl(var(--foreground))] font-mono text-sm focus:border-[hsl(var(--primary))] focus:outline-none" />
              </div>

              <div v-if="newTool.authentication !== 'none'" class="space-y-2">
                <label class="text-sm font-medium text-[hsl(var(--foreground))]">API Key / Token</label>
                <input v-model="newTool.apiKey" type="password" placeholder="Enter your API key or token"
                  class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none" />
              </div>
            </div>

            <div class="flex justify-end gap-3 border-t border-[hsl(var(--border))] px-6 py-4">
              <button @click="showAddModal = false"
                class="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-colors">
                Cancel
              </button>
              <button @click="addTool" :disabled="!newTool.name || !newTool.description"
                class="group relative flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-150 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
                :class="newTool.name && newTool.description
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-[#0a1a0d] shadow-[0_4px_16px_rgba(52,211,153,0.25)] hover:shadow-[0_4px_24px_rgba(52,211,153,0.4)]'
                  : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]'">
                <Plus class="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                Add Tool
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
