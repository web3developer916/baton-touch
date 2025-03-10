import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      loading: false,
      error: null,

      // 通知一覧を取得
      fetchNotifications: async (userId) => {
        try {
          set({ loading: true, error: null })
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

          if (error) throw error

          set({ 
            notifications: data,
            loading: false
          })
        } catch (error) {
          console.error('Error fetching notifications:', error)
          set({ 
            error: error.message,
            loading: false
          })
        }
      },

      // 通知を追加
      addNotification: async (notificationData) => {
        try {
          set({ loading: true, error: null })
          const { data, error } = await supabase
            .from('notifications')
            .insert([notificationData])
            .select()
            .single()

          if (error) throw error

          set(state => ({
            notifications: [data, ...state.notifications],
            loading: false
          }))
        } catch (error) {
          console.error('Error adding notification:', error)
          set({ 
            error: error.message,
            loading: false
          })
        }
      },

      // 通知を既読にする
      markAsRead: async (notificationId) => {
        try {
          set({ loading: true, error: null })
          const { data, error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId)
            .select()
            .single()

          if (error) throw error

          set(state => ({
            notifications: state.notifications.map(notification =>
              notification.id === notificationId ? data : notification
            ),
            loading: false
          }))
        } catch (error) {
          console.error('Error marking notification as read:', error)
          set({ 
            error: error.message,
            loading: false
          })
        }
      },

      // すべての通知を既読にする
      markAllAsRead: async (userId) => {
        try {
          set({ loading: true, error: null })
          const { data, error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false)
            .select()

          if (error) throw error

          set(state => ({
            notifications: state.notifications.map(notification =>
              data.find(n => n.id === notification.id) || notification
            ),
            loading: false
          }))
        } catch (error) {
          console.error('Error marking all notifications as read:', error)
          set({ 
            error: error.message,
            loading: false
          })
        }
      },

      // 通知を削除
      removeNotification: async (notificationId) => {
        try {
          set({ loading: true, error: null })
          const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId)

          if (error) throw error

          set(state => ({
            notifications: state.notifications.filter(n => n.id !== notificationId),
            loading: false
          }))
        } catch (error) {
          console.error('Error removing notification:', error)
          set({ 
            error: error.message,
            loading: false
          })
        }
      },

      // 未読の通知数を取得
      get unreadCount() {
        return get().notifications.filter(n => !n.read).length
      }
    }),
    {
      name: 'notification-store'
    }
  )
)