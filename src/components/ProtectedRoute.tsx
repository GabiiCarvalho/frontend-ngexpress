import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Verificando autenticação...');
    const token = localStorage.getItem('token');
    console.log('Token encontrado:', token ? 'Sim' : 'Não');
  });

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Verifica se o token é válido
        await api.get('/auth/verify');
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    verifyAuth();
  }, [navigate]);

  return children;
};

export default ProtectedRoute;