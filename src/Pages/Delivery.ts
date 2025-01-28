import api from "../service/api";
import { useEffect, useState, useRef, FormEvent } from "react";
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
    const response = await api.get("/delivery");
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
        cep: cepRef.current?.value,
        tarifaBase: parseFloat(tarifaBaseRef.current?.value), // Certificando que é número
        latitude: parseFloat(latitudeRef.current?.value),
        longitude: parseFloat(longitudeRef.current?.value),
      });
      setDelivery((allDelivery) => [...allDelivery, response.data]);

      cidadeRef.current.value = "";
      cepRef.current.value = "";
      tarifaBaseRef.current.value = "";
      latitudeRef.current.value = "";
      longitudeRef.current.value = "";
    } catch (error) {
      console.error("erro ao criar entrega", error);
    }
  }
}
