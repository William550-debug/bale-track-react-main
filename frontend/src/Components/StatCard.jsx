// Updated StatCard.jsx with safe color classes
import React from "react";

const StatCard = ({
  title,
  value,
  trend,
  trendColor,
  icon,
  iconBg,
  iconColor,
}) => {
  // Safe color mappings
  const trendColorMap = {
    success: "text-green-600 dark:text-green-400",
    danger: "text-red-600 dark:text-red-400",
    warning: "text-orange-600 dark:text-orange-400",
  };

  const iconBgMap = {
    "blue-100": "bg-blue-100 dark:bg-blue-900",
    "teal-100": "bg-teal-100 dark:bg-teal-900",
    "orange-100": "bg-orange-100 dark:bg-orange-900",
    "red-100": "bg-red-100 dark:bg-red-900",
  };

  const iconColorMap = {
    primary: "text-blue-600 dark:text-blue-300",
    secondary: "text-teal-600 dark:text-teal-300",
    warning: "text-orange-600 dark:text-orange-300",
    danger: "text-red-600 dark:text-red-300",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-semibold">
            {title}
          </p>
          <p className="text-xl md:text-2xl font-bold mt-1 text-dark dark:text-white">
            {value}
          </p>
          <p
            className={`${
              trendColorMap[trendColor] || "text-gray-600"
            } text-xs font-semibold mt-1 flex items-center`}
          >
            <span>{trend}</span>
          </p>
        </div>
        <div
          className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${
            iconBgMap[iconBg] || "bg-gray-100"
          } flex items-center justify-center ${
            iconColorMap[iconColor] || "text-gray-600"
          }`}
        >
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
