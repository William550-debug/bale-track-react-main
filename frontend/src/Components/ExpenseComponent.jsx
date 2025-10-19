import React from 'react'
import Chart from "chart.js/auto";
import { useRef } from 'react';

const ExpenseComponent = () => {
  const expensesChartRef = useRef(null);

  useEffect(() => {
    const expensesCanvas = expensesChartRef.current;

    if (expensesCanvas) {
      const expensesCtx = expensesCanvas.getContext("2d");

      // Get theme-aware colors
      const isDarkMode = theme === "dark";
      const textColor = isDarkMode ? "#F3F4F6" : "#2D3748";
      const gridColor = isDarkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)";
      const tooltipBgColor = isDarkMode ? "#1F2937" : "#FFFFFF";
      const tooltipTextColor = isDarkMode ? "#F3F4F6" : "#2D3748";

      if (expensesCanvas.chart) expensesCanvas.chart.destroy();

    }
    // Chart initialization
    Chart.defaults.color = textColor;
    Chart.defaults.plugins.tooltip.backgroundColor = tooltipBgColor;
    Chart.defaults.plugins.tooltip.titleColor = tooltipTextColor;
    Chart.defaults.plugins.tooltip.bodyColor = tooltipTextColor;
    Chart.defaults.plugins.tooltip.borderColor = isDarkMode ? "#4B5563" : "#E5E7EB";
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.legend.labels.color = textColor;
    Chart.defaults.scale.grid.color = gridColor;
  }, [theme]);




    //Expenses
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

        
  return (


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
  )



export default ExpenseComponent;
