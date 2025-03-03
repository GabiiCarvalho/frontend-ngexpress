import axios from "axios";
import api from "../../service/api";
import { useEffect, useState, useRef, FormEvent } from "react";
import { FiTrash } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaFacebookF, FaGoogle, FaInstagram, FaPhoneAlt } from "react-icons/fa";

interface DeliveryProps {
  id: string;
  cidadePartida: string;
  enderecoPartida: string;
  cidadeDestino: string;
  enderecoDestino: string;
  tarifaBase: number;
  createdAt: Date;
}


const CIDADES_VALIDAS = [
  "Araquari", "Ararangua", "Apiúna", "Balneário Camboriú", "Biguaçu",
  "Blumenau", "Barra Velha", "Bombinhas", "Brusque", "Camboriú",
  "Canelinha", "Florianópolis", "Gaspar", "Gravatá", "Itajaí",
  "Itapema", "Ilhota", "Joinville", "Jaraguá do Sul", "Luiz Alves",
  "Lages", "Navegantes", "Mariscal", "Porto Belo", "Palhoça", "Penha", 
  "Rio do Sul", "São João Batista", "São José", "Tijucas"
];

const tokenManager = {
  get: () => {
    const token = localStorage.getItem('accessToken');
    const expiration = localStorage.getItem('tokenExpiration');
    return token && expiration ? { 
      token, 
      expiration: parseInt(expiration, 10) 
    } : null;
  },
  isValid: () => {
    const data = tokenManager.get();
    return data && data.expiration > Date.now();
  },
  clear: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExpiration');
  }
};

export default function Delivery() {
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<DeliveryProps[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const inputs = {
    cidadePartida: useRef<HTMLInputElement>(null),
    enderecoPartida: useRef<HTMLInputElement>(null),
    cidadeDestino: useRef<HTMLInputElement>(null),
    enderecoDestino: useRef<HTMLInputElement>(null)
  };

  useEffect(() => {
    const verifyAuth = () => {
      if (!tokenManager.isValid()) {
        tokenManager.clear();
        navigate('/login');
      }
    };

    verifyAuth();
    loadDelivery();
  }, [navigate]);

  const loadDelivery = async () => {
    try {
      const authData = tokenManager.get();
      console.log('Dados de autenticação:', authData); // Log dos dados
      
      if (!authData || !tokenManager.isValid()) {
        console.error('Token inválido ou expirado');
        tokenManager.clear();
        navigate('/login', { state: { error: 'Sessão expirada' } }); // Feedback claro
        return;
      }
  
      const { data } = await api.get('/pedido');
      console.log('Dados recebidos:', data); // Log da resposta
      setDelivery(validateDeliveryData(data));
    } catch (error) {
      console.error('Erro na requisição:', error);
      handleApiError(error);
    }
  };
  
  {/*// 4. Adicione tratamento de erro aprimorado
  const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      console.error('Detalhes do erro:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      if (error.response?.status === 401) {
        tokenManager.clear();
        navigate('/login', { 
          state: { 
            error: 'Sessão expirada. Faça login novamente' 
          } 
        });
      }
    }
    alert("Operação falhou. Verifique o console para detalhes.");
  };*/}

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!formRef.current?.checkValidity()) return;

    const formData = Object.fromEntries(
      Object.entries(inputs).map(([key, ref]) => [key, ref.current?.value.trim() ?? ''])
    );

    if (!validateCities(formData)) return;

    try {
      const { data } = await api.post("/pedido", formData, {        
      });
      
      setDelivery(prev => [...prev, transformDeliveryItem(data)]);
      formRef.current?.reset();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;
    
    try {
      await api.delete(`/pedido/${id}`, {        
      });
      setDelivery(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      handleApiError(error);
    }
  };

  // Funções auxiliares
  const validateCities = (data: Record<string, string>) => {
    const isValid = CIDADES_VALIDAS.some(c => c === data.cidadePartida) &&
                   CIDADES_VALIDAS.some(c => c === data.cidadeDestino);
    if (!isValid) alert("Cidade(s) inválida(s)!");
    return isValid;
  };

  const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      tokenManager.clear();
      navigate("/login");
    }
    console.error("Erro na operação:", error);
    alert("Operação falhou!");
  };

  const validateDeliveryData = (data: any): DeliveryProps[] => {
    return data.map((item: any) => ({
      id: item._id,
      cidadePartida: item.cidadePartida || "Desconhecida",
      enderecoPartida: item.enderecoPartida || "",
      cidadeDestino: item.cidadeDestino || "Desconhecida",
      enderecoDestino: item.enderecoDestino || "",
      tarifaBase: Number(item.tarifaBase) || 0,
      createdAt: new Date(item.createdAt)
    }));
  };

  const transformDeliveryItem = (item: any): DeliveryProps => ({
    id: item._id,
    cidadePartida: item.cidadePartida,
    enderecoPartida: item.enderecoPartida,
    cidadeDestino: item.cidadeDestino,
    enderecoDestino: item.enderecoDestino,
    tarifaBase: Number(item.tarifaBase),
    createdAt: new Date(item.createdAt)
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Promocional Igual à Home */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white pt-4 pb-6 px-6 text-center shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-2">SOLICITE SEU ENTREGA AGORA</h2>
          <p className="text-sm md:text-lg mb-3">Rápido, seguro e com o melhor custo-benefício</p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="w-full px-4 py-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              Solicitação de Pedidos
            </h1>
            <Link 
              to="/" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              ← Voltar
            </Link>
          </div>

          {/* Formulário Atualizado */}
          <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(inputs).map(([name, ref]) => (
                <div key={name} className="mb-4">
                  <label className="block text-blue-900 font-medium mb-2">
                    {name.replace(/([A-Z])/g, ' $1')}:
                  </label>
                  <input
                    ref={ref}
                    type="text"
                    className="w-full p-3 border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    list={name.includes("cidade") ? "cidadesList" : undefined}
                  />
                </div>
              ))}
            </div>

            <datalist id="cidadesList">
              {CIDADES_VALIDAS.map((cidade, index) => (
                <option key={index} value={cidade} />
              ))}
            </datalist>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Solicitar Entrega
            </button>
          </form>

          {/* Lista de Pedidos Estilizada */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {delivery.map((item) => (
              <article 
                key={item.id} 
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 relative"
              >
                <div className="space-y-3">
                  {Object.entries(item).map(([key, value]) => (
                    key !== "id" && (
                      <p key={key} className="text-blue-900">
                        <span className="font-semibold">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>{" "}
                        {key === "tarifaBase" ? `R$ ${value.toFixed(2)}` : value}
                      </p>
                    )
                  ))}
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-700"
                >
                  <FiTrash size={20} />
                </button>
              </article>
            ))}
          </section>
        </div>
      </main>

      <section className="w-full max-w-2xl mt-8 space-y-4">
        {delivery.map((item) => (
          <article key={item.id} className="bg-white p-4 rounded-lg relative hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(item).map(([key, value]) => (
                key !== "id" && (
                  <p key={key}>
                    <span className="font-semibold">{key.replace(/([A-Z])/g, ' $1')}:</span>{" "}
                    {key === "tarifaBase" ? `R$ ${value.toFixed(2)}` : value}
                  </p>
                )
              ))}
            </div>
            <button 
              onClick={() => handleDelete(item.id)}
              className="btn-delete"
            >
              <FiTrash size={18} />
            </button>
          </article>
        ))}
      </section>

        {/* Footer*/}
              <footer className="w-full bg-blue-900 text-white py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div>
                      <h4 className="text-xl font-bold mb-4 text-cyan-400">Contato</h4>
                      <p className="flex items-center mb-2">
                        <FaPhoneAlt className="mr-2" />
                        (47) 9 9912-3260
                      </p>
                      <p className="flex items-center">
                        <FaEnvelope className="mr-2" />
                        comercial.ngexpress@gmail.com
                      </p>
                    </div>
        
                    <div>
                      <h4 className="text-xl font-bold mb-4 text-cyan-400">Legal</h4>
                      <p>CNPJ: 24.723.159/0001-00</p>
                      <p>Termos de Uso</p>
                      <p>Política de Privacidade</p>
                    </div>
        
                    <div>
                      <h4 className="text-xl font-bold mb-4 text-cyan-400">Redes Sociais</h4>
                      <div className="flex space-x-4 text-2xl">
                        <a
                          href="https://www.facebook.com/negexpressteleentrega?mibextid=ZbWKwL"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaFacebookF />
                        </a>
                        <a
                          href="https://www.instagram.com/ng.express_/profilecard/?igsh=MTB6NnJ0N3AxZXc4Zw=="
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaInstagram />
                        </a>
                        <a
                          href="https://www.google.com.br/search?q=n%26g"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaGoogle />
                        </a>
                      </div>
                    </div>
                  </div>
        
                  <div className="pt-6 border-t border-blue-800 text-center text-sm text-blue-300">
                    <p>2016 - 2025, Copyright © N&G Express. Todos os direitos reservados.</p>
                  </div>
                </div>
              </footer>

    </div>
  );
}

// Estilos reutilizáveis
const btnBase = "w-full p-2 rounded font-medium transition-colors duration-200";
const btnPrimary = `${btnBase} bg-orange-500 text-white hover:bg-orange-600`;
const btnSubmit = `${btnBase} bg-green-500 text-white hover:bg-green-600`;
const btnDelete = "absolute top-2 right-2 bg-red-600 w-7 h-7 flex items-center justify-center rounded hover:bg-red-700";