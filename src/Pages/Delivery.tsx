import { api } from "../service/api"
import { useEffect, useState, useRef, FormEvent } from "react";
import { FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom"; 

interface DeliveryProps {
  id: string;
  cidade: string;
  cep: string;
  tarifaBase: number;
  latitude: number;
  longitude: number;
}

export default function Delivery() {
  const [delivery, setDelivery] = useState<DeliveryProps[]>([]);

  const cidadeRef = useRef<HTMLInputElement | null>(null);
  const cepRef = useRef<HTMLInputElement | null>(null);
  const tarifaBaseRef = useRef<HTMLInputElement | null>(null);
  const latitudeRef = useRef<HTMLInputElement | null>(null);
  const longitudeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadDelivery();
  }, []);

  async function loadDelivery() {
    const response = await api.get("/delivery")
    setDelivery(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (
      !cidadeRef.current?.value ||
      !cepRef.current?.value ||
      !tarifaBaseRef.current?.value ||
      !latitudeRef.current?.value ||
      !longitudeRef.current?.value
    )
      return;

    try {
      const response = await api.post("/delivery", {
        cidade: cidadeRef.current?.value,
        cep: cepRef.current?.value       
      });
      setDelivery((allDelivery) => [...allDelivery, response.data]);

      cidadeRef.current.value = "";
      cepRef.current.value = "";
      tarifaBaseRef.current.value = "";
      latitudeRef.current.value = "";
      longitudeRef.current.value = "";
    } catch (error) {
      console.error("erro ao criar pedido", error);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/delivery", {
        params:{
          id: id,
        }
      })
      const allDelivery = delivery.filter((delivery) => delivery.id !== id );
      setDelivery(allDelivery)
    } catch(error){

    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 flex justify-center px4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text 4xl font-medium text-white text-center mb-6">Solicitação de Pedidos</h1>
        <Link to="/" className="text-white hover:underline rounded bg-orange-500 cursor-pointer w-full p-2">Voltar</Link>
        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Cidade:</label>
          <input 
            type="text"
            placeholder="Balneário Camboriú"
            className="w-full mb-5 p-2 rounded"
            ref={cidadeRef}
          />
          <label className="font-medium text-white">CEP:</label>
          <input 
            type="text"
            placeholder="88050-000"
            className="w-full mb-5 p-2 rounded"
            ref={cepRef}
          />
          <label className="font-medium text-white">Tarifa:</label>
          <input 
            type="number"
            placeholder="10.00"
            className="w-full mb-5 p-2 rounded"
            ref={tarifaBaseRef}
          />
          <label className="font-medium text-white">Latitude:</label>
          <input
          type="number"
          placeholder="10.00"
          className="w-full mb-5 p-2 rounded"
          ref={latitudeRef}
          />
          <label className="font-medium text-white">Longitude</label>
          <input 
            type="number"
            placeholder="10.00"
            className="w-full mb-5 p-2 rounded"
            ref={longitudeRef}
          />*
          <input
            type="submit"
            value="Solicitar"
            className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium"
          />
        </form>
        <section className="flex flex-col gap-4">       

          {delivery.map((delivery) => (
          <article 
          key={delivery.id}
          className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">
            <p><span>Cidade: </span>{delivery.cidade}</p>
            <p><span>CEP: </span>{delivery.cep}</p>
            <p><span>Tarifa: </span>{delivery.tarifaBase}</p>
            <p><span>Latitude: </span>{delivery.latitude}</p>
            <p><span>Longitude: </span>{delivery.longitude}</p>
            <button 
            onClick={() => handleDelete(delivery.id)}
            className="bg-red-800 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2">
              <FiTrash size={18} color="#FFF"  />
            </button>
          </article>
          ))}
        </section>
      </main>
    </div>
  )
}