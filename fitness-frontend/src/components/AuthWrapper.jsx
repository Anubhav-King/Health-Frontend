// src/components/AuthWrapper.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthWrapper = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const activeRole = localStorage.getItem("activeRole");

    if (token && activeRole) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    // Short delay to ensure localStorage is hydrated
    const timeout = setTimeout(() => {
      setCheckingAuth(false);
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  if (checkingAuth) return null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthWrapper;
