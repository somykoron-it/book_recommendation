// AuthProviderClient.js
"use client";
import { useState } from "react";
import { createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProviderClient = ({ children, initialUser }) => {
  const [user, setUser] = useState(initialUser);
  const isLoggedIn = !!user;

  const setAuth = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
