import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft as ArrowLeftIcon, User as UserIcon,
  Home as HomeIcon, Calendar as CalendarIcon,
  Mail as MailIcon, Shield as ShieldIcon,
  Activity as ActivityIcon
} from 'lucide-react'

const UserDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')

  // ダミーデータ
  const user = {
    id: 1,
    name: '山田太郎',
    email: 'taro@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-15',
    lastLoginAt: '2024-02-15T10:30:00',
    familyGroups: [
      { id: 1, name: '山田家', role: 'admin', members: 3, children: 2 },
      { id: 2, name: '佐藤家', role: 'member', members: 4, children: 1 }
    ],
    activityLog: [
      { id: 1, type: 'login', description: 'ログインしました', createdAt: '2024-02-15T10:30:00' },
      { id: 2, type: 'note', description: '育児メモを作成しました', createdAt: '2024-02-15T11:15:00' },
      { id: 3, type: 'task', description: 'タスクを完了しました', createdAt: '2024-02-15T14:20:00' }
    ]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center">
              <button onClick={() => navigate('/admin')}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <h1 className="ml-4 text-lg font-medium">ユーザー詳細</h1>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* サイドバー */}
          <div className="col-span-1 space-y-6">
            {/* プロフィールカード */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">ステータス</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? '有効' : '無効'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">権限</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'admin'
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'admin' ? '管理者' : 'ユーザー'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">登録日</span>
                  <span className="text-sm">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">最終ログイン</span>
                  <span className="text-sm">{formatDate(user.lastLoginAt)}</span>
                </div>
              </div>
            </div>

            {/* アクション */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <button className="w-full btn btn-primary">
                編集
              </button>
              <button className="w-full btn bg-red-50 text-red-600 hover:bg-red-100">
                {user.status === 'active' ? 'アカウントを無効化' : 'アカウントを有効化'}
              </button>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="col-span-2 space-y-6">
            {/* タブ */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  <button onClick={() => setActiveTab('overview')}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'overview'
                              ? 'border-primary-500 text-primary-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}>
                    概要
                  </button>
                  <button onClick={() => setActiveTab('groups')}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'groups'
                              ? 'border-primary-500 text-primary-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}>
                    所属グループ
                  </button>
                  <button onClick={() => setActiveTab('activity')}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'activity'
                              ? 'border-primary-500 text-primary-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}>
                    アクティビティ
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {/* 概要 */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <HomeIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <h3 className="font-medium">所属グループ数</h3>
                      </div>
                      <p className="text-3xl font-bold">{user.familyGroups.length}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <ActivityIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-medium">アクティビティ数</h3>
                      </div>
                      <p className="text-3xl font-bold">{user.activityLog.length}</p>
                    </div>
                  </div>
                )}

                {/* 所属グループ */}
                {activeTab === 'groups' && (
                  <div className="space-y-4">
                    {user.familyGroups.map(group => (
                      <div key={group.id} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{group.name}</h4>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                group.role === 'admin'
                                  ? 'bg-primary-100 text-primary-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {group.role === 'admin' ? '管理者' : 'メンバー'}
                              </span>
                              <span className="text-sm text-gray-500">
                                メンバー: {group.members}人
                              </span>
                              <span className="text-sm text-gray-500">
                                子供: {group.children}人
                              </span>
                            </div>
                          </div>
                          <button className="text-primary-600 hover:text-primary-700">
                            詳細
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* アクティビティ */}
                {activeTab === 'activity' && (
                  <div className="space-y-4">
                    {user.activityLog.map(activity => (
                      <div key={activity.id} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-primary-100 rounded-lg">
                              <ActivityIcon className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <p>{activity.description}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {formatDate(activity.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetail