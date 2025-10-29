import { 
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const RecentUsersTable = () => {
  const users = [
    {
      initials: 'JD',
      name: 'John Doe',
      email: 'john.doe@example.com',
      lastActive: '2 minutes ago',
      status: 'Active',
      statusColor: 'green'
    },
    {
      initials: 'AS',
      name: 'Alice Smith',
      email: 'alice.smith@example.com',
      lastActive: '15 minutes ago',
      status: 'Active',
      statusColor: 'green'
    },
    {
      initials: 'BJ',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      lastActive: '1 hour ago',
      status: 'Idle',
      statusColor: 'yellow'
    },
    {
      initials: 'EM',
      name: 'Eve Miller',
      email: 'eve.miller@example.com',
      lastActive: '3 days ago',
      status: 'Inactive',
      statusColor: 'gray'
    }
  ]

  const statusClasses = {
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400'
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400'
    },
    gray: {
      bg: 'bg-gray-100 dark:bg-gray-600',
      text: 'text-gray-600 dark:text-gray-300'
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-600">
            <th className="pb-3 font-medium">User</th>
            <th className="pb-3 font-medium">Email</th>
            <th className="pb-3 font-medium">Last Active</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
          {users.map((user, index) => {
            const status = statusClasses[user.statusColor]
            return (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="py-4">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${status.bg} flex items-center justify-center ${status.text} font-semibold mr-3`}>
                      {user.initials}
                    </div>
                    <span className="text-sm dark:text-white">{user.name}</span>
                  </div>
                </td>
                <td className="py-4 text-sm dark:text-gray-300">{user.email}</td>
                <td className="py-4 text-sm dark:text-gray-300">{user.lastActive}</td>
                <td className="py-4">
                  <span className={`px-2.5 py-1 text-xs rounded-full ${status.bg} ${status.text} font-medium`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="text-primary-600 dark:text-primary-400 text-sm mr-3 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300 transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default RecentUsersTable