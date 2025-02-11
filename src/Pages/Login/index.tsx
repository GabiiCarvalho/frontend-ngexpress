import { FormEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../service/api";


export default function Login() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!emailRef.current?.value || !passwordRef.current?.value) return;

    try {
      const response = await api.post("/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (err) {
      setError("Email ou senha inválidos.");
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white text-center mb-6">Login</h1>
        <Link to="/" className="text-white hover:underline rounded bg-orange-500 cursor-pointer w-full p-2">Voltar</Link>
        <form onSubmit={handleSubmit} className="flex flex-col my-6">
          <label className="font-medium text-white">E-mail:</label>
          <input
            type="email"
            placeholder="insira@email.com"
            className="w-full mb-5 p-2 rounded"
            ref={emailRef}
          />
          <label className="font-medium text-white">Senha:</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            className="w-full mb-5 p-2 rounded"
            ref={passwordRef}
          />
          <input
            type="submit"
            value="Entrar"
            className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium text-white"
          />
        </form>
        <div className="mt-4 text-center">
          <p className="text-white">
            Não possui conta?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-orange-500 cursor-pointer hover:underline"
            >
              Clique aqui
            </span>
          </p>
        </div>
      </main>      
    </div>
  );
}
