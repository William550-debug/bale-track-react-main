import { 
  Squares2X2Icon,
  UsersIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftEllipsisIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useTheme } from '../context/ThemeProvider'

const Sidebar = ({ isOpen, toggleSidebar, currentPage, setCurrentPage }) => {
  const { darkMode, toggleDarkMode } = useTheme()
  
  const navItems = [
    { name: 'Dashboard', icon: Squares2X2Icon, page: 'dashboard' },
    { name: 'User Management', icon: UsersIcon, page: 'user-management' },
    { name: 'Complaints', icon: ExclamationTriangleIcon, page: 'complaints' },
    { name: 'Feedback Portal', icon: ChatBubbleLeftEllipsisIcon, page: 'feedback' },
    { name: 'Interaction Analytics', icon: ChartBarIcon, page: 'analytics' },
    { name: 'Settings', icon: Cog6ToothIcon, page: 'settings' },
  ]

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <aside 
        className={`fixed lg:relative z-40 w-64 h-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out 
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}  flex flex-col`}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center text-primary-600 dark:text-primary-400 font-bold text-xl">
            <span className="mr-2">🧶</span>
            <span>BaleTrack</span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="px-4 py-1">
                <button
                  onClick={() => {
                    setCurrentPage(item.page)
                    if (window.innerWidth < 1024) toggleSidebar()
                  }}
                  className={`flex items-center w-full text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-4 py-3 transition-colors
                    ${currentPage === item.page ? 'bg-gray-50 dark:bg-gray-700 font-medium' : ''}`}
                >
                  <item.icon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                  <span>{item.name}</span>
                  {item.page === 'dashboard' && currentPage === 'dashboard' && (
                    <span className="ml-auto w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-100 dark:border-gray-700  ">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
            <button 
              onClick={() => toggleDarkMode(false)}
              className={`px-3 py-2 rounded-md transition-colors flex-1 text-center
                ${!darkMode ? 'bg-white dark:bg-gray-600 shadow' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}
            >
              <SunIcon className="w-5 h-5 mx-auto text-gray-600 dark:text-gray-300" />
            </button>
            <button 
              onClick={() => toggleDarkMode(true)}
              className={`px-3 py-2 rounded-md transition-colors flex-1 text-center
                ${darkMode ? 'bg-white dark:bg-gray-600 shadow' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}
            >
              <MoonIcon className="w-5 h-5 mx-auto text-gray-600 dark:text-gray-300" />
            </button>
            <button 
              onClick={() => toggleDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)}
              className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex-1 text-center"
            >
              <ComputerDesktopIcon className="w-5 h-5 mx-auto text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar