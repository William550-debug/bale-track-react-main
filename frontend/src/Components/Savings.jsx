import { useContext, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { DocumentDownloadIcon } from "@heroicons/react/outline";
import { SavingsContext } from "../context/SavingsContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth.js";
import { useNavigate } from "react-router-dom";
import { DocumentTextIcon } from "@heroicons/react/outline";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

const Savings = () => {
  const savingsChartRef = useRef(null);
  const { token } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const {
    savings,
    isLoading,
    error,
    savingsStats,
    createSaving,
    fetchSavingsStats,
    handleNewGoal,
  } = useContext(SavingsContext);

  const navigate = useNavigate();

  useEffect(() => {
    let savingsChartInstance = null;

    if (savingsChartRef.current && savings.length > 0) {
      const ctx = savingsChartRef.current.getContext("2d");
      const textColor =
        getComputedStyle(document.documentElement).getPropertyValue(
          "--text-color"
        ) || "#2D3748";

      // Group savings by month
      const monthlySavings = {};
      savings.forEach((saving) => {
        const date = new Date(saving.savingsDate);
        const month = date.toLocaleString("default", { month: "short" });
        monthlySavings[month] =
          (monthlySavings[month] || 0) + saving.savingsAmount;
      });

      // Get last 6 months
      const months = [];
      const amounts = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleString("default", { month: "short" });
        months.push(month);
        amounts.push(monthlySavings[month] || 0);
      }

      savingsChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: months,
          datasets: [
            {
              label: "Monthly Savings",
              data: amounts,
              borderColor: "#5D5FEF",
              backgroundColor: "#E0E1FF",
              tension: 0.3,
              fill: true,
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
                color: "rgba(0, 0, 0, 0.1)",
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
                  return "Ksh " + context.parsed.y.toLocaleString();
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (savingsChartInstance) {
        savingsChartInstance.destroy();
      }
    };
  }, [savings]);

  // Savings.jsx
  const handleExport = async (format = "pdf") => {
    try {
      const response = await axios.get(`${backendUrl}/savings/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
        params: { format },
      });

      const extension = format === "pdf" ? "pdf" : "xlsx";
      const filename = `savings_report_${new Date()
        .toISOString()
        .slice(0, 10)}.${extension}`;

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      toast.success(`Report downloaded as ${filename}`);
    } catch (err) {
      toast.error("Failed to export report");
      console.error("Export error:", err);
    }
  };

  // In your JSX, you can add format options:

  if (isLoading) {
    return (
      <div className="container mx-auto px-0 md:px-4 py-4 md:py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading savings data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-0 md:px-4 py-4 md:py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading savings: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0 md:px-4 py-4 md:py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="px-5 ml-10">
          <h1 className="text-xl md:text-2xl font-bold text-dark dark:text-white">
          Savings Overview
        </h1>
        </div>
        <Menu as="div" className="relative inline-block text-left md:flex">
          <div>
            <MenuButton className="inline-flex justify-center items-center text-primary text-sm hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-md">
              <DocumentDownloadIcon className="w-4 h-4 mr-1" />
              Export Report
              <ChevronDownIcon className="w-4 h-4 ml-1" aria-hidden="true" />
            </MenuButton>
          </div>
          {/*
            <div className="container mx-auto px-0 md:px-4 py-4 md:py-8 max-w-4xl">
      <div className="text-center mb-6 md:flex">
        <div className="p-8">
          <h1 className="mt-1 block text0lg leading-tight font-medium  text-dark dark:text-white ">
          Daily Data Entry
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Record your daily bale transactions, expenses, and savings
        </p>
        </div>
        
      </div>
            */}

          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => handleExport("pdf")}
                      className={`${
                        active ? "bg-gray-100 dark:bg-gray-700" : ""
                      } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                    >
                      Export as PDF
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => handleExport("excel")}
                      className={`${
                        active ? "bg-gray-100 dark:bg-gray-700" : ""
                      } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                    >
                      Export as Excel
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Total Saved
          </p>
          <p className="text-2xl font-bold text-primary dark:text-primary-light">
            Ksh {savingsStats.totals.overall?.toLocaleString() || "0"}
          </p>
          <p className="text-xs text-success mt-1">↑ 23% from last year</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">This Month</p>
          <p className="text-2xl font-bold text-success">
            Ksh{" "}
            {savingsStats.personal && savingsStats.business
              ? (savingsStats.personal + savingsStats.business).toLocaleString()
              : "0"}
          </p>
          <p className="text-xs text-danger mt-1">↓ 5% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Savings Rate
          </p>
          <p className="text-2xl font-bold text-secondary">
            {savingsStats.totals.overall > 0
              ? Math.round(
                  (savingsStats.totals.overall /
                    (savingsStats.totals.overall + 100000)) *
                    100
                )
              : 0}
            %
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            of total revenue
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-dark dark:text-white">
            Active Goals
          </h2>
          <button
            className="text-primary text-sm font-medium"
            onClick={handleNewGoal}
          >
            + New Goal
          </button>
        </div>

        <div className="space-y-4">
          {savingsStats.targetProgress?.map((goal) => (
            <div
              key={goal._id}
              className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-medium text-dark dark:text-white">
                  {goal.targetName}
                </h3>
                <span className="text-primary font-bold">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>Ksh {goal.savingsAmount?.toLocaleString()} saved</span>
                <span>Ksh {goal.targetAmount?.toLocaleString()} target</span>
              </div>
            </div>
          ))}
          {savingsStats.targetProgress?.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No active goals yet
            </p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
          Savings Trend
        </h2>
        <div className="h-64">
          <canvas ref={savingsChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default Savings;
