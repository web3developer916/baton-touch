import { createRouter, createWebHistory } from 'vue-router'
import Child from '../views/Child.vue'
import Health from '../views/Health.vue'
import Notes from '../views/Notes.vue'
import Tasks from '../views/Tasks.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'child',
      component: Child
    },
    {
      path: '/child',
      name: 'child-alt',
      component: Child
    },
    {
      path: '/child/growth',
      name: 'growth-record',
      component: () => import('../views/GrowthRecord.vue')
    },
    {
      path: '/child/development',
      name: 'development-record',
      component: () => import('../views/DevelopmentRecord.vue')
    },
    {
      path: '/health',
      name: 'health',
      component: Health
    },
    {
      path: '/health/illness',
      name: 'illness-management',
      component: () => import('../views/IllnessManagement.vue')
    },
    {
      path: '/health/vaccination',
      name: 'vaccination-record',
      component: () => import('../views/VaccinationRecord.vue'),
    },
    {
      path: '/health/checkup',
      name: 'checkup-record',
      component: () => import('../views/CheckupRecord.vue')
    },
    {
      path: '/notes',
      name: 'notes',
      component: Notes
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Tasks
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue')
    },
    {
      path: '/settings/family',
      name: 'family-settings',
      component: () => import('../views/FamilySettings.vue')
    },
    {
      path: '/settings/family/detail',
      name: 'family-settings-detail',
      component: () => import('../views/FamilySettingsDetail.vue')
    },
    {
      path: '/settings/notes',
      name: 'note-settings',
      component: () => import('../views/NoteSettings.vue')
    },
    {
      path: '/settings/account',
      name: 'account-settings',
      component: () => import('../views/AccountSettings.vue')
    },
    {
      path: '/settings/notifications',
      name: 'notification-settings',
      component: () => import('../views/NotificationSettings.vue')
    },
    {
      path: '/settings/faq',
      name: 'faq',
      component: () => import('../views/FAQ.vue')
    }
  ]
})

export default router