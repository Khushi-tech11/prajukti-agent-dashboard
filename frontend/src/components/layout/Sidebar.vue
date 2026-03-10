<script setup lang="ts">
import { computed, ref } from 'vue'
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
  BarChart3,
  X,
  Check
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

const showPlansModal = ref(false)
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
    <div class="border-t border-[hsl(var(--border))] p-3 overflow-hidden space-y-3">
      <!-- Plan Status -->
      <Transition name="fade">
        <div
          v-if="!collapsed"
          class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 py-2.5 space-y-2"
        >
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-[hsl(var(--foreground))]">Your Plan</span>
            <span class="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-medium">PRO</span>
          </div>
          <p class="text-[10px] text-[hsl(var(--muted-foreground))]">
            Unlimited agents & pipelines
          </p>
          <button @click="showPlansModal = true" class="w-full text-[10px] px-2 py-1.5 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity cursor-pointer font-medium">
            View Plan Details
          </button>
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

    <!-- Plans Modal -->
    <Teleport to="body">
      <div v-if="showPlansModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="showPlansModal = false">
        <div class="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-2xl shadow-xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
            <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Available Plans</h2>
            <button @click="showPlansModal = false" class="p-1 hover:bg-[hsl(var(--secondary))] rounded-lg cursor-pointer">
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Free Tier -->
              <div class="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6">
                <h3 class="text-lg font-bold text-[hsl(var(--foreground))] mb-2">Free</h3>
                <p class="text-3xl font-bold text-[hsl(var(--foreground))] mb-4">₹0</p>
                <ul class="space-y-2 mb-6 text-sm text-[hsl(var(--muted-foreground))]">
                  <li class="flex items-center gap-2"><Check class="h-4 w-4 text-emerald-500" /> 2 Active Agents</li>
                  <li class="flex items-center gap-2"><Check class="h-4 w-4 text-emerald-500" /> Basic Analytics</li>
                  <li class="flex items-center gap-2"><Check class="h-4 w-4 text-emerald-500" /> Community Support</li>
                </ul>
                <button class="w-full px-4 py-2 text-sm font-medium rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] cursor-pointer">
                  Current Plan
                </button>
              </div>

              <!-- Pro Tier (Current) -->
              <div class="rounded-lg border-2 border-emerald-500/50 bg-[hsl(var(--background))] p-6 relative">
                <div class="absolute -top-3 left-4 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                  Current
                </div>
                <h3 class="text-lg font-bold text-[hsl(var(--foreground))] mb-2 mt-2">Pro</h3>
                <p class="text-3xl font-bold text-[hsl(var(--foreground))] mb-4">₹3,999<span class="text-sm text-[hsl(var(--muted-foreground))]">/mo</span></p>
                <ul class="space-y-2 mb-6 text-sm text-[hsl(var(--muted-foreground))]">
                  <li class="flex items-center gap-2"><Check class="h-4 w-4 text-emerald-500" /> Unlimited Agents</li>
                  <li class="flex items-center gap-2"><Check class="h-4 w-4 text-emerald-500" /> Advanced Analytics</li>
                  <li class="flex items-center gap-2"><Check class="h-4 w-4 text-emerald-500" /> Priority Support</li>
                </ul>
                <button class="w-full px-4 py-2 text-sm font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer">
                  Active Plan
                </button>
              </div>

              <!-- Enterprise -->
              <div class="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6">
                <h3 class="text-lg font-bold text-[hsl(var(--foreground))] mb-2">Enterprise</h3>
                <p class="text-3xl font-bold text-[hsl(var(--foreground))] mb-4">Custom</p>
                <ul class="space-y-2 mb-6 text-sm text-[hsl(var(--muted-foreground))]">
                  <li class="flex items-center gap-2"><Check class="h-4 w-4 text-emerald-500" /> Unlimited Everything</li>
                  <li class="flex items-center gap-2"><Check class="h-4 w-4 text-emerald-500" /> Dedicated Support</li>
                  <li class="flex items-center gap-2"><Check class="h-4 w-4 text-emerald-500" /> SLA Guarantee</li>
                </ul>
                <button class="w-full px-4 py-2 text-sm font-medium rounded-lg border border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.1)] cursor-pointer">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
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
