const UserEngagement = () => {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between text-sm mb-2 dark:text-white">
          <span>Bounce Rate</span>
          <span className="font-semibold">42%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-600 rounded-full h-2">
          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '42%' }}></div>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-2 dark:text-white">
          <span>Pages per Session</span>
          <span className="font-semibold">3.8</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-600 rounded-full h-2">
          <div className="bg-primary-600 h-2 rounded-full" style={{ width: '76%' }}></div>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-2 dark:text-white">
          <span>Avg. Session Duration</span>
          <span className="font-semibold">4m 32s</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-600 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-sm dark:text-white">Activity Heatmap</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">Last week</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          <div className="heatmap-day w-full h-6 bg-green-100 dark:bg-green-900/30 rounded hover:bg-green-200 dark:hover:bg-green-800" data-count="5"></div>
          <div className="heatmap-day w-full h-6 bg-green-200 dark:bg-green-800 rounded hover:bg-green-300 dark:hover:bg-green-700" data-count="10"></div>
          <div className="heatmap-day w-full h-6 bg-green-300 dark:bg-green-700 rounded hover:bg-green-400 dark:hover:bg-green-600" data-count="15"></div>
          <div className="heatmap-day w-full h-6 bg-green-400 dark:bg-green-600 rounded hover:bg-green-500 dark:hover:bg-green-500" data-count="20"></div>
          <div className="heatmap-day w-full h-6 bg-green-500 dark:bg-green-500 rounded hover:bg-green-600 dark:hover:bg-green-400" data-count="25"></div>
          <div className="heatmap-day w-full h-6 bg-green-300 dark:bg-green-700 rounded hover:bg-green-400 dark:hover:bg-green-600" data-count="15"></div>
          <div className="heatmap-day w-full h-6 bg-green-100 dark:bg-green-900/30 rounded hover:bg-green-200 dark:hover:bg-green-800" data-count="5"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  )
}

export default UserEngagement