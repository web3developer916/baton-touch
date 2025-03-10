import React from 'react'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import { 
  Bell as BellIcon, Clock as ClockIcon, Syringe as SyringeIcon, 
  Stethoscope as StethoscopeIcon, ListTodo as ListTodoIcon, X as XIcon 
} from 'lucide-react'
import { useNotificationStore } from '../../stores/useNotificationStore'

const NotificationPanel = () => {
  const navigate = useNavigate()
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotificationStore()

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'M月d日(E) HH:mm', { locale: ja })
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task':
        return ListTodoIcon
      case 'vaccination':
        return SyringeIcon
      case 'checkup':
        return StethoscopeIcon
      default:
        return BellIcon
    }
  }

  const getNotificationIconClass = (type) => {
    switch (type) {
      case 'task':
        return 'bg-primary-100 text-primary-600'
      case 'vaccination':
        return 'bg-green-100 text-green-600'
      case 'checkup':
        return 'bg-blue-100 text-blue-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id)
    
    // 通知の種類に応じて適切なページに遷移
    switch (notification.type) {
      case 'task':
        navigate('/tasks')
        break
      case 'vaccination':
        navigate('/health/vaccination')
        break
      case 'checkup':
        navigate('/health/checkup')
        break
      case 'temperature':
        navigate('/health')
        break
      case 'illness':
        navigate('/health/illness')
        break
      case 'medication':
        navigate('/health/medication')
        break
      default:
        break
    }
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] max-w-md bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">通知</h3>
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              すべて既読にする
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">通知はありません</p>
            <p className="text-sm text-gray-400 mt-1">新しい通知が届くとここに表示されます</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.read ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-xl flex-shrink-0 ${getNotificationIconClass(notification.type)}`}>
                    {React.createElement(getNotificationIcon(notification.type), { className: 'w-5 h-5' })}
                  </div>
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeNotification(notification.id)
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default NotificationPanel