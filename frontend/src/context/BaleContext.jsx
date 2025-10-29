import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./useAuth.js";
import axios from "axios";

export const BaleContext = createContext(null);

const BaleContextProvider = ({ children }) => {
  const [bales, setBales] = useState([]);
  const [balesStats, setBalesStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const backendUrl = import.meta.env.VITE_BACKEND_URL ;

  // Separate purchases and sales from bales - ADD THIS
  const { purchases, sales } = useMemo(() => {
    const purchases = bales.filter(bale => bale.transactionType === 'purchase');
    const sales = bales.filter(bale => bale.transactionType === 'sale');
    return { purchases, sales };
  }, [bales]);

  const fetchBales = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/bales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBales(response.data.data.bales);
    } catch (error) {
      console.error("Error fetching bales:", error);
      setError("Failed to fetch bales");
    } finally {
      setIsLoading(false);
    }
  }, [token, backendUrl]);

  // Fetch bales statistics
  const fetchBalesStats = useCallback(async () => {
    if (!token) return;

    setIsStatsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/bales/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalesStats(response.data.data);
    } catch (error) {
      console.error("Error fetching bales stats:", error);
      setError("Failed to fetch bales statistics");
    } finally {
      setIsStatsLoading(false);
    }
  }, [token, backendUrl]);

  const createBale = useCallback(
    async (baleData) => {
      try {
        const payload = {
          ...baleData,
          quantity: parseFloat(baleData.quantity),
          pricePerUnit: parseFloat(baleData.pricePerUnit),
        };
        const response = await axios.post(`${backendUrl}/bales`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Refresh both bales and stats
        await Promise.all([fetchBales(), fetchBalesStats()]);
        return response.data;
      } catch (error) {
        console.error("Error creating bale:", error);
        throw error;
      }
    },
    [token, backendUrl, fetchBales, fetchBalesStats]
  );

  const updateBale = useCallback(
    async (baleId, baleData) => {
      try {
        // Optimistically update the local state first
        setBales((prevBales) =>
          prevBales.map((bale) =>
            bale._id === baleId ? { ...bale, ...baleData } : bale
          )
        );

        const payload = {
          ...baleData,
          quantity: parseFloat(baleData.quantity),
          pricePerUnit: parseFloat(baleData.pricePerUnit),
        };

        await axios.patch(`${backendUrl}/bales/${baleId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Refresh both bales and stats
        await Promise.all([fetchBales(), fetchBalesStats()]);
      } catch (error) {
        console.error("Update failed:", error);
        // Revert optimistic update on error
        await fetchBales();
        throw error;
      }
    },
    [token, backendUrl, fetchBales, fetchBalesStats]
  );

  const deleteBale = useCallback(
    async (baleId) => {
      try {
        const response = await axios.delete(`${backendUrl}/bales/${baleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Refresh both bales and stats
        await Promise.all([fetchBales(), fetchBalesStats()]);
        return response.data;
      } catch (error) {
        console.error("Error deleting bale:", error);
        throw error;
      }
    },
    [token, backendUrl, fetchBales, fetchBalesStats]
  );

  // Calculate local stats (real-time calculations from current bales data)
  const localBalesStats = useMemo(() => {
    const stats = {
      totalPurchases: 0,
      totalSales: 0,
      totalRevenue: 0,
      purchaseCount: purchases.length, // Use the separated purchases
      saleCount: sales.length, // Use the separated sales
      totalQuantityPurchased: 0,
      totalQuantitySold: 0,
    };

    bales.forEach((bale) => {
      const totalAmount = bale.quantity * bale.pricePerUnit;

      if (bale.transactionType === "purchase") {
        stats.totalPurchases += totalAmount;
        stats.totalQuantityPurchased += bale.quantity;
      } else if (bale.transactionType === "sale") {
        stats.totalSales += totalAmount;
        stats.totalQuantitySold += bale.quantity;
      }
    });

    stats.totalRevenue = stats.totalSales - stats.totalPurchases;
    stats.averagePurchasePrice =
      stats.totalQuantityPurchased > 0
        ? stats.totalPurchases / stats.totalQuantityPurchased
        : 0;
    stats.averageSalePrice =
      stats.totalQuantitySold > 0
        ? stats.totalSales / stats.totalQuantitySold
        : 0;
    stats.profitMargin =
      stats.totalSales > 0 ? (stats.totalRevenue / stats.totalSales) * 100 : 0;

    return stats;
  }, [bales, purchases.length, sales.length]);

  // Fetch initial data when token changes
  useEffect(() => {
    if (token) {
      Promise.all([fetchBales(), fetchBalesStats()]);
    }
  }, [token, fetchBales, fetchBalesStats]);

  const contextValue = useMemo(
    () => ({
      bales,
      purchases, // ADD THIS - separated purchases
      sales, // ADD THIS - separated sales
      balesStats: balesStats || localBalesStats,
      localBalesStats,
      isLoading,
      isStatsLoading,
      error,
      fetchBales,
      fetchBalesStats,
      createBale,
      updateBale,
      deleteBale,
    }),
    [
      bales,
      purchases, // ADD THIS
      sales, // ADD THIS
      balesStats,
      localBalesStats,
      isLoading,
      isStatsLoading,
      error,
      fetchBales,
      fetchBalesStats,
      createBale,
      updateBale,
      deleteBale,
    ]
  );

  return (
    <BaleContext.Provider value={contextValue}>{children}</BaleContext.Provider>
  );
};

export default BaleContextProvider;
