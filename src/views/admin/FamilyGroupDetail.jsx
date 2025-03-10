import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft as ArrowLeftIcon, User as UserIcon,
  Home as HomeIcon, Calendar as CalendarIcon,
  Mail as MailIcon, Shield as ShieldIcon,
  Activity as ActivityIcon, Baby as BabyIcon,
  BookOpen as BookOpenIcon, ListTodo as ListTodoIcon
} from 'lucide-react'

const FamilyGroupDetail = ({ group, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const navigate = useNavigate()

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
    <div className="modal-overlay">
      <div className="modal-content max-w-4xl">
        {/* ヘッダー */}
        <div className="modal-header flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{group.name}</h2>
            <p className="text-sm text-gray-500">作成日: {formatDate(group.createdAt)}</p>
          </div>
          <button onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
        </div>

        {/* タブ */}
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
            <button onClick={() => setActiveTab('members')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'members'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}>
              メンバー
            </button>
            <button onClick={() => setActiveTab('children')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'children'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}>
              子供
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

        {/* コンテンツ */}
        <div className="modal-body">
          {/* 概要 */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <UserIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="font-medium">メンバー数</h3>
                  </div>
                  <p className="text-3xl font-bold">{group.members.length}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BabyIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-medium">子供の人数</h3>
                  </div>
                  <p className="text-3xl font-bold">{group.children.length}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4">利用状況</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <BookOpenIcon className="w-5 h-5 text-primary-600" />
                      <span>メモ数</span>
                    </div>
                    <p className="text-2xl font-bold">{group.totalNotes}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <ListTodoIcon className="w-5 h-5 text-blue-600" />
                      <span>タスク数</span>
                    </div>
                    <p className="text-2xl font-bold">{group.totalTasks}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* メンバー */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              {group.members.map(member => (
                <div key={member.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.role === 'admin'
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.role === 'admin' ? '管理者' : 'メンバー'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 子供 */}
          {activeTab === 'children' && (
            <div className="space-y-4">
              {group.children.map(child => (
                <div key={child.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <BabyIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{child.name}</h4>
                        <p className="text-sm text-gray-500">
                          生年月日: {formatDate(child.birthDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* アクティビティ */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4">最終アクティビティ</h3>
                <p className="text-gray-600">{formatDate(group.lastActivity)}</p>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="modal-footer">
          <div className="flex justify-end space-x-3">
            <button onClick={onClose}
                    className="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FamilyGroupDetail