import { useContext, useEffect, useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  CubeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { useAuth } from "../context/useAuth";
import { BaleContext } from "../context/BaleContext";
import BaleFormDropdown from "./BaleDropDown";
import { useRef } from "react";
import ExpenseForm from "./ExpenseForm";
import Spinner from "./Spinner";
import SavingsForm from "./SavingsForm";

{
  /**update the bale entry to reduce  on submission */
}

const DataEntry = () => {
  const [activeTab, setActiveTab] = useState("bales");

  const [filters, setFilters] = useState({
    baleType: "",
    transactionType: "",
    dateRange: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const buttonRef = useRef();

  console.log("Filters", filters);

  const queryClient = useQueryClient();
  const { user } = useAuth();
  console.log("Current User", user);

  const {
    bales,
    isLoading,
    error,
    fetchBales,
    createBale,
    updateBale,
    deleteBale,
  } = useContext(BaleContext);

  const [baleForm, setBaleForm] = useState({
    baleType: "",
    transactionType: "",
    quantity: "",
    pricePerUnit: "",
    baleDescription: "",
  });

  const [editId, setEditId] = useState(null);

  // Single query for user's bales with filters

  // Mutations
  const createMutation = useMutation({
    mutationFn: createBale,
    onSuccess: () => {
      toast.success("Bale created successfully!");
      queryClient.invalidateQueries({ queryKey: ["bales"] });
      resetBaleForm();
    },
    onError: (error) => toast.error(error.message || "Failed to create bale."),
  });

  const updateMutation = useMutation({
    mutationFn: updateBale,
    onSuccess: () => {
      toast.success("Bale updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["bales"] });
      resetBaleForm();
    },
    onError: (error) => toast.error(error.message || "Failed to update bale."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBale,
    onSuccess: () => {
      toast.success("Bale deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["bales"] });
    },
    onError: (error) => toast.error(error.message || "Failed to delete bale."),
  });

  useEffect(() => {
    const loadBales = async () => {
      try {
        await fetchBales();
      } catch (err) {
        toast.error(err.message || "Failed to load bales");
      }
    };

    loadBales();
  }, []);

  const handleBaleChange = (e) => {
    const { name, value } = e.target;
    setBaleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetBaleForm = () => {
    setBaleForm({
      baleType: "",
      transactionType: "",
      quantity: "",
      pricePerUnit: "",
      baleDescription: "",
    });
    setEditId(null);
  };

  const handleBaleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      baleType: baleForm.baleType,
      transactionType: baleForm.transactionType,
      quantity: parseFloat(baleForm.quantity),
      pricePerUnit: parseFloat(baleForm.pricePerUnit),
      description: baleForm.baleDescription,
    };

    try {
      if (editId) {
        await updateBale(editId, payload);
        toast.success("Bale updated successfully!");
      } else {
        await createBale(payload);
        toast.success("Bale created successfully!");
        setIsFormOpen(false);
      }
      resetBaleForm();
      await fetchBales(); // Refresh the list
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleEdit = (bale) => {
    //console.log("Editing bale:", bale); // Check this in console
    // ... rest of the function
    setBaleForm({
      baleType: bale.baleType,
      transactionType: bale.transactionType,
      quantity: bale.quantity.toString(),
      pricePerUnit: bale.pricePerUnit.toString(),
      baleDescription: bale.description || "",
    });
    setEditId(bale._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (baleId) => {
    if (confirm("Are you sure you want to delete this bale?")) {
      try {
        await deleteBale(baleId);
        toast.success("Bale deleted successfully!");
        await fetchBales(); // Refresh the list
      } catch (err) {
        toast.error(err.message || "Failed to delete bale");
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (!isFormOpen) {
      resetBaleForm();
    }
  };

  // Load bales on component Mound
  // Replace your current useEffect with this:
  // Remove fetchBales from dependencies

  return (
    <div className="container mx-auto px-0 md:px-4 py-4 md:py-8 max-w-4xl">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-xl md:text-3xl font-semibold text-dark dark:text-white mb-2">
          Daily Data Entry
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Record your daily bale transactions, expenses, and savings
        </p>
      </div>

      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-4 md:mb-6">
        <button
          className={`tab-btn whitespace-nowrap ${
            activeTab === "bales" ? "active" : ""
          }`}
          onClick={() => setActiveTab("bales")}
        >
          <CubeIcon className="h-5 w-5 mr-2" />
          Bales
        </button>
        <button
          className={`tab-btn whitespace-nowrap ${
            activeTab === "expenses" ? "active" : ""
          }`}
          onClick={() => setActiveTab("expenses")}
        >
          <ArrowDownIcon className="h-5 w-5 mr-2" />
          Expenses
        </button>
        <button
          className={`tab-btn whitespace-nowrap ${
            activeTab === "savings" ? "active" : ""
          }`}
          onClick={() => setActiveTab("savings")}
        >
          <ArrowUpIcon className="h-5 w-5 mr-2" />
          Savings
        </button>
      </div>

      {/** Bales Tab   Simplified*/}
      <div
        id="bales"
        className={`${activeTab === "bales" ? "block" : "hidden"}`}
      >
        <div className="flex justify-between items-center mb-6 relative">
          <h2 className="text-xl font-bold dark:text-white">Your Bales</h2>
          <button
            ref={buttonRef}
            onClick={toggleForm}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
          >
            <PlusIcon className="h-5 w-5" />
            Add Bale
          </button>

          {/* Dropdown Form */}
          <BaleFormDropdown
            isOpen={isFormOpen}
            onClose={() => {
              resetBaleForm();
              setIsFormOpen(false);
            }}
            onSubmit={handleBaleSubmit}
            formState={baleForm}
            onFormChange={handleBaleChange}
            isSubmitting={createMutation.isLoading || updateMutation.isLoading}
            editId={editId} // This is crucial for edit mode
          />
        </div>

        {/* User-specific bales section */}
        <div className="mt-8">
          {isLoading ? (
            <div className="text-center py-8">
              <Spinner size="lg" />
              <p>Loading your bales...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Error loading your bales: {isError.message}</p>
              <button
                onClick={() => queryClient.refetchQueries(["userBales"])}
                className="mt-2 px-4 py-2 bg-primary text-white rounded"
              >
                Retry
              </button>
            </div>
          ) : bales.length > 0 ? (
            <div className="w-full">
              {/* Table view (visible from sm and above) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price/Unit
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {bales.map((bale) => (
                      <tr key={bale._id}>
                        <td className="px-4 py-2 text-sm capitalize">
                          {bale.baleType}
                        </td>
                        <td className="px-4 py-2 text-sm capitalize">
                          {bale.transactionType}
                        </td>
                        <td className="px-4 py-2 text-sm">{bale.quantity}</td>
                        <td className="px-4 py-2 text-sm">
                          Ksh {bale.pricePerUnit?.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <button
                            onClick={() => handleEdit(bale)}
                            className="text-blue-500 hover:text-blue-700 mr-3"
                            disabled={deleteMutation.isLoading}
                          >
                            <PencilIcon className="h-4 w-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(bale._id)}
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
                {bales.map((bale) => (
                  <div
                    key={bale._id}
                    className="p-4 rounded-lg shadow bg-white dark:bg-gray-900"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Type:
                      </span>
                      <span className="text-gray-900 dark:text-white capitalize">
                        {bale.baleType}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500 dark:text-gray-400">
                        Transaction:
                      </span>
                      <span className="capitalize">{bale.transactionType}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500 dark:text-gray-400">
                        Quantity:
                      </span>
                      <span>{bale.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500 dark:text-gray-400">
                        Price/Unit:
                      </span>
                      <span>Ksh {bale.pricePerUnit?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-end space-x-3 mt-3">
                      <button
                        onClick={() => handleEdit(bale)}
                        className="text-blue-500 hover:text-blue-700"
                        disabled={deleteMutation.isLoading}
                      >
                        <PencilIcon className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(bale._id)}
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
                No Bales Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                You haven't created any bales yet. Get started by clicking the
                button below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/** Expenses Tab */}
      <div
        id="expenses"
        className={`tab-content ${
          activeTab === "expenses" ? "active" : "hidden"
        }`}
      >
        <ExpenseForm />
      </div>

      {/** Savings Tab */}
      <div
        id="savings"
        className={`tab-content ${
          activeTab === "savings" ? "active" : "hidden"
        }`}
      >
        <SavingsForm />
      </div>
    </div>
  );
};

export default DataEntry;
