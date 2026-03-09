<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Menu, Search, Bell, User, LogOut, X, Check, Zap,
  Crown, Clock, AlertCircle, CheckCircle2
} from 'lucide-vue-next'
import GlobalContextIndicator from '@/components/ui/GlobalContextIndicator.vue'

const emit = defineEmits<{ 'toggle-sidebar': [] }>()

const route  = useRoute()
const router = useRouter()

const searchQuery           = ref('')
const showUserMenu          = ref(false)
const showProModal          = ref(false)
const showNotifications     = ref(false)

// refs for anchoring the notification panel
const bellBtnRef            = ref<HTMLButtonElement | null>(null)
const notificationPanelRef  = ref<HTMLDivElement | null>(null)

const pageTitle: Record<string, string> = {
  '/dashboard':           'Dashboard',
  '/dashboard/agents':    'Agent Builder',
  '/dashboard/tools':     'Tool Library',
  '/dashboard/pipelines': 'Pipeline Builder',
  '/dashboard/tasks':     'Task Input',
  '/dashboard/activity':  'Activity Log',
  '/dashboard/settings':  'Settings',
}
const currentTitle = () => pageTitle[route.path] ?? 'Dashboard'

const handleLogout = () => router.push('/')

// Close panel when clicking outside
function handleClickOutside(e: MouseEvent) {
  if (
    showNotifications.value &&
    notificationPanelRef.value &&
    !notificationPanelRef.value.contains(e.target as Node) &&
    bellBtnRef.value &&
    !bellBtnRef.value.contains(e.target as Node)
  ) {
    showNotifications.value = false
  }
  if (showUserMenu.value) {
    showUserMenu.value = false
  }
}
onMounted(()  => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))

const notifications = ref([
  { id: 1, type: 'success', title: 'Task Completed',      message: 'Research Assistant completed market analysis',   time: '2 min ago',   unread: true  },
  { id: 2, type: 'info',    title: 'New Agent Created',   message: 'Content Writer agent is now active',             time: '15 min ago',  unread: true  },
  { id: 3, type: 'warning', title: 'High Usage Alert',    message: 'API usage at 80% of monthly limit',              time: '1 hour ago',  unread: false },
  { id: 4, type: 'success', title: 'Pipeline Executed',   message: 'Customer Support pipeline ran successfully',     time: '2 hours ago', unread: false },
])

const unreadCount = computed(() => notifications.value.filter(n => n.unread).length)

function markAllRead() {
  notifications.value.forEach(n => n.unread = false)
}

function dismissNotification(id: number) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

const proFeatures = [
  'Unlimited AI Agents',
  'Priority API Access',
  'Advanced Analytics Dashboard',
  'Custom Tool Integration',
  '24/7 Premium Support',
  'Team Collaboration (up to 10 members)',
  'Custom Model Fine-tuning',
  'White-label Options',
]

// computed is imported automatically in <script setup> but we need the import
import { computed } from 'vue'
</script>

