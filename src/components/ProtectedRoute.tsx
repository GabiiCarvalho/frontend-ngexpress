// ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(false);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
  
      try {
        
        await api.get("/protected", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsValidToken(true);
      } catch (error) {
        localStorage.removeItem("jwtToken");
        navigate("/login");
      }
    };
  
    validateToken();
  }, [token, navigate]);

  return isValidToken ? children : null;
}