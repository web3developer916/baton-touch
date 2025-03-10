import React, { useState } from 'react'
import { 
  User as UserIcon, Mail as MailIcon, 
  Lock as LockIcon, Eye as EyeIcon, 
  EyeOff as EyeOffIcon
} from 'lucide-react'

const AdminSettings = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: '管理者',
    email: 'admin@batontouch.jp',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const saveProfile = () => {
    // TODO: プロフィール更新の処理
    alert('プロフィールを更新しました')
  }

  return (
    <div className="space-y-6">
      {/* プロフィール設定 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">プロフィール設定</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              名前
            </label>
            <div className="relative">
              <input type="text"
                     value={profileForm.name}
                     onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                     className="input w-full pl-10"
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
                     value={profileForm.email}
                     onChange={e => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                     className="input w-full pl-10"
                     required />
              <MailIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              現在のパスワード
            </label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'}
                     value={profileForm.currentPassword}
                     onChange={e => setProfileForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                     className="input w-full pl-10 pr-10" />
              <LockIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              新しいパスワード
            </label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'}
                     value={profileForm.newPassword}
                     onChange={e => setProfileForm(prev => ({ ...prev, newPassword: e.target.value }))}
                     className="input w-full pl-10 pr-10" />
              <LockIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              新しいパスワード（確認）
            </label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'}
                     value={profileForm.confirmPassword}
                     onChange={e => setProfileForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                     className="input w-full pl-10 pr-10" />
              <LockIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={saveProfile}
                    className="btn btn-primary">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings