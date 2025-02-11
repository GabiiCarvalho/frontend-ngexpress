// components/HistoricoPedidos.tsx
import { useEffect, useState } from 'react';
import api from "../../service/api";
import { useNavigate } from 'react-router-dom';

export default function HistoricoPedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/historicoPedidos', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setPedidos(response.data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        localStorage.removeItem('authToken');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [navigate]);

  if (loading) return <div className="text-white text-center">Carregando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-medium text-white text-center mb-6">Meus Pedidos</h1>
      
      <div className="grid gap-4">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-gray-800 p-4 rounded-lg shadow-md text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">
                {new Date(pedido.createdAt).toLocaleDateString()}
              </span>
              <span className={`px-2 py-1 rounded ${
                pedido.status === 'ENTREGUE' ? 'bg-green-600' :
                pedido.status === 'CANCELADO' ? 'bg-red-600' : 'bg-yellow-600'
              }`}>
                {pedido.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-orange-500">Origem</h3>
                <p>{pedido.cidadePartida}</p>
                <p className="text-sm text-gray-400">{pedido.enderecoPartida}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-orange-500">Destino</h3>
                <p>{pedido.cidadeDestino}</p>
                <p className="text-sm text-gray-400">{pedido.enderecoDestino}</p>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-700 pt-2">
              <p className="text-right font-semibold">
                Valor: R$ {pedido.tarifaBase?.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {pedidos.length === 0 && (
        <div className="text-center text-white mt-8">
          Nenhum pedido encontrado.
        </div>
      )}
    </div>
  );
}