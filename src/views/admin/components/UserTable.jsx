import React from 'react'
import { formatDate } from '../utils/date'

const UserTable = ({ users, onEdit, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
              ユーザー名
            </th>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
              メールアドレス
            </th>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
              権限
            </th>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
              所属グループ数
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
          {users.slice(0, 10).map(user => (
            <tr key={user.id} 
                onClick={() => onEdit(user)}
                className="hover:bg-gray-50 transition-colors cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.role === 'admin'
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role === 'admin' ? '管理者' : 'ユーザー'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.familyGroups}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'active' ? '有効' : '無効'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                <div className="flex space-x-2">
                  <button onClick={() => onToggleStatus(user)}
                          className="text-red-600 hover:text-red-900">
                    {user.status === 'active' ? '無効化' : '有効化'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {users.length > 10 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {users.length}件中10件を表示中
          </p>
        </div>
      )}
    </div>
  )
}

export default UserTable