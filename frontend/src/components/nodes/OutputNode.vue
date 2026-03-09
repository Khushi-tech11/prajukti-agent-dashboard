<template>
  <div
    :class="[
      'px-4 py-3 rounded-lg border min-w-[220px] transition-colors duration-150',
      'bg-[hsl(var(--card))]',
      selected ? 'border-rose-500 shadow-md shadow-rose-500/20' : 'border-[hsl(var(--border))]'
    ]"
  >
    <Handle
      type="target"
      :position="Position.Left"
      class="!w-3 !h-3 !bg-[hsl(var(--muted))] !border-2 !border-[hsl(var(--muted-foreground))] hover:!bg-rose-500 hover:!border-rose-400 transition-all"
    />

    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-md bg-rose-500/20">
          <Flag class="w-4 h-4 text-rose-400" />
        </div>
        <span class="text-xs font-medium text-rose-400 uppercase tracking-wide">Output</span>
      </div>

      <div v-if="data.status" class="flex items-center gap-1.5">
        <div
          :class="[
            'w-2 h-2 rounded-full',
            data.status === 'running'   ? 'bg-amber-500 animate-pulse' :
            data.status === 'completed' ? 'bg-emerald-500' :
            data.status === 'error'     ? 'bg-red-500' : 'bg-[hsl(var(--muted))]'
          ]"
        />
        <span class="text-[10px] font-mono text-[hsl(var(--muted-foreground))] uppercase">
          {{ data.status }}
        </span>
      </div>
    </div>

    <div class="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">{{ data.label }}</div>
    <div v-if="data.description" class="text-xs text-[hsl(var(--muted-foreground))]">
      {{ data.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { Flag } from 'lucide-vue-next'

defineProps<{
  data: {
    label: string
    description?: string
    status?: 'idle' | 'running' | 'completed' | 'error'
  }
  selected?: boolean
}>()
</script>
