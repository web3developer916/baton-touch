import React from 'react'
import { 
  Users as UsersIcon, Home as HomeIcon, 
  BarChart2 as BarChart2Icon, Settings as SettingsIcon,
  LogOut as LogOutIcon, Shield as ShieldIcon
} from 'lucide-react'

const AdminSidebar = ({ activeTab, onTabChange, onLogout }) => {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
            <HomeIcon className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">バトンタッチ</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">管理画面</p>
      </div>
      <nav className="mt-6">
        <button onClick={() => onTabChange('users')}
                className={`w-full flex items-center space-x-3 px-6 py-3 ${
                  activeTab === 'users' 
                    ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-500' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
          <UsersIcon className="w-5 h-5" />
          <span>ユーザー管理</span>
        </button>
        <button onClick={() => onTabChange('families')}
                className={`w-full flex items-center space-x-3 px-6 py-3 ${
                  activeTab === 'families'
                    ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
          <HomeIcon className="w-5 h-5" />
          <span>家族グループ管理</span>
        </button>
        <button onClick={() => onTabChange('stats')}
                className={`w-full flex items-center space-x-3 px-6 py-3 ${
                  activeTab === 'stats'
                    ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
          <BarChart2Icon className="w-5 h-5" />
          <span>利用統計</span>
        </button>
        <button onClick={() => onTabChange('admins')}
                className={`w-full flex items-center space-x-3 px-6 py-3 ${
                  activeTab === 'admins'
                    ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
          <ShieldIcon className="w-5 h-5" />
          <span>管理者</span>
        </button>
        <button onClick={() => onTabChange('settings')}
                className={`w-full flex items-center space-x-3 px-6 py-3 ${
                  activeTab === 'settings'
                    ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
          <SettingsIcon className="w-5 h-5" />
          <span>設定</span>
        </button>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button onClick={onLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
          <LogOutIcon className="w-5 h-5" />
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar