import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  createdAt: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  
  const activeToasts = computed(() => toasts.value)
  
  function addToast(toast: Omit<Toast, 'id' | 'createdAt'>) {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newToast: Toast = {
      ...toast,
      id,
      createdAt: Date.now(),
      duration: toast.duration ?? 4000
    }
    
    toasts.value.push(newToast)
    
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
    
    return id
  }
  
  function removeToast(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  function success(title: string, message?: string) {
    return addToast({ type: 'success', title, message })
  }
  
  function error(title: string, message?: string) {
    return addToast({ type: 'error', title, message })
  }
  
  function warning(title: string, message?: string) {
    return addToast({ type: 'warning', title, message })
  }
  
  function info(title: string, message?: string) {
    return addToast({ type: 'info', title, message })
  }
  
  function clearAll() {
    toasts.value = []
  }
  
  return {
    toasts,
    activeToasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll
  }
})
