import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export const useAdminStore = create(
  persist(
    (set, get) => ({
      adminUsers: [],
      loading: false,
      error: null,

      // 管理者一覧を取得
      fetchAdminUsers: async () => {
        try {
          set({ loading: true, error: null })
          const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .order('created_at', { ascending: false })

          if (error) throw error

          set({ 
            adminUsers: data,
            loading: false
          })
        } catch (error) {
          console.error('Error fetching admin users:', error)
          set({ 
            error: error.message,
            loading: false
          })
        }
      },

      // 管理者を追加
      addAdminUser: async (adminData) => {
        try {
          set({ loading: true, error: null })
          const { data, error } = await supabase
            .from('admin_users')
            .insert([adminData])
            .select()
            .single()

          if (error) throw error

          set(state => ({
            adminUsers: [data, ...state.adminUsers],
            loading: false
          }))

          return data.id
        } catch (error) {
          console.error('Error adding admin user:', error)
          set({ 
            error: error.message,
            loading: false
          })
        }
      },

      // 管理者のステータスを更新
      updateAdminStatus: async (id, status) => {
        try {
          set({ loading: true, error: null })
          const { data, error } = await supabase
            .from('admin_users')
            .update({ status })
            .eq('id', id)
            .select()
            .single()

          if (error) throw error

          set(state => ({
            adminUsers: state.adminUsers.map(admin =>
              admin.id === id ? data : admin
            ),
            loading: false
          }))
        } catch (error) {
          console.error('Error updating admin status:', error)
          set({ 
            error: error.message,
            loading: false
          })
        }
      },

      // 管理者の最終ログイン日時を更新
      updateLastLogin: async (id) => {
        try {
          const { error } = await supabase
            .from('admin_users')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', id)

          if (error) throw error
        } catch (error) {
          console.error('Error updating last login:', error)
        }
      }
    }),
    {
      name: 'admin-store'
    }
  )
)