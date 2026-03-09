<script setup lang="ts">
import { ref } from 'vue'
import { 
  User, 
  Key, 
  Bell, 
  Shield, 
  Users, 
  CreditCard,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Check
} from 'lucide-vue-next'

const activeTab = ref('profile')

const tabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'api-keys', name: 'API Keys', icon: Key },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'team', name: 'Team', icon: Users },
  { id: 'billing', name: 'Billing', icon: CreditCard },
]

// Profile
const profile = ref({
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Inc.',
  timezone: 'UTC-5'
})

// API Keys
const apiKeys = ref([
  { id: 1, name: 'OpenAI', key: 'sk-...abc123', maskedKey: 'sk-...abc123', isVisible: false, lastUsed: '2 hours ago' },
  { id: 2, name: 'Anthropic', key: 'sk-...def456', maskedKey: 'sk-...def456', isVisible: false, lastUsed: '1 day ago' },
])

const newApiKey = ref({ name: '', key: '' })
const showAddKey = ref(false)

// Notifications
const notifications = ref({
  taskComplete: true,
  taskFailed: true,
  weeklyReport: false,
  newFeatures: true,
  emailNotifications: true,
  pushNotifications: false,
})

// Team members
const teamMembers = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Owner', avatar: 'JD' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', avatar: 'JS' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Member', avatar: 'BW' },
])

const isSaving = ref(false)
const showSavedMessage = ref(false)

const toggleKeyVisibility = (key: typeof apiKeys.value[0]) => {
  key.isVisible = !key.isVisible
}

const addApiKey = () => {
  if (newApiKey.value.name && newApiKey.value.key) {
    apiKeys.value.push({
      id: Date.now(),
      name: newApiKey.value.name,
      key: newApiKey.value.key,
      maskedKey: newApiKey.value.key.slice(0, 5) + '...' + newApiKey.value.key.slice(-6),
      isVisible: false,
      lastUsed: 'Never'
    })
    newApiKey.value = { name: '', key: '' }
    showAddKey.value = false
  }
}

const deleteApiKey = (id: number) => {
  apiKeys.value = apiKeys.value.filter(k => k.id !== id)
}

