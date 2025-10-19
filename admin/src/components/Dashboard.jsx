import StatsCard from './StatsCard'
import UserActivityChart from './UserActivityChart'
import FeedbackChart from './FeedbackChart'
import RecentUsersTable from './RecentUsersTable'
import UserEngagement from './UserManagement'

const Dashboard = () => {
  const stats = [
    {
      title: 'Active Users',
      value: '1,248',
      change: '12% from yesterday',
      icon: 'users',
      trend: 'up',
      color: 'blue'
    },
    {
      title: 'New Complaints',
      value: '24',
      change: '5% from last week',
      icon: 'exclamation',
      trend: 'down',
      color: 'red'
    },
    {
      title: 'Feedback Received',
      value: '48',
      change: '8% from last month',
      icon: 'comment',
      trend: 'up',
      color: 'green'
    },
    {
      title: 'Avg. Session',
      value: '4m 32s',
      change: 'No change',
      icon: 'clock',
      trend: 'neutral',
      color: 'yellow'
    }
  ]

  return (
    <div className='h-full'>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-8">
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <h2 className="font-bold text-base dark:text-white">User Activity (Last 7 Days)</h2>
            <div className="flex space-x-2">
              <button className="text-xs px-3 py-1.5 bg-primary-600 dark:bg-primary-500 text-white rounded-lg">Week</button>
              <button className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors">Month</button>
              <button className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors">Year</button>
            </div>
          </div>
          <div className="chart-container">
            <UserActivityChart />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow mb-5">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-base dark:text-white">Feedback Distribution</h2>
            <button className="text-xs text-primary-600 dark:text-primary-400 font-medium">View details</button>
          </div>
          <div className="chart-container">
            <FeedbackChart />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 ">
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <h2 className="font-bold text-base dark:text-white">Recent Users</h2>
            <button className="text-xs text-primary-600 dark:text-primary-400 font-medium px-3 py-1.5 border border-primary-600 dark:border-primary-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">View All</button>
          </div>
          <RecentUsersTable />
        </div>
        
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow ">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-base dark:text-white">User Engagement</h2>
            <button className="text-xs text-primary-600 dark:text-primary-400 font-medium">View details</button>
          </div>
          <UserEngagement />
        </div>
      </div>
    </div>
  )
}

export default Dashboard