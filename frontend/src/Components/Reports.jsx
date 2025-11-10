// Reports.jsx - Complete fixed version
import { useContext, useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { DocumentDownloadIcon, FilterIcon } from "@heroicons/react/outline";
import { ReportsContext } from "../context/ReportsContext";
import { BaleContext } from "../context/BaleContext";
import { ExpenseContext } from "../context/ExpenseContext";

const Reports = () => {
  const profitChartRef = useRef(null);
  const [timePeriod, setTimePeriod] = useState("monthly");

  // Get data from contexts
  const { exportLoading, exportError, exportFinancialReport, clearError } =
    useContext(ReportsContext);

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

  // Use local stats as fallback if server stats are not available
  const currentBalesStats = balesStats || localBalesStats;
  const currentExpenseStats = expenseStats || localExpenseStats;

  // Calculate period-based comparison
  const getPeriodComparisonText = (current, previous = 0) => {
    if (previous === 0) return "No previous data";
    const change = ((current - previous) / Math.abs(previous)) * 100;
    const isPositive = change >= 0;
    return `${isPositive ? "↑" : "↓"} ${Math.abs(change).toFixed(
      1
    )}% from last period`;
  };

  // Calculate comprehensive financial metrics
  const financialMetrics = {
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

    get expenseRatio() {
      return this.totalBalesSales > 0
        ? (this.totalCosts / this.totalBalesSales) * 100
        : 0;
    },
  };

  // Handle export using the context
  const handleExport = async (format) => {
    try {
      await exportFinancialReport(format, timePeriod);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  // Update expense stats when time period changes
  useEffect(() => {
    if (fetchExpenseStats) {
      const periodMap = {
        monthly: "thisMonth",
        quarterly: "thisYear",
      };
      fetchExpenseStats(periodMap[timePeriod] || "all");
    }
  }, [timePeriod, fetchExpenseStats]);

  // Chart setup (keep your existing chart code)
  useEffect(() => {
    let profitChartInstance = null;

    if (profitChartRef.current && !isBalesLoading && !isExpensesLoading) {
      const ctx = profitChartRef.current.getContext("2d");

      const textColor =
        getComputedStyle(document.documentElement).getPropertyValue(
          "--text-color"
        ) || "#2D3748";
      const gridColor =
        getComputedStyle(document.documentElement).getPropertyValue(
          "--grid-color"
        ) || "rgba(0, 0, 0, 0.1)";

      // Generate realistic data based on current metrics
      const generateChartData = () => {
        const baseRevenue = financialMetrics.totalBalesSales;
        const baseExpenses = financialMetrics.totalCosts;
        const baseProfit = financialMetrics.actualProfit;

        if (timePeriod === "monthly") {
          return {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            revenue: [
              baseRevenue * 0.7,
              baseRevenue * 0.8,
              baseRevenue * 0.75,
              baseRevenue * 0.9,
              baseRevenue * 0.95,
              baseRevenue,
            ],
            expenses: [
              baseExpenses * 0.6,
              baseExpenses * 0.7,
              baseExpenses * 0.8,
              baseExpenses * 0.85,
              baseExpenses * 0.9,
              baseExpenses,
            ],
            profit: [
              baseProfit * 0.8,
              baseProfit * 0.85,
              baseProfit * 0.7,
              baseProfit * 0.95,
              baseProfit * 1.05,
              baseProfit,
            ],
          };
        } else {
          return {
            labels: ["Q1", "Q2", "Q3", "Q4"],
            revenue: [
              baseRevenue * 0.7,
              baseRevenue * 0.85,
              baseRevenue * 0.9,
              baseRevenue,
            ],
            expenses: [
              baseExpenses * 0.6,
              baseExpenses * 0.8,
              baseExpenses * 0.9,
              baseExpenses,
            ],
            profit: [
              baseProfit * 0.75,
              baseProfit * 0.9,
              baseProfit * 0.95,
              baseProfit,
            ],
          };
        }
      };

      const chartData = generateChartData();

      profitChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Revenue (Sales)",
              data: chartData.revenue,
              backgroundColor: "#4FD1C5",
            },
            {
              label: "Total Costs",
              data: chartData.expenses,
              backgroundColor: "#F56565",
            },
            {
              label: "Net Profit",
              data: chartData.profit,
              backgroundColor: "#5D5FEF",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return "Ksh " + value.toLocaleString();
                },
                color: textColor,
              },
              grid: {
                color: gridColor,
              },
            },
            x: {
              ticks: {
                color: textColor,
              },
              grid: {
                display: false,
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
              callbacks: {
                label: function (context) {
                  return (
                    context.dataset.label +
                    ": Ksh " +
                    context.parsed.y.toLocaleString()
                  );
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (profitChartInstance) {
        profitChartInstance.destroy();
      }
    };
  }, [timePeriod, isBalesLoading, isExpensesLoading, financialMetrics]);

  const renderExportButtons = () => (
    <div className="flex space-x-2">
      <button
        onClick={() => handleExport("pdf")}
        disabled={exportLoading}
        className={`flex items-center text-sm px-3 py-2 rounded-lg ${
          exportLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }`}
      >
        {exportLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <DocumentDownloadIcon className="w-4 h-4 mr-1" />
            Export PDF
          </>
        )}
      </button>

      <button
        onClick={() => handleExport("excel")}
        disabled={exportLoading}
        className={`flex items-center text-sm px-3 py-2 rounded-lg ${
          exportLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-100 text-green-700 hover:bg-green-200"
        }`}
      >
        {exportLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <DocumentDownloadIcon className="w-4 h-4 mr-1" />
            Export Excel
          </>
        )}
      </button>
    </div>
  );

  const ExportErrorAlert = () => {
    if (!exportError) return null;

    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <span className="block sm:inline">Error: {exportError}</span>
        <button
          className="absolute top-0 right-0 p-2"
          onClick={() => clearError()}
        >
          <svg
            className="h-4 w-4 text-red-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  };

  // Loading state
  if (isBalesLoading || isExpensesLoading) {
    return (
      <div className="container mx-auto px-0 md:px-4 py-4 md:py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">
            Loading financial data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/50 backdrop:blur-s-m">
      <div className="container mx-auto px-4 py-6 sm:px-6  lg:px-8">
        {/**Header Section */}

        <header className="mb-10 ">
          <div className="flex  flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className=" px-5 ml-10 ">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Business Reports
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Real-time financial insights and analytics
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Time Period Toggle */}
              <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setTimePeriod("monthly")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    timePeriod === "monthly"
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimePeriod("quarterly")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    timePeriod === "quarterly"
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Quarterly
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md">
                  <FilterIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters</span>
                </button>
                <ExportErrorAlert />
                {renderExportButtons()}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content  
            
            
            <h1 className="text-xl md:text-2xl font-bold text-dark dark:text-white">
              Business Reports
            </h1>
            <div className="flex space-x-2">
              <button className="flex items-center text-gray-600 dark:text-gray-300 text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1">
                <FilterIcon className="w-4 h-4 mr-1" />
                Filters
              </button>
              <ExportErrorAlert />
              {renderExportButtons()}
            </div>
          </div>

          <div className="flex space-x-2 mb-4 md:mb-6 overflow-x-auto py-1">
            <button
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                timePeriod === "monthly"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setTimePeriod("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                timePeriod === "quarterly"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setTimePeriod("quarterly")}
            >
              Quarterly
            </button>*/}

        {/* Financial Overview - Dashboard Style */}
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                REVENUE
              </span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Ksh {financialMetrics.totalBalesSales.toLocaleString()}
            </p>
            <p className="text-green-600 dark:text-green-400 text-sm">
              {getPeriodComparisonText(financialMetrics.totalBalesSales)}
            </p>
          </div>

          {/* Net Profit */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ${
                  financialMetrics.actualProfit >= 0
                    ? "bg-blue-100 dark:bg-blue-900/20"
                    : "bg-red-100 dark:bg-red-900/20"
                }`}
              >
                <span className="text-2xl">
                  {financialMetrics.actualProfit >= 0 ? "💹" : "📉"}
                </span>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  financialMetrics.actualProfit >= 0
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                }`}
              >
                {financialMetrics.actualProfit >= 0 ? "PROFIT" : "LOSS"}
              </span>
            </div>
            <p
              className={`text-2xl lg:text-3xl font-bold mb-2 ${
                financialMetrics.actualProfit >= 0
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {financialMetrics.actualProfit >= 0 ? "+" : "-"}Ksh{" "}
              {Math.abs(financialMetrics.actualProfit).toLocaleString()}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {Math.abs(financialMetrics.profitMargin).toFixed(1)}% Margin
            </p>
          </div>

          {/* Efficiency */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">⚡</span>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">
                EFFICIENCY
              </span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {financialMetrics.expenseRatio.toFixed(1)}%
            </p>
            <p className="text-purple-600 dark:text-purple-400 text-sm">
              Expense Ratio
            </p>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Purchases
              </h3>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">📦</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Ksh {financialMetrics.totalBalesPurchases.toLocaleString()}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (financialMetrics.totalBalesPurchases /
                      financialMetrics.totalCosts) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-orange-600 dark:text-orange-400 text-sm mt-2">
              {(
                (financialMetrics.totalBalesPurchases /
                  financialMetrics.totalCosts) *
                100
              ).toFixed(1)}
              % of total costs
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Expenses
              </h3>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">🧾</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Ksh {financialMetrics.pureExpenses.toLocaleString()}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (financialMetrics.pureExpenses /
                      financialMetrics.totalCosts) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-red-600 dark:text-red-400 text-sm mt-2">
              {(
                (financialMetrics.pureExpenses / financialMetrics.totalCosts) *
                100
              ).toFixed(1)}
              % of total costs
            </p>
          </div>
        </div>

        {/* Cost Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Purchases Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Purchases
              </h3>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Ksh {financialMetrics.totalBalesPurchases.toLocaleString()}
            </p>
            <p className="text-orange-600 dark:text-orange-400 text-sm">
              {(
                (financialMetrics.totalBalesPurchases /
                  financialMetrics.totalCosts) *
                100
              ).toFixed(1)}
              % of total costs
            </p>
          </div>

          {/* Expenses Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Expenses
              </h3>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🧾</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Ksh {financialMetrics.pureExpenses.toLocaleString()}
            </p>
            <p className="text-red-600 dark:text-red-400 text-sm">
              {(
                (financialMetrics.pureExpenses / financialMetrics.totalCosts) *
                100
              ).toFixed(1)}
              % of total costs
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-6 gap-2">
          <h2 className="text-xl sm:text-xl font-bold bg-clip-text  bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400  text-gray-800 dark:text-gray-200">
            Financial Breakdown
          </h2>
          <div className="flex items-center space-x-2 self-end md:self-auto">
            <span className="px-2 sm:px-3  py-0.5 sm:py-2  text-[-10px] sm:text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200">
              {timePeriod === "monthly" ? "Monthly" : "Quarterly"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:gap-4 md:gap-6">
          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-emerald-900/20 dark:to-green-900/20 p-5 rounded-xl border border-green-100 dark:border-emerald-900/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-emerald-800 dark:text-emerald-200 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Revenue Sources
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                +{financialMetrics.profitMargin.toFixed(1)}% margin
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Bales Sales
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Ksh {financialMetrics.totalBalesSales.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-emerald-100 dark:border-emerald-900/30">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Total Revenue
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  Ksh {financialMetrics.totalBalesSales.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Costs Card */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 md:p-5 rounded-xl border border-red-100 dark:border-orange-900/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-red-800 dark:text-orange-200 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Cost Breakdown
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200">
                {financialMetrics.expenseRatio.toFixed(1)}% ratio
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Bales Purchases
                </span>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  Ksh {financialMetrics.totalBalesPurchases.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Operating Expenses
                </span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  Ksh {financialMetrics.pureExpenses.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-orange-100 dark:border-orange-900/30">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Total Costs
                </span>
                <span className="font-bold text-red-700 dark:text-red-300">
                  Ksh {financialMetrics.totalCosts.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Result Card */}
        <div
          className={`mt-4 md:mt-6  p-4 md:p-5 rounded-xl border ${
            financialMetrics.actualProfit >= 0
              ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50"
              : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/50"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-3 md:mb-0">
              <svg
                className={`w-6 h-6 mr-2 ${
                  financialMetrics.actualProfit >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {financialMetrics.actualProfit >= 0 ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
                  />
                )}
              </svg>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Net {financialMetrics.actualProfit >= 0 ? "Profit" : "Loss"}
              </span>
            </div>
            <div className="flex items-center">
              <span
                className={`text-2xl font-bold ${
                  financialMetrics.actualProfit >= 0
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {financialMetrics.actualProfit >= 0 ? "+" : "-"}Ksh{" "}
                {Math.abs(financialMetrics.actualProfit).toLocaleString()}
              </span>
              <span
                className={`ml-3 px-2 py-1 text-xs rounded-full ${
                  financialMetrics.actualProfit >= 0
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                }`}
              >
                {financialMetrics.actualProfit >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(financialMetrics.profitMargin).toFixed(1)}%
              </span>
            </div>
          </div>
          {financialMetrics.actualProfit >= 0 ? (
            <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
              Your business is profitable this period. Keep up the good work!
            </p>
          ) : (
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              Consider reviewing expenses to improve profitability.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 mb-6">
        <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
          Profitability Trend
        </h2>
        <div className="h-64">
          <canvas ref={profitChartRef}></canvas>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex-shrink-0"></div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Transaction Summary
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Financial overview and performance metrics
              </p>
            </div>
          </div>

          {/* Time Period Selector */}
          <div className="relative flex-shrink-0">
            <select
              className="appearance-none w-full sm:w-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl pl-4 pr-10 py-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
            >
              <option value="monthly">📅 Last 30 Days</option>
              <option value="quarterly">📊 This Quarter</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="lg:hidden space-y-4">
          {/* Bales Trading Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Bales Trading
                </h3>
              </div>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                Trading
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Purchases
                </p>
                <p className="text-orange-600 dark:text-orange-400 font-semibold text-lg">
                  Ksh {financialMetrics.totalBalesPurchases.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {currentBalesStats?.purchaseCount || 0} transactions
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Sales
                </p>
                <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                  Ksh {financialMetrics.totalBalesSales.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {currentBalesStats?.saleCount || 0} transactions
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Net Revenue
                </p>
                <p className="text-gray-900 dark:text-white font-semibold text-lg">
                  Ksh {financialMetrics.balesRevenue.toLocaleString()}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Profit Margin
                </p>
                <div className="flex items-center gap-1">
                  <p
                    className={`font-semibold text-lg ${
                      financialMetrics.balesRevenue >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {(
                      (financialMetrics.balesRevenue /
                        Math.max(financialMetrics.totalBalesSales, 1)) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                  {financialMetrics.balesRevenue >= 0 ? (
                    <span className="text-green-500 text-sm">↑</span>
                  ) : (
                    <span className="text-red-500 text-sm">↓</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Overall Business Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Overall Business
                </h3>
              </div>
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                Overall
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Total Costs
                </p>
                <p className="text-red-600 dark:text-red-400 font-semibold text-lg">
                  Ksh {financialMetrics.totalCosts.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  All costs combined
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Total Revenue
                </p>
                <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                  Ksh {financialMetrics.totalBalesSales.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Total revenue
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Net Result
                </p>
                <p className="text-gray-900 dark:text-white font-semibold text-lg">
                  Ksh {financialMetrics.actualProfit.toLocaleString()}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Profit Margin
                </p>
                <div className="flex items-center gap-1">
                  <p
                    className={`font-semibold text-lg ${
                      financialMetrics.actualProfit >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {financialMetrics.profitMargin.toFixed(1)}%
                  </p>
                  {financialMetrics.actualProfit >= 0 ? (
                    <span className="text-green-500 text-sm">↑</span>
                  ) : (
                    <span className="text-red-500 text-sm">↓</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Metric
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Purchases
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Sales
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Net Revenue
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Profit Margin
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Bales Trading Row */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200 group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Bales Trading
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <p className="text-orange-600 dark:text-orange-400 font-semibold">
                      Ksh{" "}
                      {financialMetrics.totalBalesPurchases.toLocaleString()}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {currentBalesStats?.purchaseCount || 0} transactions
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <p className="text-green-600 dark:text-green-400 font-semibold">
                      Ksh {financialMetrics.totalBalesSales.toLocaleString()}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {currentBalesStats?.saleCount || 0} transactions
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    Ksh {financialMetrics.balesRevenue.toLocaleString()}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold text-lg ${
                        financialMetrics.balesRevenue >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {(
                        (financialMetrics.balesRevenue /
                          Math.max(financialMetrics.totalBalesSales, 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                    {financialMetrics.balesRevenue >= 0 ? (
                      <span className="text-green-500 text-lg">↑</span>
                    ) : (
                      <span className="text-red-500 text-lg">↓</span>
                    )}
                  </div>
                </td>
              </tr>

              {/* Overall Business Row */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200 group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Overall Business
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                      Ksh {financialMetrics.totalCosts.toLocaleString()}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      All costs combined
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <p className="text-green-600 dark:text-green-400 font-semibold">
                      Ksh {financialMetrics.totalBalesSales.toLocaleString()}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      Total revenue
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    Ksh {financialMetrics.actualProfit.toLocaleString()}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold text-lg ${
                        financialMetrics.actualProfit >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {financialMetrics.profitMargin.toFixed(1)}%
                    </span>
                    {financialMetrics.actualProfit >= 0 ? (
                      <span className="text-green-500 text-lg">↑</span>
                    ) : (
                      <span className="text-red-500 text-lg">↓</span>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* ... */}
    </div>
  );
};

export default Reports;
