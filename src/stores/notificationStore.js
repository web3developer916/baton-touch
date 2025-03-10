import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([
    {
      id: 1,
      type: 'task',
      title: '離乳食の準備',
      message: '今日の10:00に予定があります',
      createdAt: '2024-02-16T08:00:00Z',
      read: false
    },
    {
      id: 2,
      type: 'vaccination',
      title: '予防接種の予定',
      message: '明日、BCG予防接種の予定があります',
      createdAt: '2024-02-15T15:30:00Z',
      read: false
    },
    {
      id: 3,
      type: 'checkup',
      title: '1歳6ヶ月健診',
      message: '来週の水曜日に健診があります',
      createdAt: '2024-02-14T10:00:00Z',
      read: true
    }
  ])

  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  function markAsRead(notificationId) {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(n => n.read = true)
  }

  function removeNotification(notificationId) {
    notifications.value = notifications.value.filter(n => n.id !== notificationId)
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification
  }
})