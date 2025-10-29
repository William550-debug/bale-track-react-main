// components/BalesChart.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { useFinancialMetrics } from '../hooks/userFinancialMetrics.js';

const BalesChart = () => {
  const balesChartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const { financialMetrics, isLoading } = useFinancialMetrics();

  // Get theme state
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (!balesChartRef.current || isLoading) return;

    const balesCanvas = balesChartRef.current;
    const balesCtx = balesCanvas.getContext('2d');

    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Get theme-aware colors
    const isDarkMode = theme === 'dark';
    const textColor = isDarkMode ? '#F3F4F6' : '#2D3748';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const tooltipBgColor = isDarkMode ? '#1F2937' : '#FFFFFF';
    const tooltipTextColor = isDarkMode ? '#F3F4F6' : '#2D3748';

    // Set chart defaults
    Chart.defaults.color = textColor;
    Chart.defaults.plugins.tooltip.backgroundColor = tooltipBgColor;
    Chart.defaults.plugins.tooltip.titleColor = tooltipTextColor;
    Chart.defaults.plugins.tooltip.bodyColor = tooltipTextColor;
    Chart.defaults.plugins.tooltip.borderColor = isDarkMode ? '#4B5563' : '#E5E7EB';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.legend.labels.color = textColor;
    Chart.defaults.scale.grid.color = gridColor;

    // Prepare chart data
    const chartData = financialMetrics.balesChartData || {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      purchasesData: [0, 0, 0, 0, 0, 0, 0],
      salesData: [0, 0, 0, 0, 0, 0, 0]
    };

    // Create new chart instance
    const newChartInstance = new Chart(balesCtx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Bales Purchased',
            data: chartData.purchasesData,
            backgroundColor: '#5D5FEF',
            borderColor: '#5D5FEF',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
          {
            label: 'Bales Sold',
            data: chartData.salesData,
            backgroundColor: '#4FD1C5',
            borderColor: '#4FD1C5',
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
        interaction: {
          mode: 'index',
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
              callback: function(value) {
                return 'Ksh ' + value.toLocaleString();
              },
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
            position: 'top',
            labels: {
              color: textColor,
              usePointStyle: true,
              padding: 15,
              font: {
                size: 12
              }
            },
          },
          tooltip: {
            backgroundColor: tooltipBgColor,
            titleColor: tooltipTextColor,
            bodyColor: tooltipTextColor,
            borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                const index = context.dataIndex;
                
                // Show quantity information in tooltip
                const quantities = context.dataset.label === 'Bales Purchased' 
                  ? financialMetrics.balesChartData?.quantitiesPurchased[index] || 0
                  : financialMetrics.balesChartData?.quantitiesSold[index] || 0;
                
                return [
                  `${label}: Ksh ${value.toLocaleString()}`,
                  `Quantity: ${quantities} bales`
                ];
              }
            }
          },
          title: {
            display: true,
            text: 'Weekly Bales Activity',
            color: textColor,
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              bottom: 20
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
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
          <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
        </div>
      </div>
    );
  }

  // Calculate summary stats
  const totalPurchases = financialMetrics.balesChartData?.totalPurchases || 0;
  const totalSales = financialMetrics.balesChartData?.totalSales || 0;
  const netRevenue = totalSales - totalPurchases;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-sm md:text-base text-dark dark:text-white">
          Bales Activity (Last 7 Days)
        </h2>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Updated just now
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Ksh {totalPurchases.toLocaleString()}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Total Purchases
          </div>
        </div>
        <div className="text-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            Ksh {totalSales.toLocaleString()}
          </div>
          <div className="text-xs text-teal-600 dark:text-teal-400 mt-1">
            Total Sales
          </div>
        </div>
        <div className={`text-center p-3 rounded-lg ${
          netRevenue >= 0 
            ? 'bg-green-50 dark:bg-green-900/20' 
            : 'bg-red-50 dark:bg-red-900/20'
        }`}>
          <div className={`text-2xl font-bold ${
            netRevenue >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {netRevenue >= 0 ? '+' : ''}Ksh {Math.abs(netRevenue).toLocaleString()}
          </div>
          <div className={`text-xs mt-1 ${
            netRevenue >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            Net Revenue
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 md:h-64">
        <canvas ref={balesChartRef} />
      </div>

      {/* Additional Info */}
      <div className="mt-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <div>
          <span className="inline-block w-3 h-3 bg-[#5D5FEF] rounded-full mr-1"></span>
          Purchases: {financialMetrics.balesChartData?.totalQuantityPurchased || 0} bales
        </div>
        <div>
          <span className="inline-block w-3 h-3 bg-[#4FD1C5] rounded-full mr-1"></span>
          Sales: {financialMetrics.balesChartData?.totalQuantitySold || 0} bales
        </div>
        <div className={`font-medium ${
          netRevenue >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {netRevenue >= 0 ? '↑ Profitable' : '↓ Loss'} Week
        </div>
      </div>
    </div>
  );
};

export default BalesChart;