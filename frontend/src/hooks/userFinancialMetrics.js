// hooks/useFinancialMetrics.js - Optimized and fixed version
import { useMemo } from "react";
import { useDashboardData } from "./userDashboardData.js"

export const useFinancialMetrics = () => {
  const {
    baleContext,
    expenseContext,
    savingsContext,
    isLoading: dashboardLoading,
    error,
    dataLoaded,
  } = useDashboardData();

  // Memoize the core data to prevent unnecessary recalculations
  const coreData = useMemo(() => {
    // Now these will be properly defined
    const purchases = baleContext.purchases || [];
    const sales = baleContext.sales || [];
    const expenses = expenseContext.expenses || [];
    const savings = savingsContext.savings || [];
    
    return { purchases, sales, expenses, savings };
  }, [
    baleContext.purchases, 
    baleContext.sales, 
    expenseContext.expenses, 
    savingsContext.savings
  ]);

  const financialMetrics = useMemo(() => {
    if (dashboardLoading || !dataLoaded) {
      return getLoadingMetrics();
    }

    const { purchases, sales, expenses, savings } = coreData;

    // Use stats with fallbacks to local calculations
    const currentBalesStats = baleContext.balesStats || baleContext.localBalesStats || {};
    const currentExpenseStats = expenseContext.expenseStats || expenseContext.localExpenseStats || {};
    const currentSavingsStats = savingsContext.savingsStats || savingsContext.localSavingsStats || {};

    // Core calculations - these will now work with proper data
    const totalBalesPurchases = purchases.reduce((sum, purchase) => {
      return sum + ((purchase.quantity || 0) * (purchase.pricePerUnit || 0));
    }, 0);

    const totalBalesSales = sales.reduce((sum, sale) => {
      return sum + ((sale.quantity || 0) * (sale.pricePerUnit || 0));
    }, 0);

    const pureExpenses = expenses.reduce((sum, expense) => {
      return sum + parseFloat(expense.expenseAmount || 0);
    }, 0);

    const totalSavings = currentSavingsStats?.totals?.overall || 
      savings.reduce((sum, saving) => sum + parseFloat(saving.savingsAmount || 0), 0);

    // Warehouse stock calculations - FIXED with proper quantity data
    const totalPurchased = purchases.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalSold = sales.reduce((sum, s) => sum + (s.quantity || 0), 0);
    const warehouseStock = Math.max(0, totalPurchased - totalSold);

    // Financial calculations
    const totalCosts = totalBalesPurchases + pureExpenses;
    const actualProfit = totalBalesSales - totalCosts;
    const profitMargin = totalBalesSales > 0 ? (actualProfit / totalBalesSales) * 100 : 0;

    // Get pre-calculated data
    const expenseCategories = calculateExpenseCategories(expenses);
    const recentTransactions = getRecentTransactions(purchases, sales, expenses, savings);
    const balesChartData = getBalesChartData(purchases, sales);

    // Trends
    const trends = calculateTrends({
      actualProfit,
      warehouseStock,
      pureExpenses,
      totalSavings,
      monthlySavings: (currentSavingsStats.personal || 0) + (currentSavingsStats.business || 0)
    });

    return {
      // Core metrics
      totalBalesSales,
      totalBalesPurchases,
      balesRevenue: totalBalesSales,
      pureExpenses,
      totalSavings,
      warehouseStock,
      totalCosts,
      actualProfit,
      profitMargin,
      expenseRatio: totalBalesSales > 0 ? (totalCosts / totalBalesSales) * 100 : 0,

      // Savings
      personalSavings: currentSavingsStats.personal || 0,
      businessSavings: currentSavingsStats.business || 0,
      monthlySavings: (currentSavingsStats.personal || 0) + (currentSavingsStats.business || 0),
      savingsRate: totalSavings > 0 ? Math.round((totalSavings / (totalSavings + 100000)) * 100) : 0,
      targetProgress: currentSavingsStats.targetProgress || [],

      // Charts and lists
      expenseCategories,
      recentTransactions,
      balesChartData,

      // Trends
      ...trends,

      // Raw data and counts
      currentBalesStats: { 
        ...currentBalesStats,
        purchasesCount: purchases.length,
        salesCount: sales.length,
      },
      currentExpenseStats,
      currentSavingsStats,
      purchasesCount: purchases.length,
      salesCount: sales.length,
      expensesCount: expenses.length,
      savingsCount: savings.length,
    };
  }, [dashboardLoading, dataLoaded, coreData, baleContext, expenseContext, savingsContext]);

  return {
    financialMetrics,
    isLoading: dashboardLoading || !dataLoaded,
    error,
    hasData: dataLoaded && !dashboardLoading,
  };
};

// Helper functions remain the same but will now work with proper data
const calculateExpenseCategories = (expenses) => {
  if (!expenses.length) {
    return { categories: [], total: 0 };
  }

  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.expenseType || "other";
    const amount = parseFloat(expense.expenseAmount) || 0;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  return {
    categories: Object.keys(categoryTotals).map(cat => ({
      name: cat,
      amount: categoryTotals[cat],
      percentage: total > 0 ? (categoryTotals[cat] / total) * 100 : 0,
    })),
    total,
  };
};

