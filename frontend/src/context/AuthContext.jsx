import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext({
  token: null,
  user: null,
  isAuthenticated: false,
  loginFunction: () => {},
  logoutFunction: () => {},
  isLoading: true,
  refreshToken: async () => {},

});

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);



  

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("Initializing auth state ....")
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          setToken(storedToken);
          setUser({
            name: decoded.name || "Guest",
            email: decoded.email,
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const loginFunction = useCallback((newToken, userData) => {
    try {
      const decoded = jwtDecode(newToken);
      setToken(newToken);
      setUser(userData || {
        name: decoded.name || "Guest",
        email: decoded.email,
      });
      localStorage.setItem("token", newToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Invalid token during login:", error);
      logoutFunction();
    }
  }, []);

  const logoutFunction = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }, []);

  const value = {
    token,
    user,
    isAuthenticated,
    loginFunction,
    logoutFunction,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};