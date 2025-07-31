// src/components/RoleWrapper.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const RoleWrapper = () => {
  const [checkingRole, setCheckingRole] = useState(true);
  const [validRole, setValidRole] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("activeRole");
    if (role) {
      setValidRole(true);
    } else {
      setValidRole(false);
    }

    const timeout = setTimeout(() => {
      setCheckingRole(false);
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  if (checkingRole) return null;

  return validRole ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RoleWrapper;
