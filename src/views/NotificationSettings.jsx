import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft as ArrowLeftIcon } from 'lucide-react'

const NotificationSettings = () => {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    tasks: {
      enabled: true
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <button onClick={() => navigate(-1)} 
                    className="p-2 hover:bg-gray-100 rounded-xl text-gray-600">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-base font-medium absolute left-1/2 -translate-x-1/2">プッシュ通知設定</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 pt-16">
        {/* 通知設定 */}
        <div className="card space-y-6">
          {/* タスク通知 */}
          <div>
            <h3 className="text-lg font-bold mb-4">タスク通知</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-gray-700">通知を受け取る</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox"
                         checked={settings.tasks.enabled}
                         onChange={e => setSettings(prev => ({
                           ...prev,
                           tasks: {
                             ...prev.tasks,
                             enabled: e.target.checked
                           }
                         }))}
                         className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                peer-focus:ring-primary-100 rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:border-gray-300 after:border after:rounded-full 
                                after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NotificationSettings