const getRecentTransactions = (purchases, sales, expenses, savings) => {
  const transactions = [];

  // Add purchases
  purchases.slice(0, 5).forEach(item => {
    transactions.push({
      id: `purchase_${item._id}`,
      date: item.createdAt,
      description: `${(item.baleType || 'Cotton').charAt(0).toUpperCase() + (item.baleType || 'Cotton').slice(1)} bale purchase`,
      type: "Purchase",
      amount: (item.quantity || 0) * (item.pricePerUnit || 0),
      status: "Completed",
      timestamp: new Date(item.createdAt).getTime(),
    });
  });

  // Add sales
  sales.slice(0, 5).forEach(item => {
    transactions.push({
      id: `sale_${item._id}`,
      date: item.createdAt,
      description: `${(item.baleType || 'Cotton').charAt(0).toUpperCase() + (item.baleType || 'Cotton').slice(1)} bale sale`,
      type: "Sale",
      amount: (item.quantity || 0) * (item.pricePerUnit || 0),
      status: "Completed",
      timestamp: new Date(item.createdAt).getTime(),
    });
  });

  // Add expenses
  expenses.slice(0, 3).forEach(item => {
    transactions.push({
      id: `expense_${item._id}`,
      date: item.expenseDate || item.createdAt,
      description: `${(item.expenseType || 'Other').charAt(0).toUpperCase() + (item.expenseType || 'Other').slice(1)} expense`,
      type: "Expense",
      amount: parseFloat(item.expenseAmount || 0),
      status: "Completed",
      timestamp: new Date(item.expenseDate || item.createdAt).getTime(),
    });
  });

  // Add savings
  savings.slice(0, 2).forEach(item => {
    transactions.push({
      id: `savings_${item._id}`,
      date: item.savingsDate || item.createdAt,
      description: `${(item.savingsType || 'Business').charAt(0).toUpperCase() + (item.savingsType || 'Business').slice(1)} savings`,
      type: "Savings",
      amount: parseFloat(item.savingsAmount || 0),
      status: "Completed",
      timestamp: new Date(item.savingsDate || item.createdAt).getTime(),
    });
  });

  return transactions.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
};

const getBalesChartData = (purchases, sales) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const dailyPurchases = last7Days.map(() => 0);
  const dailySales = last7Days.map(() => 0);

  // Process purchases
  purchases.forEach(purchase => {
    const date = new Date(purchase.createdAt).toISOString().split("T")[0];
    const index = last7Days.indexOf(date);
    if (index !== -1) {
      dailyPurchases[index] += (purchase.quantity || 0) * (purchase.pricePerUnit || 0);
    }
  });

  // Process sales
  sales.forEach(sale => {
    const date = new Date(sale.createdAt).toISOString().split("T")[0];
    const index = last7Days.indexOf(date);
    if (index !== -1) {
      dailySales[index] += (sale.quantity || 0) * (sale.pricePerUnit || 0);
    }
  });

  // Create labels
  const labels = last7Days.map((date, index) => {
    const day = new Date(date);
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (date === today) return "Today";
    if (date === yesterdayStr) return "Yesterday";
    return dayNames[day.getDay()];
  });

  return {
    labels,
    purchasesData: dailyPurchases,
    salesData: dailySales,
    totalPurchases: dailyPurchases.reduce((a, b) => a + b, 0),
    totalSales: dailySales.reduce((a, b) => a + b, 0),
  };
};

const calculateTrends = ({ actualProfit, warehouseStock, pureExpenses, totalSavings, monthlySavings }) => {
  return {
    profitTrend: actualProfit > 0 ? "↑ Positive trend" : "↓ Needs improvement",
    stockTrend: warehouseStock > 50 ? "↑ Good stock" : warehouseStock > 20 ? "→ Adequate stock" : "↓ Low stock",
    expensesTrend: pureExpenses > 10000 ? "↑ High expenses" : pureExpenses > 5000 ? "→ Moderate" : "↓ Controlled",
    savingsTrend: totalSavings > 50000 ? "↑ Growing well" : totalSavings > 20000 ? "→ Steady" : "↓ Needs attention",
    monthlySavingsTrend: monthlySavings > 10000 ? "↑ Strong month" : monthlySavings > 5000 ? "→ Average" : "↓ Low savings",
    
    profitTrendColor: actualProfit >= 0 ? "success" : "danger",
    stockTrendColor: warehouseStock > 50 ? "success" : warehouseStock > 20 ? "warning" : "danger",
    expensesTrendColor: pureExpenses > 10000 ? "danger" : pureExpenses > 5000 ? "warning" : "success",
    savingsTrendColor: totalSavings > 50000 ? "success" : totalSavings > 20000 ? "warning" : "danger",
  };
};

const getLoadingMetrics = () => ({
  totalBalesSales: 0,
  totalBalesPurchases: 0,
  balesRevenue: 0,
  pureExpenses: 0,
  totalSavings: 0,
  warehouseStock: 0,
  totalCosts: 0,
  actualProfit: 0,
  profitMargin: 0,
  expenseRatio: 0,
  personalSavings: 0,
  businessSavings: 0,
  monthlySavings: 0,
  savingsRate: 0,
  targetProgress: [],
  expenseCategories: { categories: [], total: 0 },
  recentTransactions: [],
  balesChartData: getBalesChartData([], []),
  profitTrend: "Loading...",
  stockTrend: "Loading...",
  expensesTrend: "Loading...",
  savingsTrend: "Loading...",
  monthlySavingsTrend: "Loading...",
  profitTrendColor: "default",
  stockTrendColor: "default",
  expensesTrendColor: "default",
  savingsTrendColor: "default",
  currentBalesStats: {},
  currentExpenseStats: {},
  currentSavingsStats: {},
  purchasesCount: 0,
  salesCount: 0,
  expensesCount: 0,
  savingsCount: 0,
});