import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🟡 Add loading state

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // ✅ loading false aakkanam
  }, []);

  const login = (userData) => {
    const formattedUser = {
      ...userData,
      role: userData.role || (userData.isAdmin ? "admin" : "user"),
      isAdmin: userData.isAdmin || userData.role === "admin",
    };
    localStorage.setItem("user", JSON.stringify(formattedUser));
    setUser(formattedUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
