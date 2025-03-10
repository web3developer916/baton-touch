import React from 'react'
import { 
  BellIcon, SettingsIcon, BabyIcon, HeartPulseIcon, BookOpenIcon,
  HandshakeIcon, PlusCircleIcon, ClipboardListIcon
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {
  const recentRecords = [
    {
      id: 1,
      title: '体温を記録しました',
      time: '10分前',
      icon: HeartPulseIcon,
      iconClass: 'bg-red-100 text-red-600'
    },
    {
      id: 2,
      title: '身長・体重を記録しました',
      time: '2時間前',
      icon: BabyIcon,
      iconClass: 'bg-blue-100 text-blue-600'
    },
    {
      id: 3,
      title: '新しいメモを追加しました',
      time: '3時間前',
      icon: BookOpenIcon,
      iconClass: 'bg-green-100 text-green-600'
    }
  ]

  const quickActions = [
    { name: '記録を追加', icon: PlusCircleIcon },
    { name: 'タスクを追加', icon: ClipboardListIcon }
  ]

  const todaysTasks = [
    { id: 1, title: '朝の薬を飲ませる', completed: true },
    { id: 2, title: '昼寝の時間', completed: false },
    { id: 3, title: '夕方の散歩', completed: false }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <div className="w-10"></div>
            <h1 className="text-base font-medium absolute left-1/2 -translate-x-1/2">ホーム</h1>
            <div className="flex items-center">
              <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 ml-1">
                <BellIcon className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 ml-1">
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="max-w-3xl mx-auto pt-16">
        <div className="grid gap-4">
          {/* 最近の記録 */}
          <section className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">最近の記録</h2>
              <button className="text-primary-500 hover:text-primary-600 font-medium">
                すべて見る
              </button>
            </div>
            <div className="space-y-2">
              {recentRecords.map(record => (
                <div key={record.id} 
                     className="flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-background-light hover:to-white transition-colors">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 shadow-warm ${record.iconClass}`}>
                    {React.createElement(record.icon, { className: "w-5 h-5" })}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{record.title}</p>
                    <p className="text-sm text-gray-500">{record.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* クイックアクション */}
          <section className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">クイックアクション</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map(action => (
                <button key={action.name}
                        className="btn flex items-center justify-center bg-background-light text-primary-600 hover:bg-primary-50 hover:text-primary-700">
                  {React.createElement(action.icon, { className: "w-5 h-5 mr-2" })}
                  {action.name}
                </button>
              ))}
            </div>
          </section>

          {/* 今日のタスク */}
          <section className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">今日のタスク</h2>
            <div className="space-y-2">
              {todaysTasks.map(task => (
                <div key={task.id} 
                     className="flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-background-light hover:to-white transition-colors">
                  <input type="checkbox"
                         checked={task.completed}
                         className="input mr-3" />
                  <span className={task.completed ? 'line-through text-gray-400' : 'text-gray-900'}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Home