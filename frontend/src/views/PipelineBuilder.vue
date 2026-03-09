<template>
  <div class="h-full flex flex-col bg-[hsl(var(--background))]">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div class="flex items-center gap-4">
        <div>
          <h1 class="text-xl font-semibold text-[hsl(var(--foreground))]">Pipeline Builder</h1>
          <p class="text-sm text-[hsl(var(--muted-foreground))]">Visual workflow orchestration</p>
        </div>
        
        <!-- Pipeline Selector -->
        <select
          v-model="selectedPipelineId"
          class="px-3 py-1.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-sm font-mono text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
        >
          <option v-for="p in pipelines" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          @click="openAddNodeModal"
          class="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary)/0.8)] rounded-lg text-sm font-medium text-[hsl(var(--foreground))] transition-colors"
        >
          <Plus class="w-4 h-4" />
          Add Node
        </button>
        <button
          @click="runPipeline"
          class="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Play class="w-4 h-4" />
          Run Pipeline
        </button>
      </div>
    </header>
    
    <!-- Canvas Area -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar - Node Types -->
      <aside class="w-64 border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-y-auto flex-shrink-0">
        <div class="p-4">
          <h3 class="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">
            Node Types
          </h3>
          
          <div class="space-y-2">
            <div
              v-for="nodeType in nodeTypes"
              :key="nodeType.type"
              draggable="true"
              @dragstart="(e) => onDragStart(e, nodeType.type)"
              class="flex items-center gap-3 p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--background))] border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary)/0.5)]"
            >
              <div :class="['p-2 rounded-md', nodeType.bgClass]">
                <component :is="nodeType.icon" :class="['w-4 h-4', nodeType.colorClass]" />
              </div>
              <div>
                <div class="text-sm font-medium text-[hsl(var(--foreground))]">{{ nodeType.label }}</div>
                <div class="text-xs text-[hsl(var(--muted-foreground))]">{{ nodeType.description }}</div>
              </div>
            </div>
          </div>
          
          <!-- Active Agents List -->
          <div class="mt-6">
            <h3 class="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">
              Active Agents
            </h3>
            <div class="space-y-2">
              <div
                v-for="agent in agents"
                :key="agent.id"
                class="flex items-center gap-2 p-2 rounded-lg bg-[hsl(var(--secondary)/0.5)]"
              >
                <div class="w-2 h-2 rounded-full bg-emerald-500" />
                <span class="text-sm text-[hsl(var(--foreground))] truncate">{{ agent.name }}</span>
                <span class="text-[10px] font-mono text-[hsl(var(--muted-foreground))] ml-auto">
                  {{ agent.id.slice(0, 8) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      <!-- Vue Flow Canvas -->
      <div 
        class="flex-1 relative"
        @drop="onDrop"
        @dragover.prevent
      >
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :node-types="customNodeTypes"
          :default-viewport="{ zoom: 0.8, x: 100, y: 100 }"
          :min-zoom="0.25"
          :max-zoom="2"
          :fit-view-on-init="false"
          :nodes-draggable="true"
          :nodes-connectable="true"
          :elements-selectable="true"
          :pan-on-drag="true"
          :zoom-on-scroll="true"
          :snap-to-grid="true"
          :snap-grid="[16, 16]"
          @connect="onConnect"
          @node-click="onNodeClick"
          @pane-click="onPaneClick"
          class="pipeline-canvas"
        >
          <Background :gap="20" :size="1" pattern-color="hsl(var(--border))" />
          <MiniMap 
            :node-color="getNodeColor"
            class="pipeline-minimap"
          />
          <Controls class="pipeline-controls" />
        </VueFlow>
        
        <!-- Floating Actions -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-[hsl(var(--card))] backdrop-blur-sm border border-[hsl(var(--border))] rounded-lg shadow-lg">
          <button
            @click="handleFitView"
            class="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
            title="Fit View"
          >
            <Maximize2 class="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
          <div class="w-px h-6 bg-[hsl(var(--border))]" />
          <button
            @click="handleZoomIn"
            class="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
          >
            <ZoomIn class="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
          <span class="text-xs font-mono text-[hsl(var(--muted-foreground))] px-2 min-w-[50px] text-center">
            {{ zoomLevel }}%
          </span>
          <button
            @click="handleZoomOut"
            class="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
          >
            <ZoomOut class="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>
      </div>
      
      <!-- Node Details Panel -->
      <aside 
        v-if="selectedNode"
        class="w-80 border-l border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-y-auto flex-shrink-0"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-[hsl(var(--foreground))]">Node Details</h3>
            <button
              @click="closeNodeDetails"
              class="p-1 hover:bg-[hsl(var(--secondary))] rounded transition-colors"
            >
              <X class="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">ID</label>
              <div class="font-mono text-sm text-[hsl(var(--foreground))] bg-[hsl(var(--secondary)/0.5)] px-2 py-1.5 rounded">
                {{ selectedNode.id }}
              </div>
            </div>
            
            <div>
              <label class="text-xs font-medium text-[hsl(var(--foreground))] block mb-1">Label</label>
              <input
                v-model="nodeLabel"
                @input="updateNodeLabel"
                class="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
            
            <div>
              <label class="text-xs font-medium text-[hsl(var(--foreground))] block mb-1">Description</label>
              <textarea
                v-model="nodeDescription"
                @input="updateNodeDescription"
                rows="3"
                class="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
            
            <div class="pt-4 border-t border-[hsl(var(--border))]">
              <button
                @click="deleteSelectedNode"
                class="flex items-center gap-2 px-4 py-2 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.1)] rounded-lg text-sm font-medium w-full justify-center transition-colors"
              >
                <Trash2 class="w-4 h-4" />
                Delete Node
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
    
    <!-- Add Node Modal -->
    <Teleport to="body">
      <div 
        v-if="showAddNodeModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        @click.self="closeAddNodeModal"
      >
        <div class="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6 w-full max-w-md shadow-xl">
          <h2 class="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Add New Node</h2>
          
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">Node Type</label>
              <select
                v-model="newNodeType"
                class="w-full px-3 py-2.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              >
                <option v-for="nt in nodeTypes" :key="nt.type" :value="nt.type">
                  {{ nt.label }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">Label</label>
              <input
                v-model="newNodeLabel"
                class="w-full px-3 py-2.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                placeholder="Enter node label"
                @keyup.enter="addNewNode"
              />
            </div>
          </div>
          
          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="closeAddNodeModal"
              class="px-4 py-2.5 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="addNewNode"
              :disabled="!newNodeLabel.trim()"
              class="px-4 py-2.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg text-sm font-medium hover:bg-[hsl(var(--primary)/0.9)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Node
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, markRaw, onMounted, nextTick } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { Connection, NodeTypesObject, NodeComponent, Node as FlowNode } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import { storeToRefs } from 'pinia'

import { usePipelineStore } from '@/stores/pipeline'
import { useAgentsStore } from '@/stores/agents'
import { useToastStore } from '@/stores/toast'
import { useGlobalContextStore } from '@/stores/globalContext'

import { 
  Plus, Play, X, Trash2, Maximize2, ZoomIn, ZoomOut,
  Bot, Wrench, GitFork, Flag
} from 'lucide-vue-next'

import InputNode from '@/components/nodes/InputNode.vue'
import LLMAgentNode from '@/components/nodes/LLMAgentNode.vue'
import ToolAPINode from '@/components/nodes/ToolAPINode.vue'
import ConditionNode from '@/components/nodes/ConditionNode.vue'
import OutputNode from '@/components/nodes/OutputNode.vue'

// Stores
const pipelineStore = usePipelineStore()
const agentsStore = useAgentsStore()
const toastStore = useToastStore()
const globalStore = useGlobalContextStore()

const { pipelines } = storeToRefs(pipelineStore)
const { agents } = storeToRefs(agentsStore)

// VueFlow instance
const { fitView, zoomIn, zoomOut, addNodes, addEdges, getViewport, setViewport } = useVueFlow()

// State
const selectedPipelineId = ref(pipelines.value[0]?.id || '')
const selectedNode = ref<FlowNode | null>(null)
const nodeLabel = ref('')
const nodeDescription = ref('')
const showAddNodeModal = ref(false)
const newNodeType = ref('llm-agent')
const newNodeLabel = ref('')

// Flow data
const nodes = ref<FlowNode[]>([])
const edges = ref<any[]>([])

// Zoom level display
const zoomLevel = computed(() => {
  try {
    const viewport = getViewport()
    return Math.round(viewport.zoom * 100)
  } catch {
    return 100
  }
})

// Custom node type components
const customNodeTypes: NodeTypesObject = {
  input: markRaw(InputNode) as NodeComponent,
  'llm-agent': markRaw(LLMAgentNode) as NodeComponent,
  'tool-api': markRaw(ToolAPINode) as NodeComponent,
  condition: markRaw(ConditionNode) as NodeComponent,
  output: markRaw(OutputNode) as NodeComponent,
}

// Available node types for sidebar
const nodeTypes = [
  { type: 'input', label: 'Input', description: 'Start point', icon: Play, colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500/20' },
  { type: 'llm-agent', label: 'LLM Agent', description: 'AI processing', icon: Bot, colorClass: 'text-blue-500', bgClass: 'bg-blue-500/20' },
  { type: 'tool-api', label: 'Tool/API', description: 'External call', icon: Wrench, colorClass: 'text-purple-500', bgClass: 'bg-purple-500/20' },
  { type: 'condition', label: 'Condition', description: 'Branch logic', icon: GitFork, colorClass: 'text-amber-500', bgClass: 'bg-amber-500/20' },
  { type: 'output', label: 'Output', description: 'End point', icon: Flag, colorClass: 'text-rose-500', bgClass: 'bg-rose-500/20' }
]

// Load pipeline data when selection changes
watch(selectedPipelineId, (newId) => {
  if (!newId) return
  
  const pipeline = pipelines.value.find(p => p.id === newId)
  if (pipeline) {
    nodes.value = pipeline.nodes.map(n => ({
      id: n.id,
      type: n.type,
      position: { ...n.position },
      data: { ...n.data }
    }))
    edges.value = pipeline.edges.map(e => ({ ...e }))
    selectedNode.value = null
    
    // Fit view after loading
    nextTick(() => {
      setTimeout(() => {
        try {
          fitView({ padding: 0.2 })
        } catch {
          // Ignore if fitView fails initially
        }
      }, 100)
    })
  }
}, { immediate: true })

// Update form when node is selected
watch(selectedNode, (node) => {
  if (node) {
    nodeLabel.value = node.data?.label || ''
    nodeDescription.value = node.data?.description || ''
  }
})

// Connection validation
function isValidConnection(connection: Connection): boolean {
  const sourceNode = nodes.value.find((n) => n.id === connection.source)
  const targetNode = nodes.value.find((n) => n.id === connection.target)

  if (!sourceNode || !targetNode) return false

  if (sourceNode.type === 'input' && targetNode.type === 'output') {
    toastStore.error('Invalid connection', 'Input nodes must connect to Agents or logic nodes first.')
    return false
  }

  return true
}

// Event handlers
function onConnect(connection: Connection) {
  if (!isValidConnection(connection)) return

  const newEdge = {
    id: `e${connection.source}-${connection.target}`,
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle,
    targetHandle: connection.targetHandle,
    animated: true
  }
  
  addEdges([newEdge])
  
  if (selectedPipelineId.value) {
    pipelineStore.addEdge(selectedPipelineId.value, newEdge)
  }
}

function onNodeClick(event: { node: FlowNode }) {
  selectedNode.value = event.node
}

function onPaneClick() {
  selectedNode.value = null
}

function closeNodeDetails() {
  selectedNode.value = null
}

function updateNodeLabel() {
  if (!selectedNode.value || !selectedPipelineId.value) return
  
  const node = nodes.value.find(n => n.id === selectedNode.value?.id)
  if (node) {
    node.data = { ...node.data, label: nodeLabel.value }
  }
  
  pipelineStore.updateNode(selectedPipelineId.value, selectedNode.value.id, {
    label: nodeLabel.value
  })
}

function updateNodeDescription() {
  if (!selectedNode.value || !selectedPipelineId.value) return
  
  const node = nodes.value.find(n => n.id === selectedNode.value?.id)
  if (node) {
    node.data = { ...node.data, description: nodeDescription.value }
  }
  
  pipelineStore.updateNode(selectedPipelineId.value, selectedNode.value.id, {
    description: nodeDescription.value
  })
}

function deleteSelectedNode() {
  if (!selectedNode.value || !selectedPipelineId.value) return
  
  const nodeId = selectedNode.value.id
  
  pipelineStore.removeNode(selectedPipelineId.value, nodeId)
  nodes.value = nodes.value.filter(n => n.id !== nodeId)
  edges.value = edges.value.filter(e => e.source !== nodeId && e.target !== nodeId)
  selectedNode.value = null
  
  toastStore.success('Node deleted', 'The node has been removed from the pipeline')
}

// Add node modal handlers
function openAddNodeModal() {
  showAddNodeModal.value = true
  newNodeLabel.value = ''
  newNodeType.value = 'llm-agent'
}

function closeAddNodeModal() {
  showAddNodeModal.value = false
  newNodeLabel.value = ''
}

function addNewNode() {
  if (!newNodeLabel.value.trim()) return
  
  const viewport = getViewport()
  const newNode = {
    id: `node_${Date.now()}`,
    type: newNodeType.value,
    position: { 
      x: (300 - viewport.x) / viewport.zoom,
      y: (200 - viewport.y) / viewport.zoom
    },
    data: { label: newNodeLabel.value.trim(), description: '' }
  }
  
  addNodes([newNode])
  
  if (selectedPipelineId.value) {
    pipelineStore.addNode(selectedPipelineId.value, newNode as any)
  }
  
  toastStore.success('Node added', `${newNodeLabel.value} has been added to the pipeline`)
  globalStore.addActivity({
    type: 'agent_created',
    entityName: newNodeLabel.value
  })
  
  closeAddNodeModal()
}

// Drag and drop handlers
function onDragStart(event: DragEvent, type: string) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }
}

function onDrop(event: DragEvent) {
  const type = event.dataTransfer?.getData('application/vueflow')
  if (!type) return
  
  const nodeType = nodeTypes.find(nt => nt.type === type)
  if (!nodeType) return
  
  const canvas = (event.target as HTMLElement).closest('.vue-flow')
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const viewport = getViewport()
  
  const position = {
    x: (event.clientX - rect.left - viewport.x) / viewport.zoom,
    y: (event.clientY - rect.top - viewport.y) / viewport.zoom
  }
  
  const newNode = {
    id: `node_${Date.now()}`,
    type,
    position,
    data: { label: `New ${nodeType.label}`, description: '' }
  }
  
  addNodes([newNode])
  
  if (selectedPipelineId.value) {
    pipelineStore.addNode(selectedPipelineId.value, newNode as any)
  }
  
  toastStore.success('Node added', `${nodeType.label} node dropped onto canvas`)
}

// Minimap color function
function getNodeColor(node: FlowNode): string {
  const colors: Record<string, string> = {
    'input': '#10b981',
    'llm-agent': '#3b82f6',
    'tool-api': '#a855f7',
    'condition': '#f59e0b',
    'output': '#f43f5e'
  }
  return colors[node.type || ''] || '#6b7280'
}

// Zoom controls
function handleFitView() {
  fitView({ padding: 0.2 })
}

function handleZoomIn() {
  zoomIn()
}

function handleZoomOut() {
  zoomOut()
}

// Run pipeline
function runPipeline() {
  const pipeline = pipelines.value.find(p => p.id === selectedPipelineId.value)
  toastStore.info('Pipeline started', 'Executing all nodes in sequence...')
  globalStore.addActivity({
    type: 'task_completed',
    entityName: pipeline?.name || 'Pipeline'
  })
}
</script>

<style>
/* VueFlow custom styles */
.pipeline-canvas {
  background-color: hsl(var(--background));
}

.pipeline-minimap {
  background-color: hsl(var(--card)) !important;
  border: 1px solid hsl(var(--border)) !important;
  border-radius: 0.5rem !important;
}

.pipeline-controls {
  background-color: hsl(var(--card)) !important;
  border: 1px solid hsl(var(--border)) !important;
  border-radius: 0.5rem !important;
}

.pipeline-controls button {
  background-color: hsl(var(--card)) !important;
  border-color: hsl(var(--border)) !important;
  color: hsl(var(--foreground)) !important;
}

.pipeline-controls button:hover {
  background-color: hsl(var(--secondary)) !important;
}

.vue-flow__minimap-mask {
  fill: hsl(240 6% 7% / 0.7);
}

.vue-flow__edge-path {
  stroke: hsl(var(--muted-foreground));
  stroke-width: 2;
}

.vue-flow__edge.selected .vue-flow__edge-path {
  stroke: hsl(var(--primary));
  stroke-width: 3;
}

.vue-flow__connection-line {
  stroke: hsl(var(--primary));
  stroke-width: 2;
}
.vue-flow__node {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
