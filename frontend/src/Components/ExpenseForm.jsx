import { useContext, useEffect, useState } from "react";
import {
  PlusIcon,
  CubeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ExpenseContext } from "../context/ExpenseContext.jsx";
import { useAuth } from "../context/useAuth.js";
import Spinner from "./Spinner.jsx";

const ExpenseForm = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [showForm, setShowForm] = useState(false);

  const {
    expenses,
    fetchExpenses,
    createExpense,
    deleteExpenses,
    updateExpenses,
    isLoading,
    isStatsLoading,
    expenseStats,
    error,
  } = useContext(ExpenseContext);

  const [timePeriod, setTimePeriod] = useState("monthly"); // Default to monthly

  const [expenseForm, setExpenseForm] = useState({
    expenseType: "",
    expenseAmount: "",
    expenseDescription: "",
    expenseDate: new Date().toISOString().split("T")[0],
  });

  const [editId, setEditId] = useState(null);

  // Mutations
  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      toast.success("Expense created successfully!");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      resetExpenseForm();
      setShowForm(false);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create expense";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateExpenses(id, data),
    onSuccess: () => {
      toast.success("Expense updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      resetExpenseForm();
      setShowForm(false);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update expense";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpenses,
    onSuccess: () => {
      toast.success("Expense deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete expense";
      toast.error(message);
    },
  });

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        await fetchExpenses();
      } catch (err) {
        toast.error(err.message || "Failed to load Expenses");
      }
    };

    loadExpenses();
  }, []);

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetExpenseForm = () => {
    setExpenseForm({
      expenseType: "",
      expenseAmount: "",
      expenseDescription: "",
      expenseDate: new Date().toISOString().split("T")[0],
    });
    setEditId(null);
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();

    if (!expenseForm.expenseType || !expenseForm.expenseAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isNaN(parseFloat(expenseForm.expenseAmount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    const payload = {
      expenseType: expenseForm.expenseType,
      expenseAmount: parseFloat(expenseForm.expenseAmount),
      expenseDescription: expenseForm.expenseDescription,
      expenseDate: expenseForm.expenseDate,
    };

    try {
      if (editId) {
        await updateMutation.mutateAsync({ id: editId, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } catch (err) {
      // Error handled in mutation
    }
  };

  const handleEdit = (expense) => {
    setExpenseForm({
      expenseType: expense.expenseType,
      expenseAmount: expense.expenseAmount.toString(),
      expenseDescription: expense.expenseDescription || "",
      expenseDate:
        expense.expenseDate ||
        new Date(expense.createdAt).toISOString().split("T")[0],
    });
    setEditId(expense._id);
    setShowForm(true);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this Expense?")) {
      try {
        await deleteMutation.mutateAsync(expenseId);
      } catch (err) {
        // Error handled in mutation
      }
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      resetExpenseForm();
    }
  };

  const renderExpenseForm = () => (
    <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <form className="space-y-3 md:space-y-4" onSubmit={handleExpenseSubmit}>
        <div>
          <label
            htmlFor="expenseType"
            className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Category
          </label>
          <select
            id="expenseType"
            name="expenseType"
            value={expenseForm.expenseType}
            onChange={handleExpenseChange}
            className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
            required
          >
            <option value="">Select category</option>
            <option value="transport">Transport</option>
            <option value="utilities">Utilities</option>
            <option value="salaries">Salaries</option>
            <option value="supplies">Supplies</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="expenseDescription"
            className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description
          </label>
          <input
            type="text"
            id="expenseDescription"
            name="expenseDescription"
            value={expenseForm.expenseDescription}
            onChange={handleExpenseChange}
            className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
            placeholder="What was this expense for?"
          />
        </div>

        <div>
          <label
            htmlFor="expenseAmount"
            className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Amount (Ksh)
          </label>
          <input
            type="number"
            id="expenseAmount"
            name="expenseAmount"
            value={expenseForm.expenseAmount}
            onChange={handleExpenseChange}
            className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
            placeholder="0.00"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label
            htmlFor="expenseDate"
            className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Date
          </label>
          <input
            type="date"
            id="expenseDate"
            name="expenseDate"
            value={expenseForm.expenseDate}
            onChange={handleExpenseChange}
            className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
            required
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="pt-1 md:pt-2 flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 md:px-6 md:py-2 bg-primary text-white text-xs md:text-sm font-medium rounded-lg hover:bg-opacity-90 transition duration-200"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {createMutation.isLoading || updateMutation.isLoading ? (
              <Spinner size="sm" />
            ) : editId ? (
              "Update Expense"
            ) : (
              "Record Expense"
            )}
          </button>
          <button
            type="button"
            onClick={toggleForm}
            className="px-4 py-2 text-xs md:text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div>
      {/**Add Expense Button */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 rounded-lg text-sm ${
                timePeriod === "monthly"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setTimePeriod("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-sm ${
                timePeriod === "quarterly"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setTimePeriod("quarterly")}
            >
              Quarterly
            </button>
          </div>

          <button
            onClick={toggleForm}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition duration-200 ${
              showForm
                ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                : "bg-primary text-white hover:bg-opacity-90"
            }`}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {showForm ? "Close Form" : "Add Expense"}
          </button>
        </div>

        {/* Conditionally render the form */}
        {showForm && renderExpenseForm()}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Expenses Card */}
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Total Expenses
            </h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-300">
              KSH {expenseStats?.totalExpenses?.toLocaleString() || "0"}
            </p>
            <p className="text-xs mt-1 text-red-700 dark:text-red-200">
              {expenseStats?.expenseCount || "0"} transactions
            </p>
          </div>

          {/* Average Expense Card */}
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Average Expense
            </h3>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
              KSH {expenseStats?.averageExpense?.toLocaleString() || "0"}
            </p>
            <p className="text-xs mt-1 text-yellow-700 dark:text-yellow-200">
              Per transaction
            </p>
          </div>

          {/* Highest Category Card */}
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Highest Category
            </h3>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-300 capitalize">
              {expenseStats?.highestCategory?.name || "N/A"}
            </p>
            <p className="text-xs mt-1 text-purple-700 dark:text-purple-200">
              KSH{" "}
              {expenseStats?.highestCategory?.amount?.toLocaleString() || "0"}
            </p>
          </div>

          {/* This Period vs Last Period */}
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {timePeriod === "monthly" ? "Monthly" : "Quarterly"} Change
            </h3>
            <p
              className={`text-2xl font-bold ${
                (expenseStats?.periodComparison?.changePercent || 0) >= 0
                  ? "text-green-600 dark:text-green-300"
                  : "text-red-600 dark:text-red-300"
              }`}
            >
              {(expenseStats?.periodComparison?.changePercent || 0) >= 0
                ? "↑"
                : "↓"}
              {Math.abs(
                expenseStats?.periodComparison?.changePercent || 0
              ).toFixed(1)}
              %
            </p>
            <p className="text-xs mt-1 text-blue-700 dark:text-blue-200">
              {timePeriod === "monthly" ? "vs last month" : "vs last quarter"}
            </p>
          </div>
        </div>

        {/**User Expense List */}
        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Spinner size="lg" />
              <p>Loading your Expenses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Error loading your Expenses: {error.message || error}</p>
              <button
                onClick={() => fetchExpenses()}
                className="mt-2 px-4 py-2 bg-primary text-white rounded"
              >
                Retry
              </button>
            </div>
          ) : expenses?.length > 0 ? (
            <div className="w-full">
              {/* Table view (visible from sm and above) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {expenses.map((expense) => (
                      <tr key={expense._id}>
                        <td className="px-4 py-2 text-sm">
                          {new Date(
                            expense.expenseDate || expense.createdAt
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm capitalize">
                          {expense.expenseType}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {expense.expenseDescription || "-"}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          KSH{" "}
                          {parseFloat(expense.expenseAmount).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="text-blue-500 hover:text-blue-700 mr-3"
                            disabled={
                              deleteMutation.isLoading ||
                              updateMutation.isLoading
                            }
                          >
                            <PencilIcon className="h-4 w-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="text-red-500 hover:text-red-700"
                            disabled={deleteMutation.isLoading}
                          >
                            <TrashIcon className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card view (visible on xs only) */}
              <div className="block sm:hidden space-y-4">
                {expenses.map((expense) => (
                  <div
                    key={expense._id}
                    className="p-4 rounded-lg shadow bg-white dark:bg-gray-900"
                  >
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Date:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(
                          expense.expenseDate || expense.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span>Category:</span>
                      <span className="capitalize">{expense.expenseType}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span>Description:</span>
                      <span>{expense.expenseDescription || "-"}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span>Amount:</span>
                      <span>
                        KSH {parseFloat(expense.expenseAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-end space-x-3 mt-3">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-500 hover:text-blue-700"
                        disabled={
                          deleteMutation.isLoading || updateMutation.isLoading
                        }
                      >
                        <PencilIcon className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={deleteMutation.isLoading}
                      >
                        <TrashIcon className="h-4 w-4 inline" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-24 h-24 mb-6 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                <CubeIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                No Expenses
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                You haven't recorded any expenses yet
              </p>
              <button
                onClick={toggleForm}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition duration-200"
              >
                Add Your First Expense
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
