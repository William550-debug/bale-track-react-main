import React, { useEffect, useRef, useState } from 'react';
import { Chart } from "chart.js/auto";
import { useFinancialMetrics } from '../hooks/userFinancialMetrics.js'; // Adjust path as needed

const ExpenseComponent = () => {
  const expensesChartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  
  // Use your financial metrics hook
  const { financialMetrics, isLoading } = useFinancialMetrics();

  // Get theme (you can use your theme context or detect from document)
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // Detect current theme
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (!expensesChartRef.current || isLoading) return;

    const expensesCanvas = expensesChartRef.current;
    const expensesCtx = expensesCanvas.getContext("2d");

    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Get theme-aware colors
    const isDarkMode = theme === "dark";
    const textColor = isDarkMode ? "#F3F4F6" : "#2D3748";
    const gridColor = isDarkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)";
    const tooltipBgColor = isDarkMode ? "#1F2937" : "#FFFFFF";
    const tooltipTextColor = isDarkMode ? "#F3F4F6" : "#2D3748";

    // Set chart defaults
    Chart.defaults.color = textColor;
    Chart.defaults.plugins.tooltip.backgroundColor = tooltipBgColor;
    Chart.defaults.plugins.tooltip.titleColor = tooltipTextColor;
    Chart.defaults.plugins.tooltip.bodyColor = tooltipTextColor;
    Chart.defaults.plugins.tooltip.borderColor = isDarkMode ? "#4B5563" : "#E5E7EB";
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.legend.labels.color = textColor;
    Chart.defaults.scale.grid.color = gridColor;

    // Prepare chart data from actual expenses
    const prepareChartData = () => {
      // If no expense data, return default empty data
      if (!financialMetrics.expenseCategories || financialMetrics.expenseCategories.categories.length === 0) {
        return {
          labels: ["No Data"],
          data: [100],
          backgroundColor: ["#A0AEC0"],
          total: 0
        };
      }

      const categories = financialMetrics.expenseCategories.categories;
      
      return {
        labels: categories.map(cat => 
          cat.name.charAt(0).toUpperCase() + cat.name.slice(1)
        ),
        data: categories.map(cat => cat.amount),
        backgroundColor: categories.map(cat => getCategoryColor(cat.name)),
        total: financialMetrics.expenseCategories.total
      };
    };

    const chartData = prepareChartData();

    // Create new chart instance
    const newChartInstance = new Chart(expensesCtx, {
      type: "doughnut",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.data,
            backgroundColor: chartData.backgroundColor,
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
              usePointStyle: true,
              padding: 15,
              font: {
                size: 11
              }
            },
          },
          tooltip: {
            backgroundColor: tooltipBgColor,
            titleColor: tooltipTextColor,
            bodyColor: tooltipTextColor,
            borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${label}: Ksh ${value.toLocaleString()} (${percentage}%)`;
              }
            }
          },
        },
        cutout: "70%",
        animation: {
          animateScale: true,
          animateRotate: true
        }
      },
    });

    setChartInstance(newChartInstance);

    // Cleanup function
    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [financialMetrics, isLoading, theme]);

  // Helper function to get category colors
  const getCategoryColor = (category) => {
    const colorMap = {
      transport: "#5D5FEF",
      utilities: "#4FD1C5",
      salaries: "#ED8936",
      supplies: "#48BB78",
      other: "#A0AEC0"
    };
    return colorMap[category] || "#A0AEC0";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-sm md:text-base text-dark dark:text-white">
            Expense Breakdown
          </h2>
        </div>
        <div className="h-48 md:h-64 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Loading expenses...</div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!financialMetrics.expenseCategories || financialMetrics.expenseCategories.categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-sm md:text-base text-dark dark:text-white">
            Expense Breakdown
          </h2>
        </div>
        <div className="h-48 md:h-64 flex flex-col items-center justify-center text-center">
          <div className="text-4xl mb-2">💸</div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">No expenses recorded</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Add expenses to see the breakdown
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-sm md:text-base text-dark dark:text-white">
          Expense Breakdown
        </h2>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Total: Ksh {financialMetrics.expenseCategories.total.toLocaleString()}
        </div>
      </div>
      <div className="h-48 md:h-64">
        <canvas ref={expensesChartRef} />
      </div>
      
      {/* Optional: Category breakdown summary */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {financialMetrics.expenseCategories.categories.map((category) => (
          <div 
            key={category.name} 
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
          >
            <div className="flex items-center">
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: getCategoryColor(category.name) }}
              ></div>
              <span className="capitalize truncate">{category.name}</span>
            </div>
            <div className="text-right">
              <div className="font-medium">Ksh {category.amount.toLocaleString()}</div>
              <div className="text-gray-500">{Math.round(category.percentage)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseComponent;