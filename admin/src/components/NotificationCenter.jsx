import { 
  XMarkIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
  HandThumbUpIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

const NotificationCenter = ({ isOpen, toggleNotifications }) => {
  const notifications = [
    {
      id: 1,
      title: 'New high priority complaint',
      description: 'User ID 2456 reported a critical issue',
      time: '2 minutes ago',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      id: 2,
      title: 'New user registered',
      description: 'Alice Johnson joined the platform',
      time: '15 minutes ago',
      icon: UserPlusIcon,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      id: 3,
      title: 'Positive feedback received',
      description: 'User ID 1892 rated their experience 5 stars',
      time: '1 hour ago',
      icon: HandThumbUpIcon,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: 4,
      title: 'New message',
      description: 'You have a new message from support team',
      time: '3 hours ago',
      icon: EnvelopeIcon,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ]

  return (
    <div 
      className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 z-50 p-5 overflow-y-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg dark:text-white">Notifications</h3>
        <button 
          onClick={toggleNotifications}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 ${notification.bgColor} rounded-lg hover:opacity-90 transition-opacity cursor-pointer`}
          >
            <div className="flex items-start">
              <div className={`w-10 h-10 rounded-full ${notification.bgColor} flex items-center justify-center ${notification.iconColor} mr-4`}>
                <notification.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1 dark:text-white">{notification.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-xs mb-2">{notification.description}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationCenter