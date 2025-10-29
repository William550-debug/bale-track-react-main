// hooks/useDashboardData.js
import { useContext, useEffect, useState } from 'react';
import { BaleContext } from '../context/BaleContext';
import { ExpenseContext } from '../context/ExpenseContext';
import { SavingsContext } from '../context/SavingsContext';

export const useDashboardData = () => {
  
  
  const [dataLoaded, setDataLoaded] = useState(false);

 

  const baleContext = useContext(BaleContext);
  const expenseContext = useContext(ExpenseContext);
  const savingsContext = useContext(SavingsContext);  
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { fetchExpenseStats, fetchExpenses } = expenseContext;
  const { fetchSavingsStats, fetchSavings } = savingsContext;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        

        // Fetch all data in parallel
        const promises = [
          baleContext.fetchBalesStats?.() || Promise.resolve(),
          baleContext.fetchPurchases?.() || Promise.resolve(),
          baleContext.fetchSales?.() || Promise.resolve(),
          fetchExpenseStats?.() || Promise.resolve(),
          fetchExpenses?.() || Promise.resolve(),
          fetchSavingsStats?.() || Promise.resolve(),
          fetchSavings?.() || Promise.resolve(),
        ].filter(Boolean); // Remove undefined promises

        await Promise.allSettled(promises);

        // Check if we have at least some data with better validation
        const hasData = 
          (baleContext.purchases && baleContext.purchases.length > 0) ||
          (baleContext.sales && baleContext.sales.length > 0) ||
          (expenseContext.expenses && expenseContext.expenses.length > 0) ||
          (savingsContext.savings && savingsContext.savings.length > 0);

        setDataLoaded(hasData);
        
        if (!hasData) {
          console.warn('Dashboard loaded but no data found');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        setDataLoaded(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array - fetch once on mount

  return {
    // Context data
    baleContext,
    expenseContext,
    savingsContext,
    
    // Loading states
    isLoading,
    error,
    dataLoaded,
    
    // Individual loading states for granular control
    isBalesLoading: baleContext.isStatsLoading || baleContext.isLoading,
    isExpensesLoading: expenseContext.isStatsLoading || expenseContext.isLoading,
    isSavingsLoading: savingsContext.isStatsLoading || savingsContext.isLoading,
  };
};