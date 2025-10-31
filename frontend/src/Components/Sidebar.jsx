import {
  ChartBarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/outline";
import { useTheme } from "../context/ThemeProvider";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import FeedbackForm from "./FeebackForm";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ sidebarOpen, activePage, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const navItems = [
    {
      id: "/dashboard",
      icon: <ChartBarIcon className="h-5 w-5 mr-3" />,
      label: "Dashboard",
    },
    {
      id: "/data-entry",
      icon: <DocumentTextIcon className="h-5 w-5 mr-3" />,
      label: "Data Entry",
    },
    {
      id: "/savings",
      icon: <CurrencyDollarIcon className="h-5 w-5 mr-3" />,
      label: "Savings",
    },
    {
      id: "/reports",
      icon: <ChartPieIcon className="h-5 w-5 mr-3" />,
      label: "Reports",
    },
  ];

  return (
    <aside
      className={`sidebar w-64  bg-white dark:bg-gray-800 shadow-md fixed h-full transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 z-40`}
    >
      <div className="p-6 flex justify-between items-center">
        <div className="flex items-center text-primary dark:text-primary-light font-bold text-xl">
          <span className="mr-2">🧶</span>
          <span>BaleTrack</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full focus:outline-none text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={`Toggle ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <MoonIcon className="h-5 w-5" />
          ) : (
            <SunIcon className="h-5 w-5 text-yellow-300" />
          )}
        </button>
      </div>

      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="px-6 py-3">
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex items-center w-full text-left rounded-lg px-4 py-2 transition-colors duration-200 ${
                  activePage === item.id
                    ? "bg-primary-light dark:bg-gray-700 text-primary dark:text-white font-semibold"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section with user info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-light dark:bg-gray-700 flex items-center justify-center overflow-hidden mr-3 shadow-sm">
            <img
              src={assets.hand_icon}
              alt="Hand Icon"
              className="w-6 h-6 object-contain dark:invert"
              onClick={() => navigate("/feedback")}
            />
           
          </div>
          <div>
            <p className="text-sm font-medium text-dark dark:text-white">
              feedback / issues
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
