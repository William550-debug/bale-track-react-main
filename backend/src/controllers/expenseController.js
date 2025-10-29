import Expense from "../models/ExpenseModel.js";
import mongoose from "mongoose";

// Helper function for error handling
const handleError = (res, error, message = "An error occurred") => {
  console.error(error);
  res.status(500).json({
    status: false,
    message: message,
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

// Create a new entry
// route POST /api/expense
// @access Private
const createExpenseEntry = async (req, res) => {
  try {
    // debug
    //console.log("ReqUser", req.user);

    const { expenseType, expenseDescription, expenseAmount } = req.body;
    const userId = req.user._id;

    // validate the required fields
    if (!expenseType || !expenseDescription || !expenseAmount) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (expenseAmount < 0) {
      // Fixed: Changed 'amount' to 'expenseAmount'
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

    const newExpense = await Expense.create({
      user: userId,
      expenseType,
      expenseAmount,
      expenseDescription: expenseDescription || "", // Fixed: Changed 'description' to 'expenseDescription'
    });

    res.status(201).json({
      success: true,
      data: {
        expense: newExpense,
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to create expense entry");
  }
};

// Query the Expenses
// Desc: Get all expenses for the logged in user
// route GET /api/expenses
// access private only logged in user
const getExpense = async (req, res) => {
  // Fixed: Changed function name to match export (or fix the export)
  try {
    const userId = req.user._id;
    //console.log("Fetching expenses for user:", userId);

    const expenses = await Expense.find({ user: userId });
    //console.log("Found expenses:", expenses);

    res.status(200).json({
      success: true,
      data: { expenses },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch expenses");
  }
};

// Get expense by id
// route GET /api/expense/:id
// @access Private
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid expense ID", // Fixed: Changed from "bale ID" to "expense ID"
      });
    }

    const expense = await Expense.findOne({
      _id: id,
      user: userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        expense,
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch expense");
  }
};

// @desc    Update an expense by ID
// @route   PATCH /api/expense/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { expenseType, expenseDescription, expenseAmount } = req.body;

    //console.log("Update req received", { id, userId, body: req.body });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid expense ID provided", id);
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }

    // Create update object with provided fields
    const updateFields = {};

    if (expenseType !== undefined) updateFields.expenseType = expenseType;

    // Amount check
    if (expenseAmount !== undefined) {
      if (expenseAmount < 0) {
        // Fixed: Changed 'amount' to 'expenseAmount'
        return res.status(400).json({
          success: false,
          message: "Amount cannot be negative",
        });
      }
      updateFields.expenseAmount = expenseAmount;
    }

    // Description
    if (expenseDescription !== undefined)
      updateFields.expenseDescription = expenseDescription;

    console.log("Updating with fields:", updateFields);

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, user: userId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      console.log("Expense not found or unauthorized", { id, userId });
      return res.status(404).json({
        success: false,
        message: "Expense not found or you are not authorized to update it",
      });
    }

    console.log("Successfully updated");
    res.status(200).json({
      success: true,
      data: {
        expense: updatedExpense, // Fixed: Added property name 'expense'
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to update expense");
  }
};

// @desc    Delete an expense by ID
// @route   DELETE /api/expense/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }

    const expense = await Expense.findOneAndDelete({ _id: id, user: userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found or you are not authorized to delete it",
      });
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    handleError(res, error, "Failed to delete expense");
  }
};

//Service function
export const getExpensesStats = async (req, res) => {
  try {
    const stats = await fetchExpenseStatsForUser(req.user._id, req.query);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    handleError(res, error, "Failed to fetch expense statistics");
  }
};

//fetch expense stats
// Pure service function
export const fetchExpenseStatsForUser = async (
  userId,
  { period = "all", year, month, quarter } = {}
) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentQuarter = Math.floor(now.getMonth() / 3) + 1;

  // Build period filter
  let periodFilter = {};
  switch (period) {
    case "month":
    case "thisMonth":
      periodFilter = {
        "period.year": currentYear,
        "period.month": currentMonth,
      };
      break;
    case "lastMonth":
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      periodFilter = {
        "period.year": lastMonthYear,
        "period.month": lastMonth,
      };
      break;
    case "quarter":
    case "thisQuarter":
      periodFilter = {
        "period.year": currentYear,
        "period.quarter": currentQuarter,
      };
      break;
    case "lastQuarter":
      const lastQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
      const lastQuarterYear =
        currentQuarter === 1 ? currentYear - 1 : currentYear;
      periodFilter = {
        "period.year": lastQuarterYear,
        "period.quarter": lastQuarter,
      };
      break;
    case "year":
    case "thisYear":
      periodFilter = { "period.year": currentYear };
      break;
    case "customMonth":
      if (year && month) {
        periodFilter = {
          "period.year": parseInt(year),
          "period.month": parseInt(month),
        };
      }
      break;
    case "customQuarter":
      if (year && quarter) {
        periodFilter = {
          "period.year": parseInt(year),
          "period.quarter": parseInt(quarter),
        };
      }
      break;
    default:
      // all → no filter
      break;
  }

  // Query DB
  const query = { user: userId, ...periodFilter };
  const expenses = await Expense.find(query).sort({ expenseDate: -1 });

  // Build stats
  const stats = {
    totalExpenses: 0,
    expenseCount: 0,
    averageExpense: 0,
    categoryBreakdown: {},
    highestCategory: { name: "", amount: 0 },
  };

  if (expenses.length > 0) {
    stats.expenseCount = expenses.length;
    stats.totalExpenses = expenses.reduce((sum, e) => sum + e.expenseAmount, 0);
    stats.averageExpense = stats.totalExpenses / stats.expenseCount;

    expenses.forEach((e) => {
      const category = e.expenseType;
      if (!stats.categoryBreakdown[category]) {
        stats.categoryBreakdown[category] = { total: 0, count: 0 };
      }
      stats.categoryBreakdown[category].total += e.expenseAmount;
      stats.categoryBreakdown[category].count++;
      if (e.expenseAmount > stats.highestCategory.amount) {
        stats.highestCategory = { name: category, amount: e.expenseAmount };
      }
    });
  }

  return {
    totalExpenses: parseFloat(stats.totalExpenses.toFixed(2)),
    expenseCount: stats.expenseCount,
    averageExpense: parseFloat(stats.averageExpense.toFixed(2)),
    highestCategory: {
      name: stats.highestCategory.name,
      amount: parseFloat(stats.highestCategory.amount.toFixed(2)),
    },
    categoryBreakdown: Object.fromEntries(
      Object.entries(stats.categoryBreakdown).map(([key, val]) => [
        key,
        {
          total: parseFloat(val.total.toFixed(2)),
          count: val.count,
          percentage: parseFloat(
            ((val.total / stats.totalExpenses) * 100).toFixed(1)
          ),
        },
      ])
    ),

    period,
    periodFilter: {
      year: periodFilter["period.year"] || currentYear,
      ...(periodFilter["period.month"] && {
        month: periodFilter["period.month"],
      }),
      ...(periodFilter["period.quarter"] && {
        quarter: periodFilter["period.quarter"],
      }),
    },

    expensesList: expenses.map((exp) => ({
      id: exp._id,
      expenseDate: exp.expenseDate,
      expenseType: exp.expenseType,
      expenseDescription: exp.expenseDescription,
      expenseAmount: exp.expenseAmount,
    })),
  };
};

export {
  createExpenseEntry,
  deleteExpense,
  updateExpense,
  getExpense,
  getExpenseById,
};
