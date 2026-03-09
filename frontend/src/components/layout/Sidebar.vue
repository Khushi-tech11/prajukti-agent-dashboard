<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  LayoutDashboard, 
  Bot, 
  Wrench, 
  GitBranch, 
  Play, 
  Activity, 
  Settings,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  BarChart3
} from 'lucide-vue-next'

interface Props {
  collapsed: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  toggle: []
}>()

const route = useRoute()
const router = useRouter()

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Agent Builder', icon: Bot, path: '/dashboard/agents' },
  { name: 'Tool Library', icon: Wrench, path: '/dashboard/tools' },
  { name: 'Pipeline Builder', icon: GitBranch, path: '/dashboard/pipelines' },
  { name: 'Task Input', icon: Play, path: '/dashboard/tasks' },
  { name: 'Activity Log', icon: Activity, path: '/dashboard/activity' },
  { name: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
]

const bottomNavItems = [
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
]

const isActive = (path: string) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(path)
}

const navigate = (path: string) => {
  router.push(path)
}
</script>

<template>
  <aside 
    :class="[
      'relative flex flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-300 ease-in-out',
      collapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- Collapse Toggle Button - Floating on edge -->
    <button
      @click="emit('toggle')"
      class="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] shadow-md transition-all duration-200 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] hover:scale-110"
    >
      <PanelLeftClose v-if="!collapsed" class="h-3.5 w-3.5" />
      <PanelLeft v-else class="h-3.5 w-3.5" />
    </button>

    <!-- Logo -->
    <div class="flex h-16 items-center gap-3 border-b border-[hsl(var(--border))] px-4 overflow-hidden">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--primary))] flex-shrink-0">
        <Sparkles class="h-5 w-5 text-[hsl(var(--primary-foreground))]" />
      </div>
      <Transition name="fade">
        <span 
          v-if="!collapsed" 
          class="text-lg font-semibold text-[hsl(var(--foreground))] whitespace-nowrap"
        >
          AgentFlow
        </span>
      </Transition>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1 p-3 overflow-hidden">
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="navigate(item.path)"
        :title="collapsed ? item.name : undefined"
        :class="[
          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
          collapsed ? 'justify-center' : '',
          isActive(item.path)
            ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
            : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]'
        ]"
      >
        <component :is="item.icon" class="h-5 w-5 shrink-0" />
        <Transition name="fade">
          <span v-if="!collapsed" class="whitespace-nowrap">{{ item.name }}</span>
        </Transition>
      </button>
    </nav>

    <!-- Bottom Navigation -->
    <div class="border-t border-[hsl(var(--border))] p-3 overflow-hidden">
      <!-- Workspace Sync / Plan Summary -->
      <Transition name="fade">
        <div
          v-if="!collapsed"
          class="mb-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 py-2 space-y-2"
        >
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-[hsl(var(--foreground))]">Workspace Sync</span>
            <span class="text-[hsl(var(--muted-foreground))]">PRO</span>
          </div>
          <div class="h-1.5 w-full rounded-full bg-[hsl(var(--muted))] overflow-hidden">
            <div class="h-full w-3/4 rounded-full bg-emerald-500"></div>
          </div>
          <p class="text-[10px] text-[hsl(var(--muted-foreground))]">
            Nodes, agents & logs stay in sync across tabs.
          </p>
        </div>
      </Transition>

      <button
        v-for="item in bottomNavItems"
        :key="item.path"
        @click="navigate(item.path)"
        :title="collapsed ? item.name : undefined"
        :class="[
          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
          collapsed ? 'justify-center' : '',
          isActive(item.path)
            ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
            : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]'
        ]"
      >
        <component :is="item.icon" class="h-5 w-5 shrink-0" />
        <Transition name="fade">
          <span v-if="!collapsed" class="whitespace-nowrap">{{ item.name }}</span>
        </Transition>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