<template>
  <header class="flex h-16 items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 relative z-30">
    <!-- Left -->
    <div class="flex items-center gap-4">
      <button
        @click="emit('toggle-sidebar')"
        class="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] lg:hidden"
      >
        <Menu class="h-5 w-5" />
      </button>
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-semibold text-[hsl(var(--foreground))]">{{ currentTitle() }}</h1>
        <div class="hidden lg:block">
          <GlobalContextIndicator />
        </div>
      </div>
    </div>

    <!-- Right -->
    <div class="flex items-center gap-3">

      <!-- Search -->
      <div class="relative hidden md:block">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="h-9 w-64 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] pl-9 pr-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
        />
      </div>

      <!-- Pro badge -->
      <button
        @click="showProModal = true"
        class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] rounded-md hover:bg-[hsl(var(--secondary))] transition-colors cursor-pointer"
      >
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span class="text-xs font-mono text-[hsl(var(--foreground))] font-medium">PRO</span>
      </button>

      <!-- ── Bell / Notifications ── -->
      <div class="relative">
        <button
          ref="bellBtnRef"
          @click="showNotifications = !showNotifications"
          class="relative rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] transition-colors"
          :class="showNotifications ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]' : ''"
        >
          <Bell class="h-5 w-5" />
          <!-- Unread badge -->
          <span
            v-if="unreadCount > 0"
            class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white"
          >
            {{ unreadCount }}
          </span>
        </button>

        <!-- Anchored dropdown panel -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-1"
        >
          <div
            v-if="showNotifications"
            ref="notificationPanelRef"
            class="absolute right-0 top-[calc(100%+8px)] w-80 sm:w-96 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl overflow-hidden origin-top-right"
          >
            <!-- Panel header -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
              <div class="flex items-center gap-2">
                <Bell class="h-4 w-4 text-[hsl(var(--foreground))]" />
                <span class="text-sm font-semibold text-[hsl(var(--foreground))]">Notifications</span>
                <span
                  v-if="unreadCount > 0"
                  class="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold rounded-full"
                >
                  {{ unreadCount }} new
                </span>
              </div>
              <button
                @click="markAllRead"
                class="text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors font-medium"
              >
                Mark all read
              </button>
            </div>

            <!-- Notification list -->
            <div class="max-h-[360px] overflow-y-auto divide-y divide-[hsl(var(--border))]">
              <div
                v-for="n in notifications"
                :key="n.id"
                class="group relative flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[hsl(var(--secondary))]"
                :class="n.unread ? 'bg-[hsl(var(--secondary))]/40' : ''"
              >
                <!-- Unread dot -->
                <div
                  v-if="n.unread"
                  class="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-emerald-400"
                />

                <!-- Icon -->
                <div
                  class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg"
                  :class="{
                    'bg-emerald-500/15': n.type === 'success',
                    'bg-blue-500/15':    n.type === 'info',
                    'bg-amber-500/15':   n.type === 'warning',
                  }"
                >
                  <CheckCircle2 v-if="n.type === 'success'" class="h-4 w-4 text-emerald-400" />
                  <Zap          v-else-if="n.type === 'info'"    class="h-4 w-4 text-blue-400" />
                  <AlertCircle  v-else-if="n.type === 'warning'" class="h-4 w-4 text-amber-400" />
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-[hsl(var(--foreground))] leading-snug">{{ n.title }}</p>
                  <p class="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 leading-relaxed">{{ n.message }}</p>
                  <div class="flex items-center gap-1 mt-1.5 text-[11px] text-[hsl(var(--muted-foreground))]">
                    <Clock class="h-3 w-3" />
                    {{ n.time }}
                  </div>
                </div>

                <!-- Dismiss -->
                <button
                  @click.stop="dismissNotification(n.id)"
                  class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                >
                  <X class="h-3.5 w-3.5" />
                </button>
              </div>

              <!-- Empty state -->
              <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
                <div class="w-10 h-10 rounded-xl bg-[hsl(var(--secondary))] flex items-center justify-center mb-3">
                  <Bell class="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                </div>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">All caught up!</p>
                <p class="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">No new notifications</p>
              </div>
            </div>

            <!-- Panel footer -->
            <div class="px-4 py-2.5 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]">
              <button
                @click="showNotifications = false"
                class="w-full text-xs text-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors py-1"
              >
                View all notifications
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- User Menu -->
      <div class="relative">
        <button
          @click="showUserMenu = !showUserMenu"
          class="flex items-center gap-2 rounded-lg p-1.5 hover:bg-[hsl(var(--secondary))] transition-colors"
        >
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary))]/20">
            <User class="h-4 w-4 text-[hsl(var(--primary))]" />
          </div>
        </button>

        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-1"
        >
          <div
            v-if="showUserMenu"
            class="absolute right-0 top-[calc(100%+8px)] w-48 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-1 shadow-xl overflow-hidden origin-top-right"
          >
            <div class="border-b border-[hsl(var(--border))] px-4 py-2.5">
              <p class="text-sm font-medium text-[hsl(var(--foreground))]">John Doe</p>
              <p class="text-xs text-[hsl(var(--muted-foreground))]">john@example.com</p>
            </div>
            <button
              @click="handleLogout"
              class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[hsl(var(--destructive))] hover:bg-[hsl(var(--secondary))] transition-colors"
            >
              <LogOut class="h-4 w-4" />
              Sign out
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>

  <!-- ── Pro Modal (unchanged, kept as centered modal) ── -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showProModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showProModal = false"
      >
        <div class="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-emerald-500/20">
                <Crown class="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-[hsl(var(--foreground))]">Pro Subscription</h2>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">You're on the Pro plan</p>
              </div>
            </div>
            <button @click="showProModal = false" class="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors">
              <X class="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            </button>
          </div>

          <div class="bg-[hsl(var(--background))] rounded-lg p-4 mb-6 border border-emerald-500/30">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-[hsl(var(--foreground))]">Current Plan</span>
              <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">Active</span>
            </div>
            <div class="flex items-baseline gap-1 mb-2">
              <span class="text-3xl font-bold text-[hsl(var(--foreground))]">$39.99</span>
              <span class="text-[hsl(var(--muted-foreground))]">/month</span>
            </div>
            <p class="text-sm text-[hsl(var(--muted-foreground))]">Billed monthly. Next billing date: April 15, 2026</p>
          </div>

          <div class="mb-6">
            <h3 class="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">Included Features</h3>
            <div class="grid grid-cols-1 gap-2">
              <div v-for="feature in proFeatures" :key="feature" class="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <Check class="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>

          <div class="bg-[hsl(var(--background))] rounded-lg p-4 mb-6">
            <h3 class="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">This Month's Usage</h3>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-[hsl(var(--muted-foreground))]">API Calls</span>
                  <span class="text-[hsl(var(--foreground))]">8,234 / 50,000</span>
                </div>
                <div class="h-2 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" style="width: 16.5%" />
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-[hsl(var(--muted-foreground))]">Active Agents</span>
                  <span class="text-[hsl(var(--foreground))]">4 / Unlimited</span>
                </div>
                <div class="h-2 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" style="width: 100%" />
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-[hsl(var(--muted-foreground))]">Storage</span>
                  <span class="text-[hsl(var(--foreground))]">2.4 GB / 100 GB</span>
                </div>
                <div class="h-2 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" style="width: 2.4%" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="showProModal = false"
              class="flex-1 px-4 py-2.5 border border-[hsl(var(--border))] rounded-lg text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-colors"
            >
              Manage Billing
            </button>
            <button
              @click="showProModal = false"
              class="flex-1 px-4 py-2.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
            >
              Upgrade to Enterprise
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>