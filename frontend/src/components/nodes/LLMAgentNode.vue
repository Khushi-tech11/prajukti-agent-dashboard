<template>
  <div 
    :class="[
      'px-4 py-3 rounded-lg border min-w-[200px] transition-all duration-150',
      'bg-[hsl(var(--card))]',
      selected ? 'border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/30' : 'border-[hsl(var(--border))] hover:border-blue-500/50'
    ]"
  >
    <!-- Input Handle -->
    <Handle
      type="target"
      :position="Position.Left"
      class="!w-3 !h-3 !bg-[hsl(var(--muted))] !border-2 !border-[hsl(var(--muted-foreground))] hover:!bg-blue-500 hover:!border-blue-400 transition-all"
    />
    
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-md bg-blue-500/20">
          <Bot class="w-4 h-4 text-blue-500" />
        </div>
        <span class="text-xs font-medium text-blue-500 uppercase tracking-wide">Agent</span>
      </div>
      
      <!-- Status Indicator -->
      <div v-if="data.status" class="flex items-center gap-1.5">
        <div 
          :class="[
            'w-2 h-2 rounded-full',
            data.status === 'running' ? 'bg-amber-500 animate-pulse' :
            data.status === 'completed' ? 'bg-emerald-500' :
            data.status === 'error' ? 'bg-red-500' : 'bg-[hsl(var(--muted))]'
          ]"
        />
        <span class="text-[10px] font-mono text-[hsl(var(--muted-foreground))] uppercase">
          {{ data.status }}
        </span>
      </div>
    </div>
    
    <div class="text-sm font-medium text-[hsl(var(--foreground))] mb-1">{{ data.label }}</div>
    <div v-if="data.description" class="text-xs text-[hsl(var(--muted-foreground))] mb-3 leading-relaxed">
      {{ data.description }}
    </div>
    
    <!-- Run from here button -->
    <button
      @click.stop="emit('run-from-here')"
      class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
    >
      <Play class="w-3 h-3" />
      Run from here
    </button>
    
    <!-- Output Handle -->
    <Handle
      type="source"
      :position="Position.Right"
      class="!w-3 !h-3 !bg-blue-500 !border-2 !border-blue-400 hover:!scale-125 transition-transform"
    />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { Bot, Play } from 'lucide-vue-next'

defineProps<{
  data: {
    label: string
    description?: string
    agentId?: string
    status?: 'idle' | 'running' | 'completed' | 'error'
  }
  selected?: boolean
}>()

const emit = defineEmits<{
  'run-from-here': []
}>()
</script>
