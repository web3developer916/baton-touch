import React from 'react'
import { formatDate } from '../utils/date'

const FamilyGroupTable = ({ groups, onViewDetails, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
              グループ名
            </th>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
              メンバー数
            </th>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
              子供の人数
            </th>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
              作成日
            </th>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
              最終アクティビティ
            </th>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {groups.slice(0, 10).map(group => (
            <tr key={group.id} 
                onClick={() => onViewDetails(group)}
                className="hover:bg-gray-50 transition-colors cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <p className="font-medium text-gray-900 whitespace-nowrap">{group.name}</p>
                  <p className="text-sm text-gray-500 whitespace-nowrap">ID: {group.id}</p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {group.members.length}人
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {group.children.length}人
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {formatDate(group.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {formatDate(group.lastActivity)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                <div className="flex space-x-2">
                  <button onClick={() => onDelete(group.id)}
                          className="text-red-600 hover:text-red-900">
                    削除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {groups.length > 10 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {groups.length}件中10件を表示中
          </p>
        </div>
      )}
    </div>
  )
}

export default FamilyGroupTable