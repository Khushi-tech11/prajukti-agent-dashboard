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
  Check,
  X
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
const showManageBillingModal = ref(false)
const showUpgradeModal = ref(false)
const showPlansModal = ref(false)

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
              'flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer',
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
        <div v-if="activeTab === 'profile'" class="p-6 flex flex-col">
          <div class="flex-1">
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
          <!-- Save Button - Only in Profile -->
          <div class="flex items-center justify-between border-t border-[hsl(var(--border))] pt-4 mt-6">
            <div
              v-if="showSavedMessage"
              class="flex items-center gap-2 text-sm text-[hsl(var(--success))]"
            >
              <Check class="h-4 w-4" />
              Profile saved successfully
            </div>
            <div v-else></div>
            <button
              @click="saveSettings"
              :disabled="isSaving"
              class="flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-50 cursor-pointer"
            >
              <Save v-if="!isSaving" class="h-4 w-4" />
              <div v-else class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
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
              class="flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus class="h-4 w-4" />
              Add API Key
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
                class="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] cursor-pointer"
              >
                Cancel
              </button>
              <button
                @click="addApiKey"
                class="rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] cursor-pointer hover:opacity-90"
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
                  class="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] cursor-pointer"
                >
                  <EyeOff v-if="key.isVisible" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
                <button
                  @click="deleteApiKey(key.id)"
                  class="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive)/0.15)] hover:text-[hsl(var(--destructive))] cursor-pointer"
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

          <div class="mt-6 space-y-0">
            <div class="flex items-center justify-between px-0 py-4 border-b border-[hsl(var(--border))]">
              <div class="flex-1">
                <p class="font-medium text-[hsl(var(--foreground))]">Task Completed</p>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">Get notified when a task finishes</p>
              </div>
              <button
                @click="notifications.taskComplete = !notifications.taskComplete"
                :class="[
                  'relative inline-flex h-7 w-14 flex-shrink-0 rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
                  notifications.taskComplete ? 'bg-emerald-500' : 'bg-[hsl(var(--muted))]'
                ]"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    notifications.taskComplete ? 'translate-x-7' : 'translate-x-0.5'
                  ]"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between px-0 py-4 border-b border-[hsl(var(--border))]">
              <div class="flex-1">
                <p class="font-medium text-[hsl(var(--foreground))]">Task Failed</p>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">Get notified when a task fails</p>
              </div>
              <button
                @click="notifications.taskFailed = !notifications.taskFailed"
                :class="[
                  'relative inline-flex h-7 w-14 flex-shrink-0 rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
                  notifications.taskFailed ? 'bg-emerald-500' : 'bg-[hsl(var(--muted))]'
                ]"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    notifications.taskFailed ? 'translate-x-7' : 'translate-x-0.5'
                  ]"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between px-0 py-4 border-b border-[hsl(var(--border))]">
              <div class="flex-1">
                <p class="font-medium text-[hsl(var(--foreground))]">Weekly Report</p>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">Receive weekly usage summary</p>
              </div>
              <button
                @click="notifications.weeklyReport = !notifications.weeklyReport"
                :class="[
                  'relative inline-flex h-7 w-14 flex-shrink-0 rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
                  notifications.weeklyReport ? 'bg-emerald-500' : 'bg-[hsl(var(--muted))]'
                ]"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    notifications.weeklyReport ? 'translate-x-7' : 'translate-x-0.5'
                  ]"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between px-0 py-4">
              <div class="flex-1">
                <p class="font-medium text-[hsl(var(--foreground))]">New Features</p>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">Get updates about new features</p>
              </div>
              <button
                @click="notifications.newFeatures = !notifications.newFeatures"
                :class="[
                  'relative inline-flex h-7 w-14 flex-shrink-0 rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
                  notifications.newFeatures ? 'bg-emerald-500' : 'bg-[hsl(var(--muted))]'
                ]"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    notifications.newFeatures ? 'translate-x-7' : 'translate-x-0.5'
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
                <button class="rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] cursor-pointer hover:opacity-90">
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
                <button class="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] cursor-pointer">
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
            <button class="flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] cursor-pointer hover:opacity-90">
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

        <!-- Billing & Subscription -->
        <div v-if="activeTab === 'billing'" class="p-6">
          <h3 class="text-lg font-semibold text-[hsl(var(--foreground))]">Billing & Subscription</h3>
          <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Manage your subscription and payment methods</p>

          <!-- Current Plan -->
          <div class="mt-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-bold text-[hsl(var(--foreground))]">Pro Plan</h3>
                <p class="text-sm text-[hsl(var(--muted-foreground))]">Unlimited AI Orchestration</p>
              </div>
              <span class="px-3 py-1 text-xs font-mono bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] border border-[hsl(var(--success)/0.3)] rounded-full">
                ACTIVE
              </span>
            </div>

            <div class="mb-6">
              <span class="text-4xl font-bold text-[hsl(var(--foreground))]">₹3,999</span>
              <span class="text-[hsl(var(--muted-foreground))] ml-2">/ month</span>
            </div>

            <ul class="space-y-3 mb-6">
              <li class="flex items-center text-sm text-[hsl(var(--foreground))]">
                <Check class="w-4 h-4 mr-2 text-[hsl(var(--success))]" /> Unlimited Agents & Pipelines
              </li>
              <li class="flex items-center text-sm text-[hsl(var(--foreground))]">
                <Check class="w-4 h-4 mr-2 text-[hsl(var(--success))]" /> Priority Execution Queue
              </li>
              <li class="flex items-center text-sm text-[hsl(var(--foreground))]">
                <Check class="w-4 h-4 mr-2 text-[hsl(var(--success))]" /> Advanced Analytics
              </li>
              <li class="flex items-center text-sm text-[hsl(var(--foreground))]">
                <Check class="w-4 h-4 mr-2 text-[hsl(var(--success))]" /> 24/7 Support
              </li>
            </ul>

            <div class="space-y-2 mb-4 pb-4 border-b border-[hsl(var(--border))]">
              <div class="text-xs text-[hsl(var(--muted-foreground))]">Next billing date: April 15, 2026</div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <button @click="showManageBillingModal = true" class="px-4 py-2 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary)/0.8)] transition-colors cursor-pointer">
                Manage Billing
              </button>
              <button @click="showUpgradeModal = true" class="px-4 py-2 rounded-lg bg-[hsl(var(--primary))] border border-[hsl(var(--primary))] text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-colors cursor-pointer">
                Upgrade to Enterprise
              </button>
            </div>
          </div>

          <!-- Upgrade Options -->
          <div class="mt-6">
            <h4 class="text-base font-semibold text-[hsl(var(--foreground))] mb-4">Other Plans</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Free Tier -->
              <div class="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
                <h5 class="font-medium text-[hsl(var(--foreground))] mb-2">Free Tier</h5>
                <p class="text-2xl font-bold text-[hsl(var(--foreground))] mb-3">₹0<span class="text-sm text-[hsl(var(--muted-foreground))]">/month</span></p>
                <ul class="text-xs text-[hsl(var(--muted-foreground))] space-y-1 mb-4">
                  <li>✓ 2 Active Agents</li>
                  <li>✓ Basic Analytics</li>
                  <li>✓ Community Support</li>
                </ul>
              </div>
              <!-- Enterprise -->
              <div class="rounded-lg border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--card))] p-4">
                <h5 class="font-medium text-[hsl(var(--foreground))] mb-2">Enterprise</h5>
                <p class="text-2xl font-bold text-[hsl(var(--foreground))] mb-3">Custom<span class="text-sm text-[hsl(var(--muted-foreground))]"> pricing</span></p>
                <ul class="text-xs text-[hsl(var(--muted-foreground))] space-y-1 mb-4">
                  <li>✓ Unlimited Everything</li>
                  <li>✓ Dedicated Support</li>
                  <li>✓ SLA Guarantee</li>
                </ul>
                <button class="w-full px-3 py-2 text-xs font-medium rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity cursor-pointer">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Manage Billing Modal -->
    <Teleport to="body">
      <div v-if="showManageBillingModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="showManageBillingModal = false">
        <div class="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-md shadow-xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
            <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Manage Billing</h2>
            <button @click="showManageBillingModal = false" class="p-1 hover:bg-[hsl(var(--secondary))] rounded-lg cursor-pointer">
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div class="rounded-lg bg-[hsl(var(--secondary))] p-4">
              <h3 class="font-medium text-[hsl(var(--foreground))] mb-2">Billing Information</h3>
              <div class="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                <p>Current Plan: <span class="font-semibold text-[hsl(var(--foreground))]">Pro</span></p>
                <p>Monthly Cost: <span class="font-semibold text-[hsl(var(--foreground))]">₹3,999</span></p>
                <p>Next Billing: <span class="font-semibold text-[hsl(var(--foreground))]">April 15, 2026</span></p>
              </div>
            </div>
            <button class="w-full px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg text-sm font-medium hover:opacity-90 cursor-pointer">
              Open Billing Portal
            </button>
            <button @click="showManageBillingModal = false" class="w-full px-4 py-2 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-lg text-sm font-medium hover:bg-[hsl(var(--secondary))] cursor-pointer">
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Upgrade to Enterprise Modal -->
    <Teleport to="body">
      <div v-if="showUpgradeModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="showUpgradeModal = false">
        <div class="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-md shadow-xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
            <h2 class="text-lg font-semibold text-[hsl(var(--foreground))]">Upgrade to Enterprise</h2>
            <button @click="showUpgradeModal = false" class="p-1 hover:bg-[hsl(var(--secondary))] rounded-lg cursor-pointer">
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div class="rounded-lg bg-[hsl(var(--secondary))] p-4">
              <h3 class="font-medium text-[hsl(var(--foreground))] mb-3">Enterprise Features</h3>
              <ul class="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                <li class="flex items-center gap-2"><Check class="h-4 w-4 text-emerald-500" /> Unlimited Everything</li>
                <li class="flex items-center gap-2"><Check class="h-4 w-4 text-emerald-500" /> Dedicated Account Manager</li>
                <li class="flex items-center gap-2"><Check class="h-4 w-4 text-emerald-500" /> Custom Integrations</li>
                <li class="flex items-center gap-2"><Check class="h-4 w-4 text-emerald-500" /> SLA Guarantee</li>
              </ul>
            </div>
            <button class="w-full px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg text-sm font-medium hover:opacity-90 cursor-pointer">
              Contact Sales Team
            </button>
            <button @click="showUpgradeModal = false" class="w-full px-4 py-2 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-lg text-sm font-medium hover:bg-[hsl(var(--secondary))] cursor-pointer">
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
