// context/ReportsContext.jsx
import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./useAuth.js";
import axios from "axios";
import { toast } from "react-toastify";

export const ReportsContext = createContext(null);

const ReportsContextProvider = ({ children }) => {
  const [financialData, setFinancialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState(null);
  const { token } = useAuth();

  const backendUrl = import.meta.env.VITE_BACKEND_URL ;

  // Fetch financial data for reports
  const fetchFinancialData = useCallback(
    async (period = "monthly") => {
      if (!token) return;

      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${backendUrl}/reports/financial/data`, {
          // Added /api
          headers: { Authorization: `Bearer ${token}` },
          params: { period },
        });

        setFinancialData(res.data.data);
        return res.data.data;
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to fetch financial data";
        console.error(message, err);
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token, backendUrl]
  );

  // Export financial report
  const exportFinancialReport = useCallback(
    async (format = "pdf", period = "monthly") => {
      if (!token) throw new Error("Not authenticated");

      console.log("🔍 [DEBUG] Starting export with:", {
        format,
        period,
        token: token ? "exists" : "missing",
      });
      console.log("🔍 [DEBUG] Backend URL:", backendUrl);

      setExportLoading(true);
      setExportError(null);

      try {
        const fullUrl = `${backendUrl}/reports/financial`;
        console.log("🔍 [DEBUG] Making request to:", fullUrl);
        
        const response = await axios.get(
          fullUrl, // Added /api and removed query string from URL
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
            params: { format, period }, // Use params option instead of URL string
          }
          
        );

        // Check if response is valid
        if (!response.data || response.data.size === 0) {
          throw new Error("Empty file received from server");
        }

        // Create blob and download
        const blob = new Blob([response.data], {
          type:
            format === "pdf"
              ? "application/pdf"
              : "application/xlsx",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `financial_report_${period}_${new Date()
          .toISOString()
          .slice(0, 10)}.${format}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);


          console.log("Debug export completed")
        toast.success(`Financial report exported as ${format.toUpperCase()}!`);
        return true;


      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to export financial report";
        console.error("Export error:", message, err);
        setExportError(message);
        toast.error(message);
        throw err;
      } finally {
        setExportLoading(false);
      }
    },
    [token, backendUrl]
  );


  

  // Clear errors
  const clearError = useCallback(() => {
    setError(null);
    setExportError(null);
  }, []);

  // Context value
  const contextValue = useMemo(
    () => ({
      // State
      financialData,
      isLoading,
      error,
      exportLoading,
      exportError,

      // Functions
      fetchFinancialData,
      exportFinancialReport,
      clearError,
    }),
    [
      financialData,
      isLoading,
      error,
      exportLoading,
      exportError,
      fetchFinancialData,
      exportFinancialReport,
      clearError,
    ]
  );

  return (
    <ReportsContext.Provider value={contextValue}>
      {children}
    </ReportsContext.Provider>
  );
};

export default ReportsContextProvider;
