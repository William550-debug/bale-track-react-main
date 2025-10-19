import express from "express";
import {
  createExpenseEntry,
  deleteExpense,
  updateExpense,
  getExpense,
  getExpenseById,
  getExpensesStats,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/auth.js";

const expenseRouter = express.Router();

expenseRouter.post("/", protect, createExpenseEntry);
expenseRouter.get("/", protect, getExpense);
expenseRouter.get("/stats", protect, getExpensesStats)
expenseRouter.get("/:id", protect, getExpenseById);
expenseRouter.patch("/:id", protect, updateExpense);
expenseRouter.delete("/:id", protect, deleteExpense);

export default expenseRouter;
