<template>
  <div class="flex items-center gap-4 px-3 py-1.5 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))]">
    <!-- Connection Status -->
    <div class="flex items-center gap-2">
      <div 
        :class="[
          'w-2 h-2 rounded-full',
          context.status === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
          context.status === 'syncing' ? 'bg-amber-500 animate-pulse' : 
          'bg-red-500'
        ]"
      />
      <span class="text-xs text-[hsl(var(--muted-foreground))] font-mono">
        {{ context.status.toUpperCase() }}
      </span>
    </div>
    
    <div class="h-4 w-px bg-[hsl(var(--border))]" />
    
    <!-- Quick Stats -->
    <div class="flex items-center gap-3 text-xs">
      <div class="flex items-center gap-1.5">
        <Bot class="w-3.5 h-3.5 text-emerald-500" />
        <span class="font-mono text-[hsl(var(--foreground))]">{{ context.agents }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <Zap class="w-3.5 h-3.5 text-amber-500" />
        <span class="font-mono text-[hsl(var(--foreground))]">{{ context.tasks }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <GitBranch class="w-3.5 h-3.5 text-blue-500" />
        <span class="font-mono text-[hsl(var(--foreground))]">{{ context.pipelines }}</span>
      </div>
    </div>
    
    <!-- Sync Button -->
    <button
      @click="globalStore.syncAll()"
      :disabled="context.status === 'syncing'"
      class="p-1 hover:bg-[hsl(var(--secondary))] rounded transition-colors disabled:opacity-50"
    >
      <RefreshCw 
        :class="[
          'w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]',
          context.status === 'syncing' && 'animate-spin'
        ]" 
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGlobalContextStore } from '@/stores/globalContext'
import { Bot, Zap, GitBranch, RefreshCw } from 'lucide-vue-next'

const globalStore = useGlobalContextStore()
const { contextSummary: context } = storeToRefs(globalStore)
</script>
