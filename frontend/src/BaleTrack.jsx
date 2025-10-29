import { useState, useEffect } from 'react';
import Sidebar from './Components/Sidebar';
import Dashboard from './Components/Dashboard';
import DataEntry from './Components/DataEntry';
import Savings from './Components/Savings';
import Reports from './Components/Reports';
import AuthForm from './Components/Login';
//import EmptyDashboard from './Components/DashboardEmpty';


const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768 && 
          !event.target.closest('.sidebar') && 
          !event.target.closest('[aria-label="Toggle menu"]')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close sidebar when navigating to a new page
  const handleNavigation = (page) => {
    setActivePage(page);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'data-entry':
        return <DataEntry />;
      case 'savings':
        return <Savings />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
  <>
    {showLogin && <AuthForm setShowLogin={setShowLogin} />}

    <div className="bg-gray-50 dark:bg-gray-900 flex min-h-screen font-inter transition-colors duration-200">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-primary dark:bg-primary-light text-white flex items-center justify-center shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <Sidebar 
        sidebarOpen={sidebarOpen} 
        activePage={activePage}
        onNavigate={handleNavigation}
      />


  
      
      <main className={`flex-1 transition-all duration-300 ml-0 ${sidebarOpen ? 'md:ml-64 opacity-50 md:opacity-100' : 'md:ml-64 opacity-100'}`}>
        {renderPage()}
      </main>
    </div>
  </>
);

}