const saveSettings = async () => {
  isSaving.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  isSaving.value = false
  showSavedMessage.value = true
  setTimeout(() => {
    showSavedMessage.value = false
  }, 3000)
}
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-[hsl(var(--foreground))]">Settings</h2>
      <p class="text-[hsl(var(--muted-foreground))]">Manage your account and preferences</p>
    </div>

    <div class="flex flex-col gap-6 lg:flex-row">
      <!-- Sidebar -->
      <nav class="w-full lg:w-56 shrink-0">
        <div class="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]'
            ]"
          >
            <component :is="tab.icon" class="h-4 w-4" />
            {{ tab.name }}
          </button>
        </div>
      </nav>

      <!-- Content -->
      <div class="flex-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <!-- Profile -->
        <div v-if="activeTab === 'profile'" class="p-6">
          <h3 class="text-lg font-semibold text-[hsl(var(--foreground))]">Profile Information</h3>
          <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Update your personal details</p>
          
          <div class="mt-6 space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-medium text-[hsl(var(--foreground))]">Full Name</label>
                <input
                  v-model="profile.name"
                  type="text"
                  class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-[hsl(var(--foreground))]">Email</label>
                <input
                  v-model="profile.email"
                  type="email"
                  class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-[hsl(var(--foreground))]">Company</label>
                <input
                  v-model="profile.company"
                  type="text"
                  class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-[hsl(var(--foreground))]">Timezone</label>
                <select
                  v-model="profile.timezone"
                  class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none"
                >
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC+0">UTC</option>
                  <option value="UTC+1">Central European (UTC+1)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- API Keys -->
        <div v-if="activeTab === 'api-keys'" class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-[hsl(var(--foreground))]">API Keys</h3>
              <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Manage your connected API services</p>
            </div>
            <button
              @click="showAddKey = true"
              class="flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))]"
            >
              <Plus class="h-4 w-4" />
              Add Key
            </button>
          </div>

          <!-- Add Key Form -->
          <div v-if="showAddKey" class="mt-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-medium text-[hsl(var(--foreground))]">Service Name</label>
                <input
                  v-model="newApiKey.name"
                  type="text"
                  placeholder="e.g., OpenAI"
                  class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-[hsl(var(--foreground))]">API Key</label>
                <input
                  v-model="newApiKey.key"
                  type="password"
                  placeholder="Enter your API key"
                  class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none"
                />
              </div>
            </div>
            <div class="mt-4 flex justify-end gap-2">
              <button
                @click="showAddKey = false"
                class="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]"
              >
                Cancel
              </button>
              <button
                @click="addApiKey"
                class="rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))]"
              >
                Add Key
              </button>
            </div>
          </div>

          <!-- Keys List -->
          <div class="mt-6 space-y-3">
            <div
              v-for="key in apiKeys"
              :key="key.id"
              class="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4"
            >
              <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--primary)/0.15)]">
                  <Key class="h-5 w-5 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <p class="font-medium text-[hsl(var(--foreground))]">{{ key.name }}</p>
                  <p class="font-mono text-sm text-[hsl(var(--muted-foreground))]">
                    {{ key.isVisible ? key.key : key.maskedKey }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-[hsl(var(--muted-foreground))]">Last used: {{ key.lastUsed }}</span>
                <button
                  @click="toggleKeyVisibility(key)"
                  class="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]"
                >
                  <EyeOff v-if="key.isVisible" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
                <button
                  @click="deleteApiKey(key.id)"
                  class="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive)/0.15)] hover:text-[hsl(var(--destructive))]"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div v-if="activeTab === 'notifications'" class="p-6">
          <h3 class="text-lg font-semibold text-[hsl(var(--foreground))]">Notification Preferences</h3>
          <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Choose how you want to be notified</p>

          <div class="mt-6 space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-[hsl(var(--border))]">
              <div>
                <p class="font-medium text-[hsl(var(--foreground))]">Task Completed</p>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">Get notified when a task finishes</p>
              </div>
              <button
                @click="notifications.taskComplete = !notifications.taskComplete"
                :class="[
                  'relative h-6 w-11 rounded-full transition-colors',
                  notifications.taskComplete ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'
                ]"
              >
                <span
                  :class="[
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                    notifications.taskComplete ? 'left-[22px]' : 'left-0.5'
                  ]"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-[hsl(var(--border))]">
              <div>
                <p class="font-medium text-[hsl(var(--foreground))]">Task Failed</p>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">Get notified when a task fails</p>
              </div>
              <button
                @click="notifications.taskFailed = !notifications.taskFailed"
                :class="[
                  'relative h-6 w-11 rounded-full transition-colors',
                  notifications.taskFailed ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'
                ]"
              >
                <span
                  :class="[
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                    notifications.taskFailed ? 'left-[22px]' : 'left-0.5'
                  ]"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-[hsl(var(--border))]">
              <div>
                <p class="font-medium text-[hsl(var(--foreground))]">Weekly Report</p>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">Receive weekly usage summary</p>
              </div>
              <button
                @click="notifications.weeklyReport = !notifications.weeklyReport"
                :class="[
                  'relative h-6 w-11 rounded-full transition-colors',
                  notifications.weeklyReport ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'
                ]"
              >
                <span
                  :class="[
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                    notifications.weeklyReport ? 'left-[22px]' : 'left-0.5'
                  ]"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between py-3">
              <div>
                <p class="font-medium text-[hsl(var(--foreground))]">New Features</p>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">Get updates about new features</p>
              </div>
              <button
                @click="notifications.newFeatures = !notifications.newFeatures"
                :class="[
                  'relative h-6 w-11 rounded-full transition-colors',
                  notifications.newFeatures ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'
                ]"
              >
                <span
                  :class="[
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                    notifications.newFeatures ? 'left-[22px]' : 'left-0.5'
                  ]"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div v-if="activeTab === 'security'" class="p-6">
          <h3 class="text-lg font-semibold text-[hsl(var(--foreground))]">Security Settings</h3>
          <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Manage your account security</p>

          <div class="mt-6 space-y-6">
            <div class="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
              <h4 class="font-medium text-[hsl(var(--foreground))]">Change Password</h4>
              <div class="mt-4 space-y-3">
                <input
                  type="password"
                  placeholder="Current password"
                  class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="New password"
                  class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  class="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none"
                />
                <button class="rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))]">
                  Update Password
                </button>
              </div>
            </div>

            <div class="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-[hsl(var(--foreground))]">Two-Factor Authentication</h4>
                  <p class="text-sm text-[hsl(var(--muted-foreground))]">Add an extra layer of security</p>
                </div>
                <button class="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Team -->
        <div v-if="activeTab === 'team'" class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-[hsl(var(--foreground))]">Team Members</h3>
              <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Manage your workspace team</p>
            </div>
            <button class="flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))]">
              <Plus class="h-4 w-4" />
              Invite Member
            </button>
          </div>

          <div class="mt-6 space-y-3">
            <div
              v-for="member in teamMembers"
              :key="member.id"
              class="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4"
            >
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.15)] text-sm font-medium text-[hsl(var(--primary))]">
                  {{ member.avatar }}
                </div>
                <div>
                  <p class="font-medium text-[hsl(var(--foreground))]">{{ member.name }}</p>
                  <p class="text-sm text-[hsl(var(--muted-foreground))]">{{ member.email }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span :class="[
                  'rounded-full px-2.5 py-1 text-xs font-medium',
                  member.role === 'Owner' ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]' :
                  member.role === 'Admin' ? 'bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]' :
                  'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                ]">
                  {{ member.role }}
                </span>
                <button
                  v-if="member.role !== 'Owner'"
                  class="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive)/0.15)] hover:text-[hsl(var(--destructive))]"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Billing -->
        <div v-if="activeTab === 'billing'" class="p-6">
          <h3 class="text-lg font-semibold text-[hsl(var(--foreground))]">Billing & Subscription</h3>
          <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Manage your subscription and payment</p>

          <div class="mt-6 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-bold text-white">Pro Plan</h3>
                <p class="text-sm text-zinc-400">Unlimited AI Orchestration</p>
              </div>
              <span
                class="px-3 py-1 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full"
              >
                ACTIVE
              </span>
            </div>

            <div class="mb-6">
              <span class="text-4xl font-bold text-white">₹3,999</span>
              <span class="text-zinc-500 ml-2">/ month</span>
            </div>

            <ul class="space-y-3 mb-6">
              <li class="flex items-center text-sm text-zinc-300">
                <Check class="w-4 h-4 mr-2 text-emerald-500" /> Infinite Node Workflows
              </li>
              <li class="flex items-center text-sm text-zinc-300">
                <Check class="w-4 h-4 mr-2 text-emerald-500" /> Priority Agent Execution
              </li>
              <li class="flex items-center text-sm text-zinc-300">
                <Check class="w-4 h-4 mr-2 text-emerald-500" /> 24/7 System Monitoring
              </li>
            </ul>

            <div class="flex items-center justify-between text-xs text-zinc-500">
              <span>Billing in INR • Taxes may apply</span>
              <button
                class="rounded-lg border border-zinc-800 px-3 py-1 font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                Manage Plan
              </button>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex items-center justify-between border-t border-[hsl(var(--border))] px-6 py-4">
          <div
            v-if="showSavedMessage"
            class="flex items-center gap-2 text-sm text-[hsl(var(--success))]"
          >
            <Check class="h-4 w-4" />
            Settings saved successfully
          </div>
          <div v-else></div>
          <button
            @click="saveSettings"
            :disabled="isSaving"
            class="flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-50"
          >
            <Save v-if="!isSaving" class="h-4 w-4" />
            <div v-else class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
