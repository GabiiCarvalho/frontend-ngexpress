import { FormEvent, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../service/api";
import { FaEnvelope, FaFacebookF, FaGoogle, FaInstagram, FaPhoneAlt } from "react-icons/fa";

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/delivery");
    }
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();

    if (!email || !password) {
      setError("Preencha todos os campos");
      setIsLoading(false);
      return;
    }

    // HandleSubmit:
    try {
      const response = await api.post('/login', { email, password });
      
      // Armazenamento corrigido com verificação
      if (response.data?.token) {
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem(
          'tokenExpiration',
          String(Date.now() + 8 * 60 * 60 * 1000)
        );
        console.log('Autenticação bem-sucedida. Token:', response.data.token); 
      } else {
        throw new Error('Token não recebido na resposta');
      }
      
      navigate('/delivery');
    } catch (err: any) {
      console.error("Erro no login:", err);
      const errorMessage = err.response?.data?.error ||
        (err.response?.status === 401 ? "Credenciais inválidas" :
          "Erro ao realizar login. Tente novamente.");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Promocional Igual à Home */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white pt-4 pb-6 px-6 text-center shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-2">PREPARE-SE PARA O MÊS DO CONSUMIDOR</h2>
          <p className="text-sm md:text-lg mb-3">Esquente suas vendas com fretes especiais!</p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="w-full px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-900 text-center mb-8">Login</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-6">
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            <div className="mb-4">
              <label className="block text-blue-900 font-medium mb-2">E-mail:</label>
              <input
                type="email"
                placeholder="insira@email.com"
                className="w-full p-3 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                ref={emailRef}
                required
                autoFocus
              />
            </div>

            <div className="mb-6">
              <label className="block text-blue-900 font-medium mb-2">Senha:</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                className="w-full p-3 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                ref={passwordRef}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-3 rounded-lg font-bold text-white transition-colors
                ${isLoading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isLoading ? "Carregando..." : "Entrar"}
            </button>
          </form>

          <div className="text-center mb-8">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Voltar para a página inicial
            </Link>
          </div>

          <div className="text-center">
            <p className="text-blue-900">
              Não possui conta?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                Criar nova conta
              </Link>
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