import React, { useState } from "react";
import {
  EllipsisVerticalIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const Complaints = () => {
  const [activeTab, setActiveTab] = useState("open");
  const [activeMenu, setActiveMenu] = useState(null);

  const complaints = [
    {
      id: 1,
      customer: "Liam Johnson",
      email: "liam@example.com",
      complaint: "Product arrived damaged",
      status: "Open",
      priority: "High",
    },
    {
      id: 2,
      customer: "Olivia Smith",
      email: "olivia@example.com",
      complaint: "Incorrect item shipped",
      status: "Open",
      priority: "Medium",
    },
    {
      id: 3,
      customer: "Noah Williams",
      email: "noah@example.com",
      complaint: "Subscription not working",
      status: "Open",
      priority: "",
    },
  ];

  const handleAction = (action, complaintId) => {
    console.log(`${action} complaint ${complaintId}`);
    setActiveMenu(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section - Title and Button */}
            <div className="lg:col-span-1 border-color-gray-200 dark:border-gray-700 px-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Customer Complaints
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                View and manage all customer complaints.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm">
                Create New Complaint
              </button>
            </div>

            {/* This Week Stats */}
            <div className="lg:col-span-1 m-4 border-l border-r border-gray-200 dark:border-gray-700 px-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  This Week
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  25
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                  +10% from last week
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "55%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* This Month Stats */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  This Month
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  105
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                  +5% from last month
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "52.5%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Section - Title and Button (spans 2 columns) */}
          <div className="lg:col-span-2 border-color-gray-200 dark:border-gray-700 px-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Customer Complaints
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              View and manage all customer complaints.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm">
              Create New Complaint
            </button>
          </div>

          {/* This Week Stats (1 column) */}
          <div className="lg:col-span-1 m-4 border-l border-r border-gray-200 dark:border-gray-700 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                This Week
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                25
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                +10% from last week
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "55%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* This Month Stats (1 column) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                This Month
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                105
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                +5% from last month
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "52.5%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("open")}
                  className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "open"
                      ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => setActiveTab("resolved")}
                  className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "resolved"
                      ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Resolved
                </button>
                <button
                  onClick={() => setActiveTab("escalated")}
                  className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "escalated"
                      ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Escalated
                </button>
              </div>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                  <FunnelIcon className="w-4 h-4" />
                  <span className="text-sm">Filter</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  <span className="text-sm">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Open Complaints
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              View and manage open customer complaints.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Complaint
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Priority
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {complaint.customer}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {complaint.email}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                        {complaint.complaint}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700 dark:text-gray-300">
                          {complaint.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {complaint.priority && (
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              complaint.priority === "High"
                                ? "bg-blue-600 text-white dark:bg-blue-700"
                                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {complaint.priority}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 relative">
                        <button
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === complaint.id ? null : complaint.id
                            )
                          }
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <EllipsisVerticalIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </button>
                        {activeMenu === complaint.id && (
                          <div className="absolute right-8 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 py-1 w-32">
                            <button
                              onClick={() =>
                                handleAction("resolve", complaint.id)
                              }
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() =>
                                handleAction("escalate", complaint.id)
                              }
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Escalate
                            </button>
                            <button
                              onClick={() =>
                                handleAction("delete", complaint.id)
                              }
                              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
