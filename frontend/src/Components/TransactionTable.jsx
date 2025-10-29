import React from 'react';
import { useFinancialMetrics } from "../hooks/userFinancialMetrics.js"

const TransactionTable = () => {
  const { financialMetrics, isLoading } = useFinancialMetrics();

  // Enhanced formatDate function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      
      if (diffMinutes < 1) {
        return 'Just now';
      } else if (diffHours < 1) {
        return `${diffMinutes} min ago`;
      } else if (diffDays === 0) {
        return `Today, ${date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })}`;
      } else if (diffDays === 1) {
        return `Yesterday, ${date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })}`;
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format amount with Ksh and proper signs
  const formatAmount = (amount, type) => {
    const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    const formattedAmount = `Ksh ${Math.abs(numericAmount).toLocaleString()}`;
    
    // Add sign for better readability
    if (type === 'Sale') {
      return `+${formattedAmount}`;
    } else if (type === 'Purchase' || type === 'Expense') {
      return `-${formattedAmount}`;
    }
    return formattedAmount;
  };

  // Get color based on transaction type
  const getAmountColor = (type) => {
    switch (type) {
      case 'Sale':
        return 'text-green-600 dark:text-green-400';
      case 'Purchase':
      case 'Expense':
        return 'text-red-600 dark:text-red-400';
      case 'Savings':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
      case 'Pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300';
      case 'Failed':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
          Recent Transactions
        </h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!financialMetrics.recentTransactions || financialMetrics.recentTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
          Recent Transactions
        </h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">💸</div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">No transactions yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Start adding purchases, sales, expenses, or savings to see them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
        Recent Transactions
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Description</th>
              <th className="pb-3 font-semibold">Type</th>
              <th className="pb-3 font-semibold">Amount</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {financialMetrics.recentTransactions.map((transaction) => (
              <tr key={transaction.id} className='hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <td className="py-3 text-xs md:text-sm text-dark dark:text-white">
                  {formatDate(transaction.date)}
                </td>
                <td className="py-3 text-xs md:text-sm text-dark dark:text-white">
                  {transaction.description}
                </td>
                <td className="py-3 text-xs md:text-sm text-dark dark:text-white capitalize">
                  {transaction.type.toLowerCase()}
                </td>
                <td className={`py-3 text-xs md:text-sm font-bold ${getAmountColor(transaction.type)}`}>
                  {formatAmount(transaction.amount, transaction.type)}
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Transaction summary */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Showing {financialMetrics.recentTransactions.length} recent transactions</span>
          <span>
            {financialMetrics.purchasesCount} purchases • 
            {financialMetrics.salesCount} sales • 
            {financialMetrics.expensesCount} expenses
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;