<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'

const sidebarCollapsed = ref(false)
const route = useRoute()
const router = useRouter()

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleKeydown = (event: KeyboardEvent) => {
  const isMac = navigator.platform.toLowerCase().includes('mac')
  const cmdPressed = isMac ? event.metaKey : event.ctrlKey

  if (cmdPressed && event.key.toLowerCase() === 'k') {
    event.preventDefault()

    if (route.path.startsWith('/dashboard/pipelines')) {
      router.push('/dashboard/activity')
    } else if (route.path.startsWith('/dashboard/activity')) {
      router.push('/dashboard/pipelines')
    } else {
      router.push('/dashboard/pipelines')
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[hsl(var(--background))]">
    <Sidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
    <div class="flex flex-1 flex-col overflow-hidden">
      <Header @toggle-sidebar="toggleSidebar" />
      <main class="flex-1 overflow-auto p-6">
        <RouterView />
      </main>
    </div>
    <ToastContainer />
  </div>
</template>
