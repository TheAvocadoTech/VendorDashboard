import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage so refresh doesn't log vendor out
  const [vendor, setVendor] = useState(
    () => JSON.parse(localStorage.getItem("vendor")) || null
  );

  const login = (data) => {
    localStorage.setItem("vendor", JSON.stringify(data.vendor));
    localStorage.setItem("vendorToken", data.token);
    setVendor(data.vendor);
  };

  const logout = () => {
    localStorage.removeItem("vendor");
    localStorage.removeItem("vendorToken");
    setVendor(null);
  };

  // Helper — attach token to any fetch call
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
  });

  return (
    <AuthContext.Provider value={{ vendor, login, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
};