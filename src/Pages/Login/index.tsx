import { FormEvent, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../service/api";

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Verifica se já está logado ao carregar o componente
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    console.log('token no localStorage', token);
    if (token && window.location.pathname !== "/") {
      console.log("Token encontrado, redirecionando para / (home)")
      navigate("/"); // Redireciona para a página inicial
    }
  }, [navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      if (!email || !password) {
        setError("Preencha todos os campos");
        return;
      }

      const response = await api.post("/login", {
        email,
        password,
      });

      console.log(response.data);

      // Armazena o token e dados do usuário
      localStorage.setItem("jwtToken", response.data.token);
      console.log('token armazenado', response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data.user));

      // Valida o token antes do redirecionamento
      await api.get("/protected", {
        headers: {
          Authorization: `Bearer ${response.data.token}`
        }
      });
  
      navigate("/");
    } catch (err: any) {
      console.error("Erro no login:", err);
      
      if (err.response?.status === 401) {
        setError("Credenciais inválidas");
      } else {
        setError("Erro ao realizar login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white text-center mb-6">Login</h1>
        
        <Link 
          to="/" 
          className="block text-center text-white hover:underline rounded bg-orange-500 cursor-pointer w-full p-2 mb-4"
        >
          Voltar
        </Link>

        <form onSubmit={handleSubmit} className="flex flex-col my-6">
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <label className="font-medium text-white">E-mail:</label>
          <input
            type="email"
            placeholder="insira@email.com"
            className="w-full mb-5 p-2 rounded"
            ref={emailRef}
            required
            autoFocus
          />

          <label className="font-medium text-white">Senha:</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            className="w-full mb-5 p-2 rounded"
            ref={passwordRef}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`cursor-pointer w-full p-2 rounded font-medium text-white ${
              isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-white">
            Não possui conta?{" "}
            <Link
              to="/register"
              className="text-orange-500 cursor-pointer hover:underline"
            >
              Clique aqui
            </Link>
          </p>
        </div>
      </main>      
    </div>
  );
}
