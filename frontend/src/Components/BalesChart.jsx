// components/BalesChart.jsx
import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { useFinancialMetrics } from "../hooks/userFinancialMetrics.js";

const BalesChart = () => {
  const balesChartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const { financialMetrics, isLoading } = useFinancialMetrics();

  // Get theme state
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (!balesChartRef.current || isLoading) return;

    const balesCanvas = balesChartRef.current;
    const balesCtx = balesCanvas.getContext("2d");

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
    Chart.defaults.plugins.tooltip.borderColor = isDarkMode
      ? "#4B5563"
      : "#E5E7EB";
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.legend.labels.color = textColor;
    Chart.defaults.scale.grid.color = gridColor;

    // Prepare chart data
    const chartData = financialMetrics.balesChartData || {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      purchasesData: [0, 0, 0, 0, 0, 0, 0],
      salesData: [0, 0, 0, 0, 0, 0, 0],
    };

    // Helper functions for responsive chart configuration
    const getAspectRatio = () => {
      const width = window.innerWidth;
      if (width < 640) return 1.2; // Taller on mobile
      if (width < 768) return 1.5; // Medium on tablet
      if (width < 1024) return 1.8; // Wider on desktop
      return 2.0; // Widest on large screens
    };

    const getFontSize = (type) => {
      const width = window.innerWidth;
      const baseSizes = {
        axis: { xs: 10, sm: 11, md: 12, lg: 12 },
        legend: { xs: 10, sm: 11, md: 12, lg: 12 },
        tooltip: { xs: 11, sm: 12, md: 13, lg: 13 },
        title: { xs: 14, sm: 15, md: 16, lg: 16 },
      };

      if (width < 475) return baseSizes[type].xs;
      if (width < 640) return baseSizes[type].sm;
      if (width < 768) return baseSizes[type].md;
      return baseSizes[type].lg;
    };

    const getMaxTicksLimit = (axis) => {
      const width = window.innerWidth;
      if (axis === "y") {
        return width < 640 ? 5 : width < 768 ? 6 : 8;
      }
      return width < 640 ? 4 : width < 768 ? 6 : 8;
    };

    const getLegendPosition = () => {
      return window.innerWidth < 640 ? "bottom" : "top";
    };

    const getLegendPadding = () => {
      return window.innerWidth < 640 ? 10 : 15;
    };

    const getBoxWidth = () => {
      return window.innerWidth < 640 ? 8 : 12;
    };

    const getMaxRotation = () => {
      return window.innerWidth < 640 ? 45 : 0;
    };

    const getMinRotation = () => {
      return window.innerWidth < 640 ? 45 : 0;
    };

    const getTitleDisplay = () => {
      return window.innerWidth < 475 ? false : true; // Hide title on very small screens
    };

    const getTitlePadding = () => {
      return window.innerWidth < 640 ? 10 : 20;
    };

    const getTooltipPadding = () => {
      return window.innerWidth < 640 ? 8 : 12;
    };

    const getBarBorderWidth = () => {
      return window.innerWidth < 640 ? 0.5 : 1; // Thinner borders on mobile
    };

    const getChartPadding = () => {
      const width = window.innerWidth;
      if (width < 475) return { top: 10, right: 5, bottom: 10, left: 5 };
      if (width < 640) return { top: 10, right: 10, bottom: 15, left: 10 };
      return { top: 15, right: 15, bottom: 20, left: 15 };
    };

    // Helper to abbreviate large numbers on mobile
    const abbreviateNumber = (value) => {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + "M";
      }
      if (value >= 1000) {
        return (value / 1000).toFixed(1) + "K";
      }
      return value.toString();
    };

    // Create new chart instance
    const newChartInstance = new Chart(balesCtx, {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Bales Purchased",
            data: chartData.purchasesData,
            backgroundColor: "#5D5FEF",
            borderColor: "#5D5FEF",
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
          {
            label: "Bales Sold",
            data: chartData.salesData,
            backgroundColor: "#4FD1C5",
            borderColor: "#4FD1C5",
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // Set optimal aspect ratio for different screen sizes
        aspectRatio: getAspectRatio(),
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: gridColor,
              drawBorder: false,
            },
            ticks: {
              color: textColor,
              font: {
                size: getFontSize("axis"),
              },
              callback: function (value) {
                // Simplified formatting for mobile
                if (window.innerWidth < 640) {
                  return "Ksh " + abbreviateNumber(value);
                }
                return "Ksh " + value.toLocaleString();
              },
              maxTicksLimit: getMaxTicksLimit("y"),
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: textColor,
              font: {
                size: getFontSize("axis"),
              },
              maxRotation: getMaxRotation(),
              minRotation: getMinRotation(),
            },
          },
        },
        plugins: {
          legend: {
            position: getLegendPosition(),
            labels: {
              color: textColor,
              usePointStyle: true,
              padding: getLegendPadding(),
              font: {
                size: getFontSize("legend"),
              },
              boxWidth: getBoxWidth(),
            },
          },
          tooltip: {
            backgroundColor: tooltipBgColor,
            titleColor: tooltipTextColor,
            bodyColor: tooltipTextColor,
            borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
            borderWidth: 1,
            // Mobile-optimized tooltip
            position: "nearest",
            caretPadding: 10,
            bodyFont: {
              size: getFontSize("tooltip"),
            },
            titleFont: {
              size: getFontSize("tooltip"),
            },
            padding: getTooltipPadding(),
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || "";
                const value = context.parsed.y;
                const index = context.dataIndex;

                // Show quantity information in tooltip
                const quantities =
                  context.dataset.label === "Bales Purchased"
                    ? financialMetrics.balesChartData?.quantitiesPurchased[
                        index
                      ] || 0
                    : financialMetrics.balesChartData?.quantitiesSold[index] ||
                      0;

                // Simplified tooltip for mobile
                if (window.innerWidth < 640) {
                  return [
                    `${label}: Ksh ${abbreviateNumber(value)}`,
                    `Qty: ${quantities}b`,
                  ];
                }

                return [
                  `${label}: Ksh ${value.toLocaleString()}`,
                  `Quantity: ${quantities} bales`,
                ];
              },
            },
          },
          title: {
            display: getTitleDisplay(),
            text: "Weekly Bales Activity",
            color: textColor,
            font: {
              size: getFontSize("title"),
              weight: "bold",
            },
            padding: {
              bottom: getTitlePadding(),
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
        },
        // Mobile-specific optimizations
        elements: {
          bar: {
            borderWidth: getBarBorderWidth(),
          },
        },
        layout: {
          padding: getChartPadding(),
        },
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

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-sm md:text-base text-dark dark:text-white">
            Bales Activity
          </h2>
        </div>
        <div className="h-48 md:h-64 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">
            Loading chart...
          </div>
        </div>
      </div>
    );
  }

  // Calculate summary stats
  const totalPurchases = financialMetrics.balesChartData?.totalPurchases || 0;
  const totalSales = financialMetrics.balesChartData?.totalSales || 0;
  const netRevenue = totalSales - totalPurchases;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-5 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
        <h2 className="font-bold text-sm sm:text-base md:text-lg text-dark dark:text-white order-2 sm:order-1">
          Bales Activity (Last 7 Days)
        </h2>
        <div className="text-xs text-gray-500 dark:text-gray-400 order-1 sm:order-2 self-end sm:self-auto">
          Updated just now
        </div>
      </div>

      {/* Summary Stats - Responsive Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
            Ksh {totalPurchases.toLocaleString()}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Total Purchases
          </div>
        </div>
        <div className="text-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-teal-600 dark:text-teal-400">
            Ksh {totalSales.toLocaleString()}
          </div>
          <div className="text-xs text-teal-600 dark:text-teal-400 mt-1">
            Total Sales
          </div>
        </div>
        <div
          className={`text-center p-3 rounded-lg ${
            netRevenue >= 0
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-red-50 dark:bg-red-900/20"
          }`}
        >
          <div
            className={`text-xl sm:text-2xl font-bold ${
              netRevenue >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {netRevenue >= 0 ? "+" : ""}Ksh{" "}
            {Math.abs(netRevenue).toLocaleString()}
          </div>
          <div
            className={`text-xs mt-1 ${
              netRevenue >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            Net Revenue
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-40 sm:h-48 md:h-56 lg:h-64">
        <canvas ref={balesChartRef} />
      </div>

      {/* Additional Info - Stack on mobile */}
      <div className="mt-4 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-[#5D5FEF] rounded-full mr-2 flex-shrink-0"></span>
          <span>
            Purchases:{" "}
            {financialMetrics.balesChartData?.totalQuantityPurchased || 0} bales
          </span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-[#4FD1C5] rounded-full mr-2 flex-shrink-0"></span>
          <span>
            Sales: {financialMetrics.balesChartData?.totalQuantitySold || 0}{" "}
            bales
          </span>
        </div>
        <div
          className={`font-medium ${
            netRevenue >= 0 ? "text-green-600" : "text-red-600"
          } self-end xs:self-auto`}
        >
          {netRevenue >= 0 ? "↑ Profitable" : "↓ Loss"} Week
        </div>
      </div>
    </div>
  );
};

export default BalesChart;
