import { useEffect, useRef } from "react";
import { XIcon,PencilIcon, PlusIcon } from "@heroicons/react/outline";

const BaleFormDropdown = ({
  isOpen,
  onClose,
  onSubmit,
  formState,
  onFormChange,
  isSubmitting,
  editId,
}) => {
  const formRef = useRef();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={formRef}
      className="absolute top-full right-0 mt-2 w-full md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 transition-all duration-200 ease-out"
    >
      <div className="relative p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {editId ? "Edit Bale" : "Add New Bale"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close form"
          >
            <XIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Integrated Form */}
        <form onSubmit={onSubmit} className="space-y-4 md:space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* Bale Type */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Bale Type
              </label>
              <select
                name="baleType"
                value={formState.baleType}
                onChange={onFormChange}
                className="w-full px-3 py-2.5 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:text-gray-100 transition-colors"
                required
              >
                <option value="" className="text-gray-400 dark:text-gray-400">
                  Select type
                </option>
                <option value="cotton" className="dark:text-gray-100">
                  Cotton
                </option>
                <option value="jute" className="dark:text-gray-100">
                  Jute
                </option>
                <option value="wool" className="dark:text-gray-100">
                  Wool
                </option>
              </select>
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Transaction Type
              </label>
              <select
                name="transactionType"
                value={formState.transactionType}
                onChange={onFormChange}
                className="w-full px-3 py-2.5 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:text-gray-100 transition-colors"
                required
              >
                <option value="" className="text-gray-400 dark:text-gray-400">
                  Select type
                </option>
                <option value="purchase" className="dark:text-gray-100">
                  Purchase
                </option>
                <option value="sale" className="dark:text-gray-100">
                  Sale
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* Quantity */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formState.quantity}
                onChange={onFormChange}
                className="w-full px-3 py-2.5 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:text-gray-100 transition-colors"
                step="0.01"
                min="1"
                required
              />
            </div>

            {/* Price per Unit */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Price per Unit (Ksh)
              </label>
              <input
                type="number"
                name="pricePerUnit"
                value={formState.pricePerUnit}
                onChange={onFormChange}
                className="w-full px-3 py-2.5 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:text-gray-100 transition-colors"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Notes
            </label>
            <textarea
              name="baleDescription"
              value={formState.baleDescription}
              onChange={onFormChange}
              className="w-full px-3 py-2.5 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:text-gray-100 transition-colors min-h-[100px]"
              placeholder="Additional information"
            />
          </div>

          {/* Buttons */}

          <div className="pt-4 space-y-3">
            {/* Submit Button */}
            <button
              type="submit"
              className={`
                flex
                 gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"

                 `}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : editId ? (
                <>
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Update Bale
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add New Bale
                </>
              )}
            </button>

            {/* Cancel Button - Only shows in edit mode */}
            {editId && (
              <button
                type="button"
                onClick={onClose}
                className={`
                    w-full px-5 py-3 rounded-lg font-medium text-sm md:text-base
                    bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                    text-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md
                    transition-all duration-200 focus:outline-none focus:ring-4
                    focus:ring-gray-300/30 dark:focus:ring-gray-500/30
                    border border-gray-200 dark:border-gray-600
                `}
                        >
                <XIcon className="w-5 h-5 mr-2 inline" />
                Cancel Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BaleFormDropdown;
