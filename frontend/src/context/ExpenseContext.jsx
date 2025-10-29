import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./useAuth.js";
import axios from "axios";

export const ExpenseContext = createContext(null);

const ExpenseContextProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [expenseStats, setExpenseStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const backendUrl = "https://biz-pulse-backend-jgbt.onrender.com";

  const fetchExpenses = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(response.data.data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError(error.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setIsLoading(false);
    }
  }, [token, backendUrl]);

  // Fetch expense statistics
  // In your ExpenseContext, update the fetchExpenseStats function to handle the new period parameters:
  const fetchExpenseStats = useCallback(
    async (period = "all", year = null, month = null) => {
      if (!token) return;

      setIsStatsLoading(true);
      setError(null);
      try {
        let url = `${backendUrl}/expenses/stats`;
        const params = new URLSearchParams();

        if (period) params.append("period", period);
        if (year) params.append("year", year);
        if (month) params.append("month", month);

        const response = await axios.get(`${url}?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenseStats(response.data.data);
      } catch (error) {
        console.error("Error fetching expense stats:", error);
        setError("Failed to fetch expense statistics");
      } finally {
        setIsStatsLoading(false);
      }
    },
    [token, backendUrl]
  );

  const createExpense = useCallback(
    async (expenseData) => {
      setIsLoading(true);
      try {
        const payload = {
          ...expenseData,
          expenseAmount: parseFloat(expenseData.expenseAmount),
        };
        const response = await axios.post(`${backendUrl}/expenses`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExpenses((prev) => [...prev, response.data.data.expense]);

        // Refresh stats after creating expense
        await fetchExpenseStats();

        return response.data.data.expense;
      } catch (error) {
        console.error("Error creating expense:", error);
        throw new Error(
          error.response?.data?.message || "Failed to create expense"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token, backendUrl, fetchExpenseStats]
  );

  const updateExpenses = useCallback(
    async (expenseId, expenseData) => {
      setIsLoading(true);
      try {
        const payload = {
          ...expenseData,
          expenseAmount: parseFloat(expenseData.expenseAmount),
        };
        const response = await axios.patch(
          `${backendUrl}/expenses/${expenseId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setExpenses((prev) =>
          prev.map((exp) =>
            exp._id === expenseId ? response.data.data.expense : exp
          )
        );

        // Refresh stats after updating expense
        await fetchExpenseStats();

        return response.data.data.expense;
      } catch (error) {
        console.error("Update failed:", error);
        throw new Error(
          error.response?.data?.message || "Failed to update expense"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token, backendUrl, fetchExpenseStats]
  );

  const deleteExpenses = useCallback(
    async (expenseId) => {
      setIsLoading(true);
      try {
        await axios.delete(`${backendUrl}/expenses/${expenseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update the state
        setExpenses((prev) => prev.filter((exp) => exp._id !== expenseId));

        // Refresh stats after deleting expense
        await fetchExpenseStats();
      } catch (error) {
        console.error("Error deleting expense:", error);
        throw new Error(
          error.response?.data?.message || "Failed to delete expense"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token, backendUrl, fetchExpenseStats]
  );

  // Calculate local real-time stats from current expenses
  // In your ExpenseContext's localExpenseStats calculation:
  const localExpenseStats = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        totalExpenses: 0,
        expenseCount: 0,
        averageExpense: 0,
        highestCategory: { name: null, amount: 0 },
        periodComparison: { changePercent: 0 },
      };
    }

    // Calculate basic stats
    const stats = {
      totalExpenses: 0,
      expenseCount: expenses.length,
      categoryBreakdown: {},
      thisPeriodTotal: 0,
      lastPeriodTotal: 0,
    };

    // Calculate totals and category breakdown
    expenses.forEach((expense) => {
      const amount = expense.expenseAmount;
      const category = expense.category || "N/A";

      stats.totalExpenses += amount;

      if (!stats.categoryBreakdown[category]) {
        stats.categoryBreakdown[category] = 0;
      }
      stats.categoryBreakdown[category] += amount;
    });

    // Find highest category
    let highestCategory = { name: null, amount: 0 };
    Object.entries(stats.categoryBreakdown).forEach(([name, amount]) => {
      if (amount > highestCategory.amount) {
        highestCategory = { name, amount };
      }
    });

    return {
      totalExpenses: Math.round(stats.totalExpenses * 100) / 100,
      expenseCount: stats.expenseCount,
      averageExpense:
        Math.round((stats.totalExpenses / stats.expenseCount) * 100) / 100,
      highestCategory,
      periodComparison: {
        changePercent:
          stats.lastPeriodTotal > 0
            ? ((stats.thisPeriodTotal - stats.lastPeriodTotal) /
                stats.lastPeriodTotal) *
              100
            : 0,
      },
    };
  }, [expenses]);

  // Fetch initial data when token changes
  useEffect(() => {
    if (token) {
      Promise.all([fetchExpenses(), fetchExpenseStats()]);
    }
  }, [token, fetchExpenses, fetchExpenseStats]);

  const contextValue = useMemo(
    () => ({
      expenses,
      expenseStats: expenseStats || localExpenseStats,
      localExpenseStats,
      fetchExpenses,
      fetchExpenseStats,
      createExpense,
      deleteExpenses,
      updateExpenses,
      isLoading,
      isStatsLoading,
      error,
      
    }),
    [
      expenses,
      expenseStats,
      localExpenseStats,
      fetchExpenses,
      fetchExpenseStats,
      createExpense,
      deleteExpenses,
      updateExpenses,
      isLoading,
      isStatsLoading,
      error,
    ]
  );

  return (
    <ExpenseContext.Provider value={contextValue}>
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContextProvider;
