import React from 'react';
import { SavingsContext } from "../context/SavingsContext";
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';


const SavingsGoal = () => {
  
   const {
      savings,
      isLoading,
      error,
      savingsStats,
      createSaving,
      fetchSavingsStats,
      handleNewGoal
    } = useContext(SavingsContext);
  
    const navigate = useNavigate();

  
  return (
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
  );
};

export default SavingsGoal;