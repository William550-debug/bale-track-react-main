const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const signup = async ({ name, email, password }) => {
  const endpoint = `${BASE_URL}/user/signup`; // ✅ Removed duplicate /api
  console.log("Attempting signup at:", endpoint);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `Signup failed (${res.status})`);
    }

    return data;
  } catch (error) {
    console.error("Signup Error:", error);
    throw new Error(error.message || "Signup failed. Please try again.");
  }
};

export const login = async ({ email, password }) => {
  const endpoint = `${BASE_URL}/user/login`; // ✅ Also fix here if needed
  console.log("Attempting login at:", endpoint);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    console.error("Login failed:", errorDetails);
    throw new Error("Failed to login");
  }

  const data = await res.json();
  return data;
};
