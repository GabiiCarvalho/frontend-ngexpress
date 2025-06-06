import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../service/api";
import { FiArrowLeft, FiClock, FiMapPin, FiDollarSign, FiUser } from "react-icons/fi";

interface Order {
  id: string;
  cidadePartida: string;
  cidadeDestino: string;
  enderecoPartida: string;
  enderecoDestino: string;
  tarifaBase: number;
  status: string;
  createdAt: string;
}

interface User {
  nome: string;
  email: string;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await api.get("/pedido", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data);
    } catch (error) {
      alert("Erro ao carregar histórico. Faça login novamente.");
      localStorage.removeItem("jwtToken");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadOrders();
  }, [navigate, user]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <FiArrowLeft className="mr-2" /> Voltar para Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Histórico de Pedidos</h1>
        </div>

        {user && (
          <div className="mb-4 flex items-center bg-white p-4 rounded-lg shadow">
            <FiUser className="text-gray-600 mr-2" />
            <span className="text-gray-800 font-semibold">
              Bem-vindo, {user.nome}
            </span>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600">Carregando histórico...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-600">Nenhum pedido encontrado</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FiClock className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${order.status === "ENTREGUE"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FiMapPin className="text-red-500 mr-2" />
                    <div>
                      <h3 className="font-semibold">Origem</h3>
                      <p className="text-gray-600">{order.cidadePartida}</p>
                      <p className="text-sm text-gray-500">{order.enderecoPartida}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FiMapPin className="text-blue-500 mr-2" />
                    <div>
                      <h3 className="font-semibold">Destino</h3>
                      <p className="text-gray-600">{order.cidadeDestino}</p>
                      <p className="text-sm text-gray-500">{order.enderecoDestino}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FiDollarSign className="text-green-500 mr-2" />
                    <span className="text-lg font-bold">
                      R$ {order.tarifaBase.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ID: #{order.id.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
