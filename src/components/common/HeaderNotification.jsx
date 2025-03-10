import React, { useState, useEffect, useRef } from 'react'
import { Bell as BellIcon } from 'lucide-react'
import { useNotificationStore } from '../../stores/useNotificationStore'
import NotificationPanel from './NotificationPanel'

const HeaderNotification = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { unreadCount } = useNotificationStore()
  const notificationRef = useRef(null)

  useEffect(() => {
    const handleClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-xl text-gray-600"
      >
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </button>

      {isOpen && <NotificationPanel />}
    </div>
  )
}

export default HeaderNotification