import axios from "axios";
import { useAuth } from "../context/useAuth.js";

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/bales`;

const baleApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000,
});

//helper function to handle errors
const handleApiError = (error) => {
  if (error.response) {
    //Server responded with error status

    const message = error.response.data?.message || "Request Failed";
    const status = error.response.status;

    //Create enhanced error object
    const apiError = new Error(message);
    apiError.status = status;
    apiError.details = error.response.data?.errors;
    throw apiError;
  } else if (error.request) {
    throw new Error("Network error  Connection error");
  } else {
    //Something else happened
    throw new Error(`Request Setup Error: " ${error.message}`);
  }
};

//Main Bale Api Function
export const getBales = async ({ queryKey, signal }) => {
  const [_key, { userId }] = queryKey; // Destructure userId
  try {

    const response = await baleApi.get("/", {
      params: { userId }, // Pass as query param
      signal,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data.bales;
  } catch (error) {
    handleApiError(error);
  }
};



export const createBale = async ({ baleData, token }) => {
  try {
    const payload = {
      ...baleData,
      quantity: parseFloat(baleData.quantity),
      pricePerUnit: parseFloat(baleData.pricePerUnit),
    };

    const response = await baleApi.post("/", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateBale = async ({ baleId, baleData, token }) => {
  try {
    const payload = {
      ...baleData,
      quantity: parseFloat(baleData.quantity),
      pricePerUnit: parseFloat(baleData.pricePerUnit),
    };

    const response = await baleApi.put(`/${baleId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteBale = async ({ baleId, token }) => {
  try {
    const response = await baleApi.delete(`/${baleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const useBaleApi = () => {
  const { token } = useAuth();

  return {
    getBales: (params) => ({
      queryKey: ["bales", { params, token }],
      queryFn: getBales,
    }),
    createBale: (baleData) => createBale({ baleData, token }),
    updateBale: ({ baleId, baleData }) => updateBale({ baleId, baleData, token }),
    deleteBale: (baleId) => deleteBale({ baleId, token }),
  };
};