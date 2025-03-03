import { FiTrash } from 'react-icons/fi';
import api from "../../service/api";
import { useEffect, useState, useRef, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaFacebookF, FaGoogle, FaInstagram, FaPhoneAlt } from 'react-icons/fa';

interface UserProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: boolean;
  created_at: string;
}

export default function Register() {
  const [user, setUser] = useState<UserProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const response = await api.get("/users");
      setUser(response.data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(event.target as HTMLFormElement);

    try {
      const response = await api.post("/register", {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        password: formData.get('password')
      });

      if (response.status >= 200 && response.status < 300) {
        setUser(allUser => [...allUser, response.data]);
        formRef.current?.reset();
        navigate("/login");
      } else {
        throw new Error('Falha no cadastro');
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Erro ao conectar com o servidor');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-6 px-6 text-center shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-2">CADASTRE-SE EM NOSSA PLATAFORMA</h2>
          <p className="text-sm md:text-lg">Comece a usar nossos serviços em poucos minutos</p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="w-full px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">Criar Nova Conta</h1>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              ← Voltar para Home
            </Link>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-6 space-y-6"
          >
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-blue-900 font-medium mb-2">Nome Completo</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  className="w-full p-3 border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">E-mail</label>
                <input
                  name="email"
                  type="email"
                  placeholder="insira@email.com"
                  className="w-full p-3 border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">Telefone</label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="(xx) x xxxx-xxxx"
                  className="w-full p-3 border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">Endereço Completo</label>
                <input
                  name="address"
                  type="text"
                  placeholder="Rua, Número, Bairro, Cidade"
                  className="w-full p-3 border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2">Senha</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Digite sua senha"
                  className="w-full p-3 border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-3 rounded-lg font-bold text-white transition-colors ${isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {isLoading ? 'Cadastrando...' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-blue-900">
              Já possui uma conta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
              >
                Faça login aqui
              </button>
            </p>
          </div>
        </div>
      </main>

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