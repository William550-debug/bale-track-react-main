import { BellIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { useTheme } from '../context/ThemeProvider'

const Header = ({ toggleSidebar, toggleNotifications }) => {
  const { darkMode: _darkMode } = useTheme()

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4 p-4 md:p-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden w-9 h-9 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
        <div className='mt-6 ml-5'>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Overview of system metrics and activities</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto mr-6 mt-6">
        <button 
          onClick={toggleNotifications}
          className="relative w-9 h-9 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="text-right hidden sm:block">
          <div className="font-semibold text-sm dark:text-white">Admin User</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">Super Admin</div>
        </div>
        
        <div className="w-9 h-9 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white font-semibold hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors cursor-pointer">
          AU
        </div>
      </div>
    </header>
  )
}

export default Header