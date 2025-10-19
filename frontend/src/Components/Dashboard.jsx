import { useContext, useEffect, useRef, useState } from "react";
import StatCard from "./StatCard";
import SavingsGoal from "./SavingsGoal";
import TransactionTable from "./TransactionTable";
import Chart from "chart.js/auto";
import { useTheme } from "../context/ThemeProvider";
import LoginPopUp from "./Login";
import { AuthContext } from "../context/AuthContext.jsx";

import Profile from "./Profile.jsx";
const Dashboard = () => {
  const balesChartRef = useRef(null);
  const expensesChartRef = useRef(null);
  const { theme } = useTheme();
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, isAuthenticated } = useContext(AuthContext);

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  useEffect(() => {
    const balesCanvas = balesChartRef.current;
    const expensesCanvas = expensesChartRef.current;

    if (balesCanvas && expensesCanvas) {
      const balesCtx = balesCanvas.getContext("2d");
      const expensesCtx = expensesCanvas.getContext("2d");

      // Get theme-aware colors
      const isDarkMode = theme === "dark";
      const textColor = isDarkMode ? "#F3F4F6" : "#2D3748";
      const gridColor = isDarkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)";
      const tooltipBgColor = isDarkMode ? "#1F2937" : "#FFFFFF";
      const tooltipTextColor = isDarkMode ? "#F3F4F6" : "#2D3748";

      if (balesCanvas.chart) balesCanvas.chart.destroy();
      if (expensesCanvas.chart) expensesCanvas.chart.destroy();

      // Bales Chart
      balesCanvas.chart = new Chart(balesCtx, {
        type: "bar",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Bales Bought",
              data: [45, 32, 28, 51, 42, 19, 35],
              backgroundColor: "#5D5FEF",
              borderColor: "#5D5FEF",
              borderWidth: 1,
            },
            {
              label: "Bales Sold",
              data: [38, 29, 25, 47, 39, 15, 30],
              backgroundColor: "#4FD1C5",
              borderColor: "#4FD1C5",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: gridColor,
                drawBorder: false,
              },
              ticks: {
                color: textColor,
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: textColor,
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
            tooltip: {
              backgroundColor: tooltipBgColor,
              titleColor: tooltipTextColor,
              bodyColor: tooltipTextColor,
              borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
              borderWidth: 1,
            },
          },
        },
      });

      // Expenses Chart
      expensesCanvas.chart = new Chart(expensesCtx, {
        type: "doughnut",
        data: {
          labels: ["Transport", "Utilities", "Salaries", "Other"],
          datasets: [
            {
              data: [25, 20, 30, 25],
              backgroundColor: ["#5D5FEF", "#4FD1C5", "#ED8936", "#A0AEC0"],
              borderWidth: isDarkMode ? 1 : 0,
              borderColor: isDarkMode ? "#1F2937" : "transparent",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                color: textColor,
              },
            },
            tooltip: {
              backgroundColor: tooltipBgColor,
              titleColor: tooltipTextColor,
              bodyColor: tooltipTextColor,
              borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
              borderWidth: 1,
            },
          },
          cutout: "70%",
        },
      });
    }

    return () => {
      if (balesCanvas?.chart) balesCanvas.chart.destroy();
      if (expensesCanvas?.chart) expensesCanvas.chart.destroy();
    };
  }, [theme]); // Recreate charts when theme changes

  return (
    <>
      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center backdrop-blur-sm">
          <div className="relative">
            <button
              className="absolute top-3 right-6 w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 text-gray-500 hover:text-red-500 shadow-sm hover:shadow-md transition"
              onClick={() => setShowLogin(false)}
            >
              ✕
            </button>
            <LoginPopUp setShowLogin={setShowLogin} />
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8 mt-8 mx-8">
        {/* Left side - Title */}
        <div className="ml-8">
          <h1 className="text-xl md:text-2xl font-bold text-dark dark:text-white">
            Bale Trading Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
            Track your bale transactions and profitability
          </p>
        </div>

        {/* Right side - Auth section */}
        <div className="relative flex items-center gap-4">
          {/* Welcome message with dropdown trigger */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right dark:text-gray-300">
              Welcome Back,
              <span className="font-medium ml-1">
                {isAuthenticated ? user?.name : "Guest"}
              </span>
            </div>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user?.name?.charAt(0).toUpperCase() || "G"}
                  </span>
                </button>

                {/* Profile dropdown */}
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md  shadow-lg   opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Profile />
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 h-9 text-sm bg-primary text-white rounded-full font-semibold hover:bg-indigo-600 hover:ring-2 ring-indigo-400 transition-all duration-200 flex items-center justify-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign In
              </button>
            )}
          </div>

          {/* Mobile version (simplified) */}
          <div className="sm:hidden ">
            {isAuthenticated ? (
              <div className="relative">
                <div className="flex flex-row items-center gap-2">
                  <button
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700"
                    onClick={handleProfileClick}
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user?.name?.charAt(0).toUpperCase() || "G"}
                    </span>
                  </button>
                  <div className="text-right dark:text-gray-300">
                    Welcome Back,
                    <span className="font-medium ml-1">
                      {isAuthenticated ? user?.name : "Guest"}
                    </span>
                  </div>
                </div>
                {showProfile && (
                  <div className=" right-[2rem] mt-2 w-56 rounded-md   z-50">
                    <div className="py-1">
                      <Profile />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 ml-6 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 mr-6">
        <StatCard
          title="Today's Profit"
          value="Ksh 245,800"
          trend="↑ 12% from yesterday"
          trendColor="success"
          icon="💰"
          iconBg="blue-100 dark:bg-blue-900"
          iconColor="primary dark:text-blue-300"
        />
        <StatCard
          title="Warehouse Stock"
          value="142 bales"
          trend="↓ 5% from last week"
          trendColor="danger"
          icon="🧶"
          iconBg="teal-100 dark:bg-teal-900"
          iconColor="secondary dark:text-teal-300"
        />
        <StatCard
          title="Monthly Expenses"
          value="Ksh 178,500"
          trend="↑ 8% from last month"
          trendColor="success"
          icon="💸"
          iconBg="orange-100 dark:bg-orange-900"
          iconColor="warning dark:text-orange-300"
        />
        <StatCard
          title="Total Savings"
          value="Ksh 1,245,300"
          trend="↑ 23% towards goals"
          trendColor="success"
          icon="🏦"
          iconBg="red-100 dark:bg-red-900"
          iconColor="danger dark:text-red-300"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 ml-6 mr-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-sm md:text-base text-dark dark:text-white">
              Bales Bought vs Sold (Last 7 Days)
            </h2>
          </div>
          <div className="h-48 md:h-64">
            <canvas ref={balesChartRef} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-sm md:text-base text-dark dark:text-white">
              Saving Goals
            </h2>
          </div>
          <div className="space-y-4">
            <SavingsGoal />
            
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 ml-6 mr-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-sm md:text-base text-dark dark:text-white">
              Recent Transactions
            </h2>
          </div>
          <TransactionTable />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-sm md:text-base text-dark dark:text-white">
              Expense Breakdown
            </h2>
          </div>
          <div className="h-48 md:h-64">
            <canvas ref={expensesChartRef} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
