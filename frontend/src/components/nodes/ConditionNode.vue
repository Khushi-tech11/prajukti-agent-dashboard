<template>
  <div 
    :class="[
      'px-4 py-3 rounded-lg border-2 min-w-[200px] transition-all duration-200',
      selected ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-[hsl(var(--border))]',
      'bg-gradient-to-br from-amber-950/50 to-[hsl(var(--card))]'
    ]"
  >
    <!-- Input Handle -->
    <Handle
      type="target"
      :position="Position.Left"
      class="!w-3 !h-3 !bg-muted !border-2 !border-muted-foreground hover:!bg-amber-500 hover:!border-amber-400 transition-all"
    />
    
    <div class="flex items-center gap-2 mb-2">
      <div class="p-1.5 rounded-md bg-amber-500/20">
        <GitFork class="w-4 h-4 text-amber-500" />
      </div>
      <span class="text-xs font-medium text-amber-500 uppercase tracking-wide">
        {{ data.conditionType || 'If/Else' }}
      </span>
    </div>
    
    <div class="text-sm font-medium text-foreground mb-2">{{ data.label }}</div>
    
    <div v-if="data.conditionExpression" class="text-[10px] font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded mb-2">
      {{ data.conditionExpression }}
    </div>
    
    <!-- Output Handles with Labels -->
    <div class="flex flex-col gap-2 mt-3">
      <div class="flex items-center justify-end gap-2">
        <span class="text-[10px] font-medium text-emerald-500">TRUE</span>
        <Handle
          id="true"
          type="source"
          :position="Position.Right"
          :style="{ top: '60%' }"
          class="!w-3 !h-3 !bg-emerald-500 !border-2 !border-emerald-400 hover:!scale-125 transition-transform !relative !transform-none"
        />
      </div>
      <div class="flex items-center justify-end gap-2">
        <span class="text-[10px] font-medium text-red-500">FALSE</span>
        <Handle
          id="false"
          type="source"
          :position="Position.Right"
          :style="{ top: '80%' }"
          class="!w-3 !h-3 !bg-red-500 !border-2 !border-red-400 hover:!scale-125 transition-transform !relative !transform-none"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { GitFork } from 'lucide-vue-next'

defineProps<{
  data: {
    label: string
    conditionType?: 'if-else' | 'switch'
    conditionExpression?: string
  }
  selected?: boolean
}>()
</script>
