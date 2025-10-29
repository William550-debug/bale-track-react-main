import { useContext, useEffect, useRef, useState } from "react";
import StatCard from "./StatCard";
import SavingsGoal from "./SavingsGoal";
import TransactionTable from "./TransactionTable";
import Chart from "chart.js/auto";
import { useTheme } from "../context/ThemeProvider";
import LoginPopUp from "./Login";
import { AuthContext } from "../context/AuthContext.jsx";

import Profile from "./Profile.jsx";
import { BaleContext } from "../context/BaleContext.jsx";

import { ExpenseContext } from "../context/ExpenseContext.jsx";
import { useFinancialMetrics } from "../hooks/userFinancialMetrics.js";
import ExpenseComponent from "./ExpenseComponent.jsx";
import BalesChart from "./BalesChart.jsx";

const Dashboard = () => {
  const { theme } = useTheme();
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, isAuthenticated } = useContext(AuthContext);

  const { financialMetrics, isLoading, error, hasData } = useFinancialMetrics();

  const {
    balesStats,
    localBalesStats,
    isStatsLoading: isBalesLoading,
  } = useContext(BaleContext);

  const {
    expenseStats,
    localExpenseStats,
    isStatsLoading: isExpensesLoading,
    fetchExpenseStats,
  } = useContext(ExpenseContext);

  // Format currency helper (consistent with Reports)
  const formatCurrency = (amount, showColor = false) => {
    if (isLoading) return "Loading...";

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    const formatted = formatter.format(Math.abs(amount));

    if (showColor) {
      return amount >= 0 ? formatted : `-${formatted}`;
    }

    return formatted;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  // Use local stats as fallback if server stats are not available
  const currentBalesStats = balesStats || localBalesStats;
  const currentExpenseStats = expenseStats || localExpenseStats;

  const calculateFinance = () => {
    return {
      // Bales metrics
      totalBalesSales: currentBalesStats?.totalSales || 0,
      totalBalesPurchases: currentBalesStats?.totalPurchases || 0,
      balesRevenue: currentBalesStats?.totalRevenue || 0,

      // Pure expenses
      pureExpenses: currentExpenseStats?.totalExpenses || 0,

      // Combined calculations
      get totalCosts() {
        return this.totalBalesPurchases + this.pureExpenses;
      },

      get actualProfit() {
        return this.totalBalesSales - this.totalCosts;
      },

      get profitMargin() {
        return this.totalBalesSales > 0
          ? (this.actualProfit / this.totalBalesSales) * 100
          : 0;
      },

      get theExpenseRatio() {
        return this.totalBalesSales > 0
          ? (this.totalCosts / this.totalBalesSales) * 100
          : 0;
      },
    };
  };

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
          title="Net profit / loss"
          value={
            calculateFinance().actualProfit >= 0
              ? formatCurrency(calculateFinance().actualProfit)
              : `-${formatCurrency(calculateFinance().actualProfit, true)}`
          }
          trend={
            calculateFinance().profitMargin >= 0
              ? "↑ Positive trend"
              : "↓ Needs improvement"
          }
          trendColor={
            calculateFinance().profitMargin >= 0
              ? "green-100 dark:bg-green-900"
              : "red-100 dark:bg-red-900"
          }
          icon="💰"
          iconBg={
            calculateFinance().actualProfit >= 0
              ? "green-100 dark:bg-green-900"
              : "red-100 dark:bg-red-900"
          }
          iconColor={
            calculateFinance().actualProfit >= 0
              ? "green-600 dark:text-green-300"
              : "red-600 dark:text-red-300"
          }
          subtitle={`Margin: ${financialMetrics.profitMargin.toFixed(1)}%`}
          isLoading={isLoading}
        />

        {/* Warehouse Stock Card */}
        <StatCard
          title="Warehouse Stock"
          value={
            isLoading
              ? "Loading..."
              : `${financialMetrics.warehouseStock} Bales`
          }
          trend={financialMetrics.stockTrend}
          trendColor={financialMetrics.stockTrendColor}
          icon="🧶"
          iconBg={
            financialMetrics.warehouseStock > 50
              ? "green-100 dark:bg-green-900"
              : financialMetrics.warehouseStock > 20
              ? "yellow-100 dark:bg-yellow-900"
              : "red-100 dark:bg-red-900"
          }
          iconColor={
            financialMetrics.warehouseStock > 50
              ? "green-600 dark:text-green-300"
              : financialMetrics.warehouseStock > 20
              ? "yellow-600 dark:text-yellow-300"
              : "red-600 dark:text-red-300"
          }
          subtitle={`${financialMetrics.purchasesCount} purchases`}
          isLoading={isLoading}
        />

        {/* Monthly Expenses Card */}
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(financialMetrics.pureExpenses)}
          trend={financialMetrics.expensesTrend}
          trendColor={financialMetrics.expensesTrendColor}
          icon="💸"
          iconBg={
            financialMetrics.pureExpenses > 10000
              ? "red-100 dark:bg-red-900"
              : financialMetrics.pureExpenses > 5000
              ? "yellow-100 dark:bg-yellow-900"
              : "green-100 dark:bg-green-900"
          }
          iconColor={
            financialMetrics.pureExpenses > 10000
              ? "red-600 dark:text-red-300"
              : financialMetrics.pureExpenses > 5000
              ? "yellow-600 dark:text-yellow-300"
              : "green-600 dark:text-green-300"
          }
          subtitle={`${
            financialMetrics.currentExpenseStats?.count || 0
          } expense entries`}
          isLoading={isLoading}
        />

        {/* Total Savings Card */}
        <StatCard
          title="Total Savings"
          value={formatCurrency(financialMetrics.totalSavings)}
          trend={financialMetrics.savingsTrend}
          trendColor={financialMetrics.savingsTrendColor}
          icon="🏦"
          iconBg={
            financialMetrics.totalSavings > 50000
              ? "green-100 dark:bg-green-900"
              : financialMetrics.totalSavings > 20000
              ? "yellow-100 dark:bg-yellow-900"
              : "red-100 dark:bg-red-900"
          }
          iconColor={
            financialMetrics.totalSavings > 50000
              ? "green-600 dark:text-green-300"
              : financialMetrics.totalSavings > 20000
              ? "yellow-600 dark:text-yellow-300"
              : "red-600 dark:text-red-300"
          }
          subtitle="Total accumulated savings"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 ml-6 mr-6">
        <div className="lg:col-span-2">
          <BalesChart />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <SavingsGoal />
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
          <ExpenseComponent />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
