<template>
  <div >
  <div
    :class="[
      'px-4 py-3 rounded-lg border min-w-[200px] transition-all duration-150',
      'bg-[hsl(var(--card))]',
      selected ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500/30' : 'border-[hsl(var(--border))] hover:border-emerald-500/50'
    ]"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-md bg-emerald-500/20">
          <Play class="w-4 h-4 text-emerald-400" />
        </div>
        <span class="text-xs font-medium text-emerald-400 uppercase tracking-wide">Input</span>
      </div>
    </div>

    <div class="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">{{ data.label }}</div>
    <div v-if="data.description" class="text-xs text-[hsl(var(--muted-foreground))] mb-3 leading-relaxed">
      {{ data.description }}
    </div>

    <button
      @click.stop="emit('run-from-here')"
      class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-md transition-colors"
    >
      <Play class="w-3 h-3" />
      Run from here
    </button>

    <Handle
      type="source"
      :position="Position.Right"
      class="!w-3 !h-3 !bg-emerald-500 !border-2 !border-emerald-400 hover:!scale-125 transition-transform"
    />
  </div>
</div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { Play } from 'lucide-vue-next'

defineProps<{
  data: {
    label: string
    description?: string
  }
  selected?: boolean
}>()

const emit = defineEmits<{
  'run-from-here': []
}>()
</script>

<style scoped>
.vue-flow__node {
  background: red !important;
  border: none !important;
  box-shadow: none !important;
}
</style>