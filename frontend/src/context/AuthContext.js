import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  const fetchUserProfile = async () => {
    try {
      console.log("Token being sent:", localStorage.getItem("access_token"));
      const response = await api.get("/api/profile/");
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.warn("Access token expired. Attempting refresh...");
        await refreshToken();
      } else {
        console.error("Error fetching user profile:", error);
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) {
      console.error("No refresh token found. Logging out...");
      logout();
      return;
    }

    try {
      const response = await api.post("/api/token/refresh/", { refresh });
      localStorage.setItem("access_token", response.data.access);

      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
      await fetchUserProfile();
    } catch (error) {
      console.error("Token refresh failed. Logging out...");
      logout();
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post("/api/token/", { username, password });
      const { access, refresh } = response.data;

      console.log("Received Access Token:", access);
      console.log("Received Refresh Token:", refresh);

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      console.log("Token after storing:", localStorage.getItem("access_token"));

      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      await fetchUserProfile();
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await api.post("/api/signup/", userData);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login"; // Redirect to login page
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
