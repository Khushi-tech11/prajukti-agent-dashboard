<template>
  <div 
    :class="[
      'px-4 py-3 rounded-lg border min-w-[200px] transition-all duration-150',
      'bg-[hsl(var(--card))]',
      selected ? 'border-purple-500 shadow-lg shadow-purple-500/20 ring-1 ring-purple-500/30' : 'border-[hsl(var(--border))] hover:border-purple-500/50'
    ]"
  >
    <!-- Input Handle -->
    <Handle
      type="target"
      :position="Position.Left"
      class="!w-3 !h-3 !bg-[hsl(var(--muted))] !border-2 !border-[hsl(var(--muted-foreground))] hover:!bg-purple-500 hover:!border-purple-400 transition-all"
    />
    
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-md bg-purple-500/20">
          <Wrench class="w-4 h-4 text-purple-500" />
        </div>
        <span class="text-xs font-medium text-purple-500 uppercase tracking-wide">Tool/API</span>
      </div>
      
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
    <div v-if="data.toolId" class="text-[10px] font-mono text-[hsl(var(--muted-foreground))] bg-[hsl(var(--secondary)/0.5)] px-1.5 py-0.5 rounded inline-block">
      {{ data.toolId }}
    </div>
    
    <!-- Output Handle -->
    <Handle
      type="source"
      :position="Position.Right"
      class="!w-3 !h-3 !bg-purple-500 !border-2 !border-purple-400 hover:!scale-125 transition-transform"
    />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { Wrench } from 'lucide-vue-next'

defineProps<{
  data: {
    label: string
    toolId?: string
    status?: 'idle' | 'running' | 'completed' | 'error'
  }
  selected?: boolean
}>()
</script>
