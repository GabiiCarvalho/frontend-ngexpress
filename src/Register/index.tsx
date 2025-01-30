import { FiTrash } from 'react-icons/fi';
import { api } from "../service/api"
import { useEffect, useState, useRef, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';


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

  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const response = await api.get("/user");
    setUser(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!nameRef.current?.value || !emailRef.current?.value || !phoneRef.current?.value || !addressRef.current?.value || !passwordRef.current?.value) return;

    try {
      const response = await api.post("/user", {
        name: nameRef.current.value,
        email: emailRef.current.value,
        phone: phoneRef.current.value,
        address: addressRef.current.value,
        password: passwordRef.current?.value
      });
      setUser(allUser => [...allUser, response.data]);


      nameRef.current.value = "";
      emailRef.current.value = "";
      phoneRef.current.value = "";
      addressRef.current.value = "";
      passwordRef.current.value = "";
      
      navigate("/login");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white text-center mb-6">Cadastro</h1>
        <Link to="/" className="text-white hover:underline rounded bg-orange-500 cursor-pointer w-full p-2">Voltar</Link>
        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Nome:</label>
          <input
            type="text"
            placeholder="Digite seu nome completo"
            className="w-full mb-5 p-2 rounded"
            ref={nameRef}
          />
          <label className="font-medium text-white">E-mail:</label>
          <input
            type="text"
            placeholder="insira@email.com"
            className="w-full mb-5 p-2 rounded"
            ref={emailRef}
          />
          <label className="font-medium text-white">Telefone:</label>
          <input
            type="text"
            placeholder="(xx) x xxxx-xxxx"
            className="w-full mb-5 p-2 rounded"
            ref={phoneRef}
          />
          <label className="font-medium text-white">Endereço:</label>
          <input
            type="text"
            placeholder="Rua: xxxxxxxx, Número: xxx, Bairro: xxxxxxxx, Cidade: xxxxx"
            className="w-full mb-5 p-2 rounded"
            ref={addressRef}
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
            value="Cadastrar"
            className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium"
          />
        </form>

        {/* Link para página de login */}
        <div className="mt-4 text-center">
          <p className="text-white">
            Já possuí conta?{" "}
            <span
              onClick={() => navigate("/login")}
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
