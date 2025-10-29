// src/App.jsx
import { useState } from 'react'
import { ThemeProvider } from './context/ThemeProvider'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import NotificationCenter from './components/NotificationCenter'
import Dashboard from './components/Dashboard'
import UserManagement from './components/UserManagement'
import Complaints from './components/Complaints'
import Feedback from './components/Feedback'
import Analytics from './components/Analytics'
import Settings from './components/Settings'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen)

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'user-management':
        return <UserManagement />
      case 'complaints':
        return <Complaints />
      case 'feedback':
        return <Feedback />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen h-full">
        <div className="flex flex-col md:flex-row w-full">
          <Sidebar 
            isOpen={sidebarOpen} 
            toggleSidebar={toggleSidebar}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          
          <div className="flex-1 overflow-x-hidden">
            <Header 
              toggleSidebar={toggleSidebar}
              toggleNotifications={toggleNotifications}
            />
            
            <main className="p-4 md:p-6 lg:p-8 ">
              {renderPage()}
            </main>
          </div>
          
          <NotificationCenter 
            isOpen={notificationsOpen}
            toggleNotifications={toggleNotifications}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App