import { ChartBarIcon } from '@heroicons/react/24/outline'

const Analytics = () => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">Interaction Analytics</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Detailed user interaction metrics</p>
      <div className="border border-dashed border-gray-200 dark:border-gray-600 rounded-lg h-96 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
        <ChartBarIcon className="w-12 h-12 mb-4" />
        <p>Analytics dashboard coming soon</p>
      </div>
    </div>
  )
}

export default Analytics