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
  { name: 'Dashboard',       icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Agent Builder',   icon: Bot,             path: '/dashboard/agents' },
  { name: 'Tool Library',    icon: Wrench,          path: '/dashboard/tools' },
  { name: 'Pipeline Builder',icon: GitBranch,       path: '/dashboard/pipelines' },
  { name: 'Task Input',      icon: Play,            path: '/dashboard/tasks' },
  { name: 'Activity Log',    icon: Activity,        path: '/dashboard/activity' },
  { name: 'Analytics',       icon: BarChart3,       path: '/dashboard/analytics' },
]

const bottomNavItems = [
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
]

const isActive = (path: string) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}

const navigate = (path: string) => router.push(path)
</script>

<template>
  <aside 
    :class="[
      'relative flex flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-300 ease-in-out',
      collapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- Collapse Toggle -->
    <button
      @click="emit('toggle')"
      class="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] shadow-md transition-all duration-200 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] hover:scale-110"
    >
      <PanelLeftClose v-if="!collapsed" class="h-3.5 w-3.5" />
      <PanelLeft      v-else            class="h-3.5 w-3.5" />
    </button>

    <!-- Logo -->
    <div class="flex h-16 items-center gap-3 border-b border-[hsl(var(--border))] px-4 overflow-hidden">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#14532d] flex-shrink-0 shadow-[0_0_14px_rgba(20,83,45,0.7)] border border-emerald-700/40">
        <Sparkles class="h-5 w-5 text-emerald-200" />
      </div>
      <Transition name="fade">
        <span v-if="!collapsed" class="text-lg font-semibold text-[hsl(var(--foreground))] whitespace-nowrap">
          AgentFlow
        </span>
      </Transition>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-0.5 p-3 overflow-hidden">
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="navigate(item.path)"
        :title="collapsed ? item.name : undefined"
        class="relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
        :class="[
          collapsed ? 'justify-center' : '',
          isActive(item.path)
            ? 'bg-[#14532d] text-emerald-100 shadow-[0_2px_16px_rgba(20,83,45,0.6)] border border-emerald-800/60'
            : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]'
        ]"
      >
        <!-- Active left-edge glow bar (only when expanded) -->
        <span
          v-if="isActive(item.path) && !collapsed"
          class="absolute left-0 inset-y-2 w-0.5 rounded-r bg-[#0a1a0d]/40"
        />

        <!-- Icon -->
        <component
          :is="item.icon"
          class="h-4.5 w-4.5 shrink-0 transition-transform duration-200"
          :class="isActive(item.path) ? 'scale-110 text-emerald-300' : ''"
        />

        <Transition name="fade">
          <span v-if="!collapsed" class="whitespace-nowrap font-semibold">{{ item.name }}</span>
        </Transition>

        <!-- Active dot for collapsed mode -->
        <span
          v-if="isActive(item.path) && collapsed"
          class="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-emerald-600"
        />
      </button>
    </nav>

    <!-- Bottom -->
    <div class="border-t border-[hsl(var(--border))] p-3 overflow-hidden">
      <!-- Workspace Sync -->
      <Transition name="fade">
        <div
          v-if="!collapsed"
          class="mb-3 rounded-xl border border-[#14532d]/80 bg-[#0a1a0d]/60 px-3 py-2.5 space-y-2"
        >
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-emerald-400">Workspace Sync</span>
            <span class="px-1.5 py-0.5 rounded-full bg-[#14532d]/60 text-emerald-500 text-[10px] font-mono font-medium">PRO</span>
          </div>
          <div class="h-1.5 w-full rounded-full bg-[hsl(var(--secondary))] overflow-hidden">
            <div class="h-full w-3/4 rounded-full bg-[#15803d] shadow-[0_0_8px_rgba(20,83,45,0.5)]" />
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
        class="relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
        :class="[
          collapsed ? 'justify-center' : '',
          isActive(item.path)
            ? 'bg-[#14532d] text-emerald-100 shadow-[0_2px_16px_rgba(20,83,45,0.6)] border border-emerald-800/60'
            : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]'
        ]"
      >
        <component
          :is="item.icon"
          class="h-4.5 w-4.5 shrink-0 transition-transform duration-200"
          :class="isActive(item.path) ? 'scale-110 text-emerald-300' : ''"
        />
        <Transition name="fade">
          <span v-if="!collapsed" class="whitespace-nowrap font-semibold">{{ item.name }}</span>
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