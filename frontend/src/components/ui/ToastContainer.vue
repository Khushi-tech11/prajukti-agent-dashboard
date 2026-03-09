<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto"
        >
          <div
            :class="[
              'flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm bg-[hsl(var(--card))]',
              toastBorderStyles[toast.type]
            ]"
          >
            <div :class="['flex-shrink-0 w-5 h-5', iconColors[toast.type]]">
              <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5" />
              <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5" />
              <AlertTriangle v-else-if="toast.type === 'warning'" class="w-5 h-5" />
              <Info v-else class="w-5 h-5" />
            </div>
            
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-[hsl(var(--foreground))]">{{ toast.title }}</p>
              <p v-if="toast.message" class="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                {{ toast.message }}
              </p>
            </div>
            
            <button
              @click="toastStore.removeToast(toast.id)"
              class="flex-shrink-0 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toast'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)

const toastBorderStyles: Record<string, string> = {
  success: 'border-emerald-500/30',
  error: 'border-red-500/30',
  warning: 'border-amber-500/30',
  info: 'border-blue-500/30'
}

const iconColors: Record<string, string> = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500'
}
</script>

<style scoped>
.toast-enter-active {
  animation: slide-in-right 0.3s ease-out;
}

.toast-leave-active {
  animation: slide-out-right 0.2s ease-in forwards;
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out-right {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
