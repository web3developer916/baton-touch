import React, { useState, useEffect } from 'react'
import { 
  User as UserIcon, Mail as MailIcon, 
  Plus as PlusIcon, X as XIcon
} from 'lucide-react'
import { formatDate } from '../utils/date'
import { useAdminStore } from '../../../stores/useAdminStore'

const AdminUserList = () => {
  const [showNewAdminForm, setShowNewAdminForm] = useState(false)
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: ''
  })

  const { adminUsers, loading, error, fetchAdminUsers, addAdminUser, updateAdminStatus } = useAdminStore()

  useEffect(() => {
    fetchAdminUsers()
  }, [])

  const addAdmin = async () => {
    try {
      await addAdminUser({
        name: adminForm.name,
        email: adminForm.email,
        status: 'active'
      })
      alert('管理者を追加しました。パスワード設定用のメールが送信されます。')
      setShowNewAdminForm(false)
      setAdminForm({
        name: '',
        email: ''
      })
    } catch (error) {
      alert('管理者の追加に失敗しました: ' + error.message)
    }
  }

  const toggleAdminStatus = async (admin) => {
    try {
      const newStatus = admin.status === 'active' ? 'inactive' : 'active'
      await updateAdminStatus(admin.id, newStatus)
    } catch (error) {
      alert('ステータスの更新に失敗しました: ' + error.message)
    }
  }

  if (loading) {
    return <div className="text-center py-12">読み込み中...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">エラーが発生しました: {error}</div>
  }

  if (adminUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">管理者が登録されていません</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">管理者一覧</h3>
      </div>

      {/* 管理者一覧テーブル */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
                  管理者名
                </th>
                <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
                  メールアドレス
                </th>
                <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
                  ステータス
                </th>
                <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
                  登録日
                </th>
                <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {adminUsers.map(admin => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <UserIcon className="w-4 h-4 text-primary-600" />
                      </div>
                      {admin.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      admin.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.status === 'active' ? '有効' : '無効'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {formatDate(admin.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => toggleAdminStatus(admin)}
                            className="text-red-600 hover:text-red-900">
                      {admin.status === 'active' ? '無効化' : '有効化'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 新規管理者追加フォーム (モーダル) */}
      {showNewAdminForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">新しい管理者を追加</h3>
              <button onClick={() => setShowNewAdminForm(false)}
                      className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              addAdmin()
            }} className="modal-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  名前
                </label>
                <div className="relative">
                  <input type="text"
                         value={adminForm.name}
                         onChange={e => setAdminForm(prev => ({ ...prev, name: e.target.value }))}
                         className="input w-full pl-10"
                         placeholder="管理者の名前"
                         required />
                  <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <div className="relative">
                  <input type="email"
                         value={adminForm.email}
                         onChange={e => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                         className="input w-full pl-10"
                         placeholder="example@email.com"
                         required />
                  <MailIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </form>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button type="button"
                        onClick={() => setShowNewAdminForm(false)}
                        className="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
                  キャンセル
                </button>
                <button onClick={addAdmin}
                        className="btn btn-primary">
                  追加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUserList