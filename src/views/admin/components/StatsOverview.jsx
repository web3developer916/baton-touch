import React from 'react'
import { 
  BookOpen as BookOpenIcon, ListTodo as ListTodoIcon,
  HeartPulse as HeartPulseIcon, Ruler as RulerIcon
} from 'lucide-react'

const StatsOverview = ({ stats, selectedMonth, getMonthlyData }) => {
  return (
    <div className="space-y-6">
      {/* 概要 */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">総ユーザー数</h4>
          <p className="text-2xl font-bold text-gray-900">{stats.overview.totalUsers}</p>
          <p className="text-sm text-green-600 mt-2">+{getMonthlyData(selectedMonth).newUsers} 今月</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">総グループ数</h4>
          <p className="text-2xl font-bold text-gray-900">{stats.overview.totalFamilyGroups}</p>
          <p className="text-sm text-green-600 mt-2">+{getMonthlyData(selectedMonth).newGroups} 今月</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">アクティブ率（月間）</h4>
          <p className="text-2xl font-bold text-primary-600">{getMonthlyData(selectedMonth).activeUsers.monthly}%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">総子供数</h4>
          <p className="text-2xl font-bold text-gray-900">{stats.overview.totalChildren}</p>
        </div>
      </div>

      {/* 機能別利用状況 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">機能別利用状況</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-2">
              <BookOpenIcon className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{getMonthlyData(selectedMonth).features.notes}</p>
            <p className="text-sm text-gray-500">メモ作成数</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-2">
              <ListTodoIcon className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{getMonthlyData(selectedMonth).features.tasks}</p>
            <p className="text-sm text-gray-500">タスク作成数</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-2">
              <HeartPulseIcon className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{getMonthlyData(selectedMonth).features.health}</p>
            <p className="text-sm text-gray-500">健康記録数</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-2">
              <RulerIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{getMonthlyData(selectedMonth).features.growth}</p>
            <p className="text-sm text-gray-500">成長記録数</p>
          </div>
        </div>
      </div>

      {/* リテンション */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">リテンション</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{getMonthlyData(selectedMonth).retention.day1}%</p>
            <p className="text-sm text-gray-500">1日後</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{getMonthlyData(selectedMonth).retention.day7}%</p>
            <p className="text-sm text-gray-500">7日後</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{getMonthlyData(selectedMonth).retention.day30}%</p>
            <p className="text-sm text-gray-500">30日後</p>
          </div>
        </div>
      </div>

      {/* DAUグラフ */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">日次アクティブユーザー（DAU）</h3>
        <div className="h-64">
          <div className="flex items-end h-full space-x-2">
            {getMonthlyData(selectedMonth).activeUsers.daily.map((value, index) => (
              <div key={index} className="flex-1">
                <div className="bg-primary-100 hover:bg-primary-200 transition-colors rounded-t-lg"
                     style={{ height: `${value}%` }}>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsOverview