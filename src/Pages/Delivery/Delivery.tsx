import axios from "axios";
import api from "../../service/api";
import { useEffect, useState, useRef, FormEvent } from "react";
import { FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";

interface DeliveryProps {
  id: string;
  cidadePartida: string;
  enderecoPartida: string;
  cidadeDestino: string;
  enderecoDestino: string;
  tarifaBase: number;
  createdAt: Date;
}

// Lista fixa de cidades válidas
const CIDADES_VALIDAS = [
  "Araquari", "Ararangua", "Apiúna", "Balneário Camboriú", "Biguaçu",
  "Blumenau", "Barra Velha", "Bombinhas", "Brusque", "Camboriú",
  "Canelinha", "Florianópolis", "Gaspar", "Gravatá", "Itajaí",
  "Itapema", "Ilhota", "Joinville", "Jaraguá do Sul", "Luiz Alves",
  "Lages", "Navegantes", "Mariscal", "Porto Belo", "Palhoça", "Penha", 
  "Rio do Sul", "São João Batista", "São José", "Tijucas"
];

export default function Delivery() {
  const [delivery, setDelivery] = useState<DeliveryProps[]>([]);
  const cidadePartidaRef = useRef<HTMLInputElement>(null);
  const enderecoPartidaRef = useRef<HTMLInputElement>(null);
  const cidadeDestinoRef = useRef<HTMLInputElement>(null);
  const enderecoDestinoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDelivery();
  }, []);

  const getToken = () => localStorage.getItem("jwtToken");

  async function loadDelivery() {
    const token = getToken();

    if (!token) {
      alert("Faça login para acessar!");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await api.get("/pedido", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (!Array.isArray(response.data)) {
        throw new Error("Dados inválidos recebidos da API");
      }

      setDelivery(response.data.map((item: any) => ({
        id: item._id,
        cidadePartida: item.cidadePartida,
        enderecoPartida: item.enderecoPartida,
        cidadeDestino: item.cidadeDestino,
        enderecoDestino: item.enderecoDestino,
        tarifaBase: Number(item.tarifaBase) || 0,
        createdAt: new Date(item.createdAt) 
      })));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("jwtToken");
        window.location.href = "/login";
      }
      console.error("Erro ao carregar entregas:", error);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const partida = cidadePartidaRef.current?.value?.trim() || "";
    const enderecoPartida = enderecoPartidaRef.current?.value?.trim() || "";
    const destino = cidadeDestinoRef.current?.value?.trim() || "";
    const enderecoDestino = enderecoDestinoRef.current?.value?.trim() || "";

    if (!partida || !destino || !enderecoPartida || !enderecoDestino) {
      alert("Preencha todos os campos!");
      return;
    }

    const normalizeCity = (city: string) => city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Normalização e validação de cidade
    const cidadeExataPartida = CIDADES_VALIDAS.find(
      (c) => c.toLowerCase() === partida.toLowerCase()
    );
    const cidadeExataDestino = CIDADES_VALIDAS.find(
      (c) => c.toLowerCase() === destino.toLowerCase()
    );

    if (!cidadeExataPartida || !cidadeExataDestino) {
      alert("Uma ou ambas as cidades não são válidas!");
      return;
    }

    try {
      const response = await api.post("/pedido", {
        cidadePartida: cidadeExataPartida,
        enderecoPartida,
        cidadeDestino: cidadeExataDestino,
        enderecoDestino,
        user: {
          connect: { id: 'userId' }
        },
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      setDelivery(prev => [...prev, {
        id: response.data._id,
        ...response.data,
        tarifaBase: Number(response.data.tarifaBase)
      }]);

      // Limpa os campos
      if (cidadePartidaRef.current) cidadePartidaRef.current.value = "";
      if (enderecoPartidaRef.current) enderecoPartidaRef.current.value = "";
      if (cidadeDestinoRef.current) cidadeDestinoRef.current.value = "";
      if (enderecoDestinoRef.current) enderecoDestinoRef.current.value = "";

    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Erro ao criar pedido!");
    }
  }

  async function handleDelete(id: string) {    
    if (!window.confirm("Tem certeza que deseja excluir este pedido?")) return;

    try {
      await api.delete(`/pedido/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });      
      setDelivery(prev => prev.filter(item => item.id !== id));
      
    } catch (error) {
      console.error("Erro ao excluir pedido", error);
      alert("Erro ao excluir pedido!");
      loadDelivery();
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white text-center mb-6">Solicitação de Pedidos</h1>
        <Link to="/" className="block text-center text-white hover:underline rounded bg-orange-500 cursor-pointer w-full p-2 mb-4">
          Voltar
        </Link>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Cidade de Partida:</label>
          <input type="text" placeholder="Ex: Balneário Camboriú" className="w-full mb-5 p-2 rounded" ref={cidadePartidaRef} list="cidadesList" />

          <label className="font-medium text-white">Endereço:</label>
          <input type="text" placeholder="Rua, Nº" className="w-full mb-5 p-2 rounded" ref={enderecoPartidaRef} />

          <label className="font-medium text-white">Cidade de Destino:</label>
          <input type="text" placeholder="Ex: Florianópolis" className="w-full mb-5 p-2 rounded" ref={cidadeDestinoRef} list="cidadesList" />

          <label className="font-medium text-white">Endereço:</label>
          <input type="text" placeholder="Rua, Nº" className="w-full mb-5 p-2 rounded" ref={enderecoDestinoRef} />

          <datalist id="cidadesList">
            {CIDADES_VALIDAS.map((cidade, index) => (
              <option key={index} value={cidade} />
            ))}
          </datalist>

          <input type="submit" value="Solicitar" className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium hover:bg-green-600 transition-colors" />
        </form>

        <section className="flex flex-col gap-4">
          {delivery.map((item) => (
            <article key={item.id} 
            className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">
              <p><span className="font-medium">Cidade de Partida:</span> {item.cidadePartida}</p>
              <p><span className="font-medium">Endereço:</span> {item.enderecoPartida}</p>
              <p><span className="font-medium">Destino:</span> {item.cidadeDestino}</p>
              <p><span className="font-medium">Endereço:</span> {item.enderecoDestino}</p>
              <p><span className="font-medium">Tarifa:</span> R$ {item.tarifaBase.toFixed(2)}</p>
              <button onClick={() => handleDelete(item.id)} className="bg-red-600 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2 hover:bg-red-700 transition-colors">
                <FiTrash size={18} color="#FFF"/>
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
