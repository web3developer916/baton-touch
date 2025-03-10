import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search as SearchIcon, X as XIcon } from 'lucide-react'
import AdminSidebar from './components/AdminSidebar'
import AdminUserList from './components/AdminUserList'
import UserTable from './components/UserTable'
import FamilyGroupTable from './components/FamilyGroupTable'
import FamilyGroupDetail from './FamilyGroupDetail'
import AdminSettings from './components/AdminSettings'
import StatsOverview from './components/StatsOverview'

const Dashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // 現在の月を取得し、デフォルト値として設定
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  // ダミーデータ
  const users = [
    { id: 1, name: '山田太郎', email: 'taro@example.com', familyGroups: 2, status: 'active', role: 'user', createdAt: '2024-01-15' },
    { id: 2, name: '佐藤花子', email: 'hanako@example.com', familyGroups: 1, status: 'active', role: 'user', createdAt: '2024-01-16' },
    { id: 3, name: '鈴木一郎', email: 'ichiro@example.com', familyGroups: 3, status: 'inactive', role: 'admin', createdAt: '2024-01-17' }
  ]

  const familyGroups = [
    { 
      id: 1, 
      name: '山田家', 
      members: [
        { id: 1, name: '山田太郎', role: 'admin', email: 'taro@example.com' },
        { id: 2, name: '山田花子', role: 'member', email: 'hanako@example.com' },
        { id: 3, name: '山田祖父', role: 'member', email: 'grandpa@example.com' }
      ],
      children: [
        { id: 1, name: '山田一郎', birthDate: '2022-01-15' },
        { id: 2, name: '山田二郎', birthDate: '2023-06-20' }
      ],
      createdAt: '2024-01-15',
      lastActivity: '2024-02-15',
      totalNotes: 25,
      totalTasks: 48
    },
    // ... 他のグループ
  ]

  const stats = {
    overview: {
      totalUsers: 150,
      activeUsers: 120,
      totalFamilyGroups: 45,
      totalChildren: 65
    },
    monthly: Object.fromEntries([
      ['2024-01', {
        newUsers: 20,
        newGroups: 6,
        activeUsers: {
          daily: [75, 80, 73, 85, 77, 83, 80],
          weekly: 88,
          monthly: 82
        },
        features: {
          notes: 380,
          tasks: 750,
          health: 210,
          growth: 160
        },
        retention: {
          day1: 82,
          day7: 68,
          day30: 58
        }
      }],
      ['2024-02', {
        newUsers: 25,
        newGroups: 8,
        activeUsers: {
          daily: [80, 85, 78, 90, 82, 88, 85], // 最近7日間
          weekly: 92, // アクティブ率（%）
          monthly: 85 // アクティブ率（%）
        },
        features: {
          notes: 450,
          tasks: 820,
          health: 230,
          growth: 180
        },
        retention: {
          day1: 85,
          day7: 70,
          day30: 60
        }
      }]
    ])
  }

  // 選択された月のデータを安全に取得する関数
  const getMonthlyData = (month) => {
    return stats.monthly[month] || {
      newUsers: 0,
      newGroups: 0,
      activeUsers: {
        daily: [0, 0, 0, 0, 0, 0, 0],
        weekly: 0,
        monthly: 0
      },
      features: {
        notes: 0,
        tasks: 0,
        health: 0,
        growth: 0
      },
      retention: {
        day1: 0,
        day7: 0,
        day30: 0
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* サイドバー */}
      <AdminSidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={() => navigate('/login')}
      />

      {/* メインコンテンツ */}
      <div className="ml-64 p-8">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === 'users' && 'ユーザー管理'}
              {activeTab === 'families' && '家族グループ管理'}
              {activeTab === 'stats' && '利用統計'}
              {activeTab === 'admins' && '管理者管理'}
              {activeTab === 'settings' && '設定'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'users' && '登録ユーザーの管理と状態の確認'}
              {activeTab === 'families' && '家族グループの管理と状態の確認'}
              {activeTab === 'stats' && 'アプリケーションの利用状況の分析'}
              {activeTab === 'admins' && '管理者ユーザーの管理'}
              {activeTab === 'settings' && 'アプリケーションの設定管理'}
            </p>
          </div>
        </div>

        {/* 検索バー */}
        {(activeTab === 'users' || activeTab === 'families') && (
          <div className="mb-6">
            <div className="relative">
              <input type="text"
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     placeholder={activeTab === 'users' ? 'ユーザーを検索...' : '家族グループを検索...'}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm" />
              <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}

        {/* ユーザー管理 */}
        {activeTab === 'users' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">ユーザー一覧</h3>
              <button onClick={() => setShowAdminForm(true)}
                      className="btn btn-primary">
                管理者を追加
              </button>
            </div>
            <UserTable 
              users={users}
              onEdit={(user) => navigate(`/admin/users/${user.id}`)}
              onToggleStatus={(user) => {
                // TODO: ユーザーのステータスを切り替える処理
              }}
            />
          </div>
        )}

        {/* 家族グループ管理 */}
        {activeTab === 'families' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">家族グループ一覧</h3>
            </div>
            <FamilyGroupTable 
              groups={familyGroups}
              onViewDetails={setSelectedGroup}
              onDelete={(id) => {
                if (confirm('このグループを削除してもよろしいですか？')) {
                  // TODO: グループ削除の処理
                }
              }}
            />
          </div>
        )}

        {/* 家族グループ詳細モーダル */}
        {selectedGroup && (
          <FamilyGroupDetail
            group={selectedGroup}
            onClose={() => setSelectedGroup(null)}
          />
        )}
        {/* 利用統計 */}
        {activeTab === 'stats' && (
          <StatsOverview 
            stats={stats}
            selectedMonth={selectedMonth}
            getMonthlyData={getMonthlyData}
          />
        )}

        {/* 管理者管理 */}
        {activeTab === 'admins' && (
          <AdminUserList />
        )}

        {/* 設定 */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-6">
              {/* アプリケーション設定 */}
              <h3 className="text-lg font-medium text-gray-900 mb-6">アプリケーション設定</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新規登録の許可
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="radio" 
                           name="registration" 
                           value="allow" 
                           className="mr-2" 
                           checked={true}
                           onChange={() => {}} />
                    <span>許可</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" 
                           name="registration" 
                           value="deny" 
                           className="mr-2"
                           checked={false}
                           onChange={() => {}} />
                    <span>拒否</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メンテナンスモード
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="radio" 
                           name="maintenance" 
                           value="off" 
                           className="mr-2" 
                           checked={true}
                           onChange={() => {}} />
                    <span>オフ</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" 
                           name="maintenance" 
                           value="on" 
                           className="mr-2"
                           checked={false}
                           onChange={() => {}} />
                    <span>オン</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メンテナンス時メッセージ
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  rows="3"
                  placeholder="メンテナンス中のメッセージを入力..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow">
                  設定を保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard