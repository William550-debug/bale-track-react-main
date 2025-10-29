import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./useAuth.js";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"

export const SavingsContext = createContext(null);

const SavingsContextProvider = ({ children }) => {
  const [savings, setSavings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL ;

  const fetchSavings = useCallback(
    async (params = {}) => {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${backendUrl}/savings`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            sortBy: params.sortBy || "createdAt",
            sortOrder: params.sortOrder || "desc",
            type: params.type || undefined,
          },
        });
        setSavings(res.data.data.savings || []);
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to fetch savings";
        console.error(message, err);
        setError(message);
        toast.error(message);
        throw err; // Re-throw to allow error handling in components
      } finally {
        setIsLoading(false);
      }
    },
    [token, backendUrl]
  );

  const createSaving = useCallback(
    async (savingsData) => {
      if (!token) throw new Error("Not authenticated");

      setIsLoading(true);
      try {
        // Base payload for all savings types
        const payload = {
          savingsType: savingsData.savingsType,
          savingsAmount: Number(savingsData.savingsAmount),
          savingsDate: savingsData.savingsDate,
          targetName: savingsData.targetName || undefined,
          targetAmount: savingsData.targetAmount
            ? Number(savingsData.targetAmount)
            : undefined,
        };

        const res = await axios.post(`${backendUrl}/savings`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSavings((prev) => [res.data.data.savings, ...prev]);
        toast.success("Savings created successfully!");
        return res.data.data.savings;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to create savings";
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

  const updateSaving = useCallback(
    async (id, savingsData) => {
      if (!token) throw new Error("Not authenticated");

      setIsLoading(true);
      try {
        // Unified payload structure for all types
        const payload = {
          savingsType: savingsData.savingsType,
          savingsAmount: Number(savingsData.savingsAmount),
          savingsDate: savingsData.savingsDate,
          targetName: savingsData.targetName || undefined,
          targetAmount: savingsData.targetAmount
            ? Number(savingsData.targetAmount)
            : undefined,
        };

        const res = await axios.patch(`${backendUrl}/savings/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSavings((prev) =>
          prev.map((sav) => (sav._id === id ? res.data.data.savings : sav))
        );
        toast.success("Savings updated successfully!");
        return res.data.data.savings;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to update saving";
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

  const deleteSaving = useCallback(
    async (id) => {
      if (!token) throw new Error("Not authenticated");

      setIsLoading(true);
      const prevSavings = [...savings];

      // Optimistic update
      setSavings((prev) => prev.filter((sav) => sav._id !== id));

      try {
        await axios.delete(`${backendUrl}/savings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Savings deleted successfully!");
      } catch (err) {
        // Rollback on error
        setSavings(prevSavings);
        const message =
          err.response?.data?.message || "Failed to delete saving";
        console.error(message, err);
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token, backendUrl, savings]
  );

  const fetchSavingsStats = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/savings/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch savings stats";
      console.error(message, err);
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [token, backendUrl]);

  // Calculate progress for target savings
  const savingsStats = useMemo(() => {
    const stats = {
      personal: 0,
      business: 0,
      totals: {
        target: 0,
        overall: 0,
      },
      targetProgress: [],
    };

    savings.forEach((saving) => {
      stats[saving.savingsType] += saving.savingsAmount;
      stats.totals.overall += saving.savingsAmount;

      if (saving.savingsType) {
        stats.totals.target += saving.savingsAmount;
        if (saving.targetAmount) {
          stats.targetProgress.push({
            ...saving,
            progress: Math.min(
              Math.round((saving.savingsAmount / saving.targetAmount) * 100),
              100
            ),
          });
        }
      }
    });

    return stats;
  }, [savings]);


   const handleNewGoal = () => {
    // Find the data-entry item and navigate to its path
    navigate("/data-entry")
 
  };

  useEffect(() => {
    if (token) fetchSavings();
  }, [fetchSavings, token]);

  const contextValue = useMemo(
    () => ({
      savings,
      fetchSavings,
      createSaving,
      deleteSaving,
      updateSaving,
      fetchSavingsStats,
      isLoading,
      error,
      savingsStats,
      handleNewGoal,
    }),
    [
      savings,
      fetchSavings,
      createSaving,
      deleteSaving,
      updateSaving,
      fetchSavingsStats,
      isLoading,
      error,
      savingsStats,
      handleNewGoal
    ]
  );

  return (
    <SavingsContext.Provider value={contextValue}>
      {children}
    </SavingsContext.Provider>
  );
};

export default SavingsContextProvider;
