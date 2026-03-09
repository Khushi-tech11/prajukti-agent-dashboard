import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Node, Edge } from '@vue-flow/core'

export type NodeType = 'input' | 'llm-agent' | 'tool-api' | 'condition' | 'output'

export interface PipelineNode extends Node {
  type: NodeType
  data: {
    label: string
    description?: string
    config?: Record<string, unknown>
    status?: 'idle' | 'running' | 'completed' | 'error'
    agentId?: string
    toolId?: string
    conditionType?: 'if-else' | 'switch'
    conditionExpression?: string
  }
}

export interface Pipeline {
  id: string
  name: string
  description?: string
  nodes: PipelineNode[]
  edges: Edge[]
  status: 'draft' | 'active' | 'paused'
  createdAt: Date
  updatedAt: Date
  lastRunAt?: Date
  executionCount: number
}

export const usePipelineStore = defineStore('pipeline', () => {
  const pipelines = ref<Pipeline[]>([
    {
      id: 'pipeline_1',
      name: 'Customer Support Flow',
      description: 'Automated customer support with escalation',
      nodes: [
        {
          id: 'node_1',
          type: 'input',
          position: { x: 50, y: 200 },
          data: { label: 'Customer Query', description: 'Receives incoming support tickets' }
        },
        {
          id: 'node_2',
          type: 'llm-agent',
          position: { x: 250, y: 200 },
          data: { label: 'Classifier Agent', description: 'Classifies ticket priority', agentId: 'agent_1' }
        },
        {
          id: 'node_3',
          type: 'condition',
          position: { x: 450, y: 200 },
          data: { 
            label: 'Priority Check', 
            conditionType: 'if-else',
            conditionExpression: 'priority === "high"'
          }
        },
        {
          id: 'node_4',
          type: 'llm-agent',
          position: { x: 650, y: 100 },
          data: { label: 'Senior Agent', description: 'Handles high priority', agentId: 'agent_2' }
        },
        {
          id: 'node_5',
          type: 'llm-agent',
          position: { x: 650, y: 300 },
          data: { label: 'Auto Responder', description: 'Handles low priority', agentId: 'agent_3' }
        },
        {
          id: 'node_6',
          type: 'output',
          position: { x: 850, y: 200 },
          data: { label: 'Response Output', description: 'Sends response to customer' }
        }
      ],
      edges: [
        { id: 'e1-2', source: 'node_1', target: 'node_2', animated: true },
        { id: 'e2-3', source: 'node_2', target: 'node_3' },
        { id: 'e3-4', source: 'node_3', target: 'node_4', label: 'High', sourceHandle: 'true' },
        { id: 'e3-5', source: 'node_3', target: 'node_5', label: 'Low', sourceHandle: 'false' },
        { id: 'e4-6', source: 'node_4', target: 'node_6' },
        { id: 'e5-6', source: 'node_5', target: 'node_6' }
      ],
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date(),
      lastRunAt: new Date(),
      executionCount: 1247
    },
    {
      id: 'pipeline_2',
      name: 'Content Generation',
      description: 'Multi-step content creation pipeline',
      nodes: [
        {
          id: 'node_1',
          type: 'input',
          position: { x: 50, y: 150 },
          data: { label: 'Topic Input', description: 'Content topic and requirements' }
        },
        {
          id: 'node_2',
          type: 'llm-agent',
          position: { x: 250, y: 150 },
          data: { label: 'Research Agent', description: 'Gathers information', agentId: 'agent_4' }
        },
        {
          id: 'node_3',
          type: 'tool-api',
          position: { x: 450, y: 150 },
          data: { label: 'Web Search API', toolId: 'tool_1' }
        },
        {
          id: 'node_4',
          type: 'llm-agent',
          position: { x: 650, y: 150 },
          data: { label: 'Writer Agent', description: 'Creates content', agentId: 'agent_5' }
        },
        {
          id: 'node_5',
          type: 'output',
          position: { x: 850, y: 150 },
          data: { label: 'Final Content', description: 'Polished article output' }
        }
      ],
      edges: [
        { id: 'e1-2', source: 'node_1', target: 'node_2', animated: true },
        { id: 'e2-3', source: 'node_2', target: 'node_3' },
        { id: 'e3-4', source: 'node_3', target: 'node_4' },
        { id: 'e4-5', source: 'node_4', target: 'node_5' }
      ],
      status: 'active',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date(),
      executionCount: 523
    }
  ])
  
  const activePipeline = ref<Pipeline | null>(null)
  const selectedNodeId = ref<string | null>(null)
  
  const activePipelines = computed(() => 
    pipelines.value.filter(p => p.status === 'active')
  )
  
  const totalExecutions = computed(() => 
    pipelines.value.reduce((sum, p) => sum + p.executionCount, 0)
  )
  
  function selectPipeline(id: string) {
    const pipeline = pipelines.value.find(p => p.id === id)
    if (pipeline) {
      activePipeline.value = pipeline
    }
  }
  
  function createPipeline(name: string, description?: string): Pipeline {
    const newPipeline: Pipeline = {
      id: `pipeline_${Date.now()}`,
      name,
      description,
      nodes: [],
      edges: [],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0
    }
    pipelines.value.push(newPipeline)
    return newPipeline
  }
  
  function addNode(pipelineId: string, node: PipelineNode) {
    const pipeline = pipelines.value.find(p => p.id === pipelineId)
    if (pipeline) {
      pipeline.nodes.push(node)
      pipeline.updatedAt = new Date()
    }
  }
  
  function updateNode(pipelineId: string, nodeId: string, data: Partial<PipelineNode['data']>) {
    const pipeline = pipelines.value.find(p => p.id === pipelineId)
    if (pipeline) {
      const node = pipeline.nodes.find(n => n.id === nodeId)
      if (node) {
        node.data = { ...node.data, ...data }
        pipeline.updatedAt = new Date()
      }
    }
  }
  
  function removeNode(pipelineId: string, nodeId: string) {
    const pipeline = pipelines.value.find(p => p.id === pipelineId)
    if (pipeline) {
      pipeline.nodes = pipeline.nodes.filter(n => n.id !== nodeId)
      pipeline.edges = pipeline.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
      pipeline.updatedAt = new Date()
    }
  }
  
  function addEdge(pipelineId: string, edge: Edge) {
    const pipeline = pipelines.value.find(p => p.id === pipelineId)
    if (pipeline) {
      pipeline.edges.push(edge)
      pipeline.updatedAt = new Date()
    }
  }
  
  function removeEdge(pipelineId: string, edgeId: string) {
    const pipeline = pipelines.value.find(p => p.id === pipelineId)
    if (pipeline) {
      pipeline.edges = pipeline.edges.filter(e => e.id !== edgeId)
      pipeline.updatedAt = new Date()
    }
  }
  
  function runFromNode(pipelineId: string, nodeId: string) {
    const pipeline = pipelines.value.find(p => p.id === pipelineId)
    if (pipeline) {
      // Simulate running from specific node
      const nodeIndex = pipeline.nodes.findIndex(n => n.id === nodeId)
      if (nodeIndex > -1) {
        // Mark nodes from this point as running
        for (let i = nodeIndex; i < pipeline.nodes.length; i++) {
          pipeline.nodes[i].data.status = 'running'
        }
        pipeline.executionCount++
        pipeline.lastRunAt = new Date()
      }
    }
  }
  
  return {
    pipelines,
    activePipeline,
    selectedNodeId,
    activePipelines,
    totalExecutions,
    selectPipeline,
    createPipeline,
    addNode,
    updateNode,
    removeNode,
    addEdge,
    removeEdge,
    runFromNode
  }
})
