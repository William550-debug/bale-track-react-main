import React from 'react';

const StatCard = ({ title, value, trend, trendColor, icon, iconBg, iconColor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-semibold">{title}</p>
          <p className="text-xl md:text-2xl font-bold mt-1 text-dark dark:text-white">{value}</p>
          <p className={`text-${trendColor} text-xs font-semibold mt-1 flex items-center`}>
            <span>{trend}</span>
          </p>
        </div>
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-${iconBg} flex items-center justify-center text-${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;