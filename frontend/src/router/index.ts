import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignUpView.vue')
    },
    {
      path: '/dashboard',
      component: () => import('@/layouts/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardHome.vue')
        },
        {
          path: 'agents',
          name: 'agent-builder',
          component: () => import('@/views/AgentBuilder.vue')
        },
        {
          path: 'tools',
          name: 'tool-library',
          component: () => import('@/views/ToolLibrary.vue')
        },
        {
          path: 'pipelines',
          name: 'pipeline-builder',
          component: () => import('@/views/PipelineBuilder.vue')
        },
        {
          path: 'tasks',
          name: 'task-input',
          component: () => import('@/views/TaskInput.vue')
        },
        {
          path: 'activity',
          name: 'activity-log',
          component: () => import('@/views/ActivityLog.vue')
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('@/views/AnalyticsView.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/SettingsView.vue')
        }
      ]
    }
  ]
})

export default router
