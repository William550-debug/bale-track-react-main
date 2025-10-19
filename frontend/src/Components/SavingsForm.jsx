import React from "react";
import { useContext, useEffect, useState } from "react";
import {
  PlusIcon,
  CubeIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/outline";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { useAuth } from "../context/useAuth.js";
import Spinner from "./Spinner.jsx";
import { SavingsContext } from "../context/SavingsContext.jsx";

const SavingsForm = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  const {
    savings,
    fetchSavings,
    createSaving,
    deleteSaving,
    updateSaving,
    fetchSavingsStats,
    isLoading,
    error,
    savingsStats,
  } = useContext(SavingsContext);

  const [savingsForm, setSavingsForm] = useState({
    savingsType: "",
    savingsAmount: "",
    savingsDate: new Date().toISOString().split("T")[0],
    targetName: "",
    targetAmount: "",
  });

  const [editId, setEditId] = useState(null);

  // Mutations
  const createMutation = useMutation({
    mutationFn: createSaving,
    onSuccess: () => {
      toast.success("Saving created successfully!");
      queryClient.invalidateQueries({ queryKey: ["savings"] });
      resetSavingsForm();
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create saving";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSaving(id, data),
    onSuccess: () => {
      toast.success("Savings updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["savings"] });
      resetSavingsForm();
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update saving";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSaving,
    onSuccess: () => {
      toast.success("Saving deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["savings"] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete savings";
      toast.error(message);
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchSavings(), fetchSavingsStats()]);
      } catch (err) {
        toast.error(err.message || "Failed to load data");
      }
    };

    loadData();
  }, [fetchSavings, fetchSavingsStats]);

  const handleSavingsChange = (e) => {
    const { name, value } = e.target;
    setSavingsForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetSavingsForm = () => {
    setSavingsForm({
      savingsType: "",
      savingsAmount: "",
      savingsDate: new Date().toISOString().split("T")[0],
      targetName: "",
      targetAmount: "",
    });
    setEditId(null);
  };

  const handleSavingsSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!savingsForm.savingsAmount || !savingsForm.savingsType) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(savingsForm.savingsAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Prepare payload for all savings types
    const payload = {
      savingsType: savingsForm.savingsType,
      savingsAmount: amount,
      savingsDate: savingsForm.savingsDate,
      targetName: savingsForm.targetName || undefined,
      targetAmount: savingsForm.targetAmount
        ? parseFloat(savingsForm.targetAmount)
        : undefined,
    };

    // Additional validation for target savings
    if (savingsForm.savingsType === "target") {
      if (!payload.targetName) {
        toast.error("Please enter a target name");
        return;
      }
      if (!payload.targetAmount || isNaN(payload.targetAmount)) {
        toast.error("Please enter a valid target amount");
        return;
      }
      if (payload.targetAmount <= payload.savingsAmount) {
        toast.error("Target amount must be greater than savings amount");
        return;
      }
    }

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
  const handleEdit = (saving) => {
    setSavingsForm({
      savingsType: saving.savingsType,
      savingsAmount: saving.savingsAmount.toString(),
      savingsDate: new Date(saving.savingsDate || saving.createdAt)
        .toISOString()
        .split("T")[0],
      targetName: saving.targetName || "",
      targetAmount: saving.targetAmount ? saving.targetAmount.toString() : "",
    });
    setEditId(saving._id);
    setShowForm(true);
  };

  const handleDelete = async (savingId) => {
    if (confirm("Are you sure you want to delete this Saving?")) {
      try {
        await deleteMutation.mutateAsync(savingId);
      } catch (err) {
        // Error handled in mutation
      }
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm && editId) {
      resetSavingsForm();
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    fetchSavings({ sortBy: key, sortOrder: direction });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUpIcon className="h-3 w-3 ml-1 inline" />
    ) : (
      <ArrowDownIcon className="h-3 w-3 ml-1 inline" />
    );
  };

  const renderSavingsForm = () => (
    <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <form onSubmit={handleSavingsSubmit} className="space-y-3 md:space-y-4">
        <div>
          <label
            htmlFor="savings-type"
            className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Savings Type
          </label>
          <select
            id="savings-type"
            name="savingsType"
            className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
            required
            value={savingsForm.savingsType}
            onChange={handleSavingsChange}
          >
            <option value="">Select type</option>
            <option value="personal">Personal Savings</option>
            <option value="business">Business Savings</option>
            <option value="target">Target Savings</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="target-name"
            className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {savingsForm.savingsType === "personal"
              ? "Purpose"
              : savingsForm.savingsType === "business"
              ? "Business Purpose"
              : "Target Name"}
          </label>
          <input
            type="text"
            id="target-name"
            name="targetName"
            className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
            placeholder={
              savingsForm.savingsType === "personal"
                ? "e.g. Vacation fund"
                : savingsForm.savingsType === "business"
                ? "e.g. New equipment"
                : "e.g. New Truck"
            }
            value={savingsForm.targetName}
            onChange={handleSavingsChange}
            required={savingsForm.savingsType === "target"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label
              htmlFor="savings-amount"
              className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Amount Saved (Ksh)
            </label>
            <input
              type="number"
              id="savings-amount"
              name="savingsAmount"
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
              placeholder="0.00"
              value={savingsForm.savingsAmount}
              onChange={handleSavingsChange}
              required
              min="1"
              step="any"
            />
          </div>
          <div>
            <label
              htmlFor="target-amount"
              className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {savingsForm.savingsType === "target"
                ? "Target Amount (Ksh)"
                : "Goal Amount (Ksh)"}
            </label>
            <input
              type="number"
              id="target-amount"
              name="targetAmount"
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
              placeholder="0.00"
              value={savingsForm.targetAmount}
              onChange={handleSavingsChange}
              min="1"
              step="any"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="savings-date"
            className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Date
          </label>
          <input
            type="date"
            id="savings-date"
            name="savingsDate"
            className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
            value={savingsForm.savingsDate}
            onChange={handleSavingsChange}
            required
          />
        </div>

        <div className="pt-1 md:pt-2">
          <button
            type="submit"
            className="w-full px-4 py-2 md:px-6 md:py-2 bg-primary text-white text-xs md:text-sm font-medium rounded-lg hover:bg-opacity-90 transition duration-200"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {editId
              ? updateMutation.isLoading
                ? "Updating..."
                : "Update Savings"
              : createMutation.isLoading
              ? "Saving..."
              : "Record Savings"}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div>
      {/** Savings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Personal Savings
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
            KSH {savingsStats?.personal?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
            Business Savings
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">
            KSH {savingsStats?.business?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
            Target Savings
          </h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
            KSH {savingsStats?.totals?.target?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
            Total Savings
          </h3>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-300">
            KSH {savingsStats?.totals?.overall?.toLocaleString() || "0"}
          </p>
        </div>
      </div>

      {/**Add Savings Button */}
      <div className="mb-4">
        <button
          onClick={toggleForm}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition duration-200 ${
            showForm
              ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              : "bg-primary text-white hover:bg-opacity-90"
          }`}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          {showForm ? "Close Form" : "Add Savings"}
        </button>
      </div>

      {/* Conditionally render the form */}
      {showForm && renderSavingsForm()}

      {/**User Savings List */}
      <div className="mt-4">
        {isLoading ? (
          <div className="text-center py-8">
            <Spinner size="lg" />
            <p>Loading your Savings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Error loading your savings: {error.message}</p>
            <button
              onClick={() => {
                fetchSavings();
                fetchSavingsStats();
              }}
              className="mt-2 px-4 py-2 bg-primary text-white rounded"
            >
              Retry
            </button>
          </div>
        ) : savings.length > 0 ? (
          <div className="w-full">
            <div className="overflow-x-auto hidden sm:block">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("createdAt")}
                    >
                      DATE {renderSortIcon("createdAt")}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("savingsType")}
                    >
                      TYPE {renderSortIcon("savingsType")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      PURPOSE/TARGET
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      GOAL AMOUNT
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("savingsAmount")}
                    >
                      SAVED AMOUNT {renderSortIcon("savingsAmount")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      PROGRESS
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {savings.map((saving) => (
                    <tr key={saving._id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(
                          saving.savingsDate || saving.createdAt
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                        {saving.savingsType}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {saving.targetName || "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {saving.targetAmount
                          ? `KSH ${saving.targetAmount.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        KSH {saving.savingsAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {saving.savingsType && saving.targetAmount ? (
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                              <div
                                className={`h-2.5 rounded-full ${
                                  saving.savingsAmount >= saving.targetAmount
                                    ? "bg-green-500"
                                    : "bg-blue-600"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    Math.round(
                                      (saving.savingsAmount /
                                        saving.targetAmount) *
                                        100
                                    ),
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <span>
                              {Math.min(
                                Math.round(
                                  (saving.savingsAmount / saving.targetAmount) *
                                    100
                                ),
                                100
                              )}
                              %
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(saving)}
                            className="text-blue-500 hover:text-blue-700"
                            disabled={
                              deleteMutation.isLoading ||
                              updateMutation.isLoading
                            }
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(saving._id)}
                            className="text-red-500 hover:text-red-700"
                            disabled={deleteMutation.isLoading}
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="block sm:hidden space-y-4">
              {savings.map((saving) => (
                <div
                  key={saving._id}
                  className="p-4 rounded-lg shadow bg-white dark:bg-gray-900"
                >
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Date:</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(
                        saving.savingsDate || saving.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Type:</span>
                    <span className="capitalize">{saving.savingsType}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Purpose:</span>
                    <span>{saving.targetName || "-"}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Goal:</span>
                    <span>
                      {saving.targetAmount
                        ? `KSH ${saving.targetAmount.toLocaleString()}`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Saved:</span>
                    <span>KSH {saving.savingsAmount.toLocaleString()}</span>
                  </div>
                  <div className="mt-3">
                    {/* Progress bar reused */}
                    {saving.savingsType && saving.targetAmount ? (
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div
                            className={`h-2.5 rounded-full ${
                              saving.savingsAmount >= saving.targetAmount
                                ? "bg-green-500"
                                : "bg-blue-600"
                            }`}
                            style={{
                              width: `${Math.min(
                                Math.round(
                                  (saving.savingsAmount / saving.targetAmount) *
                                    100
                                ),
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs">
                          {Math.min(
                            Math.round(
                              (saving.savingsAmount / saving.targetAmount) * 100
                            ),
                            100
                          )}
                          %
                        </span>
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => handleEdit(saving)}
                      className="text-blue-500 hover:text-blue-700"
                      disabled={
                        deleteMutation.isLoading || updateMutation.isLoading
                      }
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(saving._id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={deleteMutation.isLoading}
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
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
              No Savings
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
              You haven't recorded any savings yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsForm;
