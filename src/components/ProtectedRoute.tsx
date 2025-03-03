// ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const expiration = localStorage.getItem('tokenExpiration');
      
      if (!token || !expiration || Date.now() > Number(expiration)) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpiration');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  return children;
};

export default ProtectedRoute;