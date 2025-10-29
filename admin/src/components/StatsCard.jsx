import { 
  UsersIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftEllipsisIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline'

const iconMap = {
  users: UsersIcon,
  exclamation: ExclamationTriangleIcon,
  comment: ChatBubbleLeftEllipsisIcon,
  clock: ClockIcon
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    icon: 'text-blue-600 dark:text-blue-400'
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    icon: 'text-red-600 dark:text-red-400'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
    icon: 'text-green-600 dark:text-green-400'
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    icon: 'text-yellow-600 dark:text-yellow-400'
  }
}

const StatsCard = ({ title, value, change, icon, trend, color }) => {
  const IconComponent = iconMap[icon]
  const colors = colorClasses[color]

  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold mt-1 mb-2 dark:text-white">{value}</p>
          <p className={`${colors.text} text-xs font-medium mt-1 flex items-center`}>
            {trend === 'up' && <ArrowUpIcon className="w-3 h-3 mr-1.5" />}
            {trend === 'down' && <ArrowDownIcon className="w-3 h-3 mr-1.5" />}
            {trend === 'neutral' && <MinusIcon className="w-3 h-3 mr-1.5" />}
            <span>{change}</span>
          </p>
        </div>
        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center ${colors.icon}`}>
          <IconComponent className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

export default StatsCard