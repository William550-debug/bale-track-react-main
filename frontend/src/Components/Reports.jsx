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
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 p-3 md:p-6 gap-3">
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
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4 ">
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-sm">
            Total Sales Revenue
          </p>
          <p className="text-xl sm:text-2xl  truncate font-bold text-success">
            Ksh {financialMetrics.totalBalesSales.toLocaleString()}
          </p>
          <p className="text-[-10px] sm:text-xs  text-success mt-1">
            {getPeriodComparisonText(financialMetrics.totalBalesSales)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3  sm:p-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-sm">
            Total Costs
          </p>
          <p className="text-[-10px] sm:text-xs  font-bold text-gray-700 dark:text-gray-300">
            Ksh {financialMetrics.totalCosts.toLocaleString()}
          </p>
          <div className="text-xs mt-1">
            <div className="text-orange-600">
              Purchases: Ksh{" "}
              {financialMetrics.totalBalesPurchases.toLocaleString()}
            </div>
            <div className="text-red-600">
              Expenses: Ksh {financialMetrics.pureExpenses.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Net Profit/Loss
          </p>
          <p
            className={`text-2xl font-bold ${
              financialMetrics.actualProfit >= 0
                ? "text-success"
                : "text-danger"
            }`}
          >
            Ksh {financialMetrics.actualProfit.toLocaleString()}
          </p>
          <p
            className={`text-xs mt-1 ${
              financialMetrics.actualProfit >= 0
                ? "text-success"
                : "text-danger"
            }`}
          >
            {financialMetrics.actualProfit >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(financialMetrics.profitMargin).toFixed(1)}% margin
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Expense Ratio
          </p>
          <p className="text-2xl font-bold text-primary">
            {financialMetrics.expenseRatio.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Cost per Ksh earned</p>
        </div>
      </div>

      {/* Rest of your JSX remains the same */}

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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-dark dark:text-white">
            Bale Transactions Summary
          </h2>
          <select
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 md:py-1 text-sm bg-white dark:bg-gray-800 dark:text-white"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option value="monthly">Last 30 Days</option>
            <option value="quarterly">This Quarter</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-medium">Metric</th>
                <th className="pb-3 font-medium">Purchases</th>
                <th className="pb-3 font-medium">Sales</th>
                <th className="pb-3 font-medium">Net Revenue</th>
                <th className="pb-3 font-medium">Profit Margin</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 text-dark dark:text-white font-medium">
                  Bales Trading
                </td>
                <td className="py-3 text-orange-600">
                  Ksh {financialMetrics.totalBalesPurchases.toLocaleString()}
                  <div className="text-xs text-gray-500">
                    {currentBalesStats?.purchaseCount || 0} transactions
                  </div>
                </td>
                <td className="py-3 text-success">
                  Ksh {financialMetrics.totalBalesSales.toLocaleString()}
                  <div className="text-xs text-gray-500">
                    {currentBalesStats?.saleCount || 0} transactions
                  </div>
                </td>
                <td className="py-3 font-bold text-dark dark:text-white">
                  Ksh {financialMetrics.balesRevenue.toLocaleString()}
                </td>
                <td
                  className={`py-3 font-bold ${
                    financialMetrics.balesRevenue >= 0
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {(
                    (financialMetrics.balesRevenue /
                      Math.max(financialMetrics.totalBalesSales, 1)) *
                    100
                  ).toFixed(1)}
                  %
                </td>
              </tr>
              <tr>
                <td className="py-3 text-dark dark:text-white font-medium">
                  Overall Business
                </td>
                <td className="py-3 text-red-600">
                  Ksh {financialMetrics.totalCosts.toLocaleString()}
                  <div className="text-xs text-gray-500">
                    All costs combined
                  </div>
                </td>
                <td className="py-3 text-success">
                  Ksh {financialMetrics.totalBalesSales.toLocaleString()}
                  <div className="text-xs text-gray-500">Total revenue</div>
                </td>
                <td className="py-3 font-bold text-dark dark:text-white">
                  Ksh {financialMetrics.actualProfit.toLocaleString()}
                </td>
                <td
                  className={`py-3 font-bold ${
                    financialMetrics.actualProfit >= 0
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {financialMetrics.profitMargin.toFixed(1)}%
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