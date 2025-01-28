import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaGoogle } from 'react-icons/fa';

function Home() {
  const [activeModule, setActiveModule] = useState<number | null>(null);

  const toggleModule = (index: number) => {
    setActiveModule(activeModule === index ? null : index);
  };

  const list = [
    { id: 1, image: './src/assets/image1.jpeg' },
    { id: 2, image: './src/assets/image2.jpeg' },
    { id: 3, image: './src/assets/image3.jpeg' },
    { id: 4, image: './src/assets/image4.jpeg' },
  ];

  const modules = [
    {
      title: 'Cliente',
      items: [
        { name: 'Login', link: '/login' },
        { name: 'Cadastro', link: '/register' },
      ],
    },
    {
      title: 'Gestão de Pedidos',
      items: [
        { name: 'Rastreamento de Pedidos', link: '/rastreamento-pedidos' },
        { name: 'Solicitação de Entregas', link: '/FormularioFrete' },
      ],
    },
    {
      title: 'Despacho de Motoboys',
      items: [
        { name: 'Status em Tempo Real', link: '/status-tempo-real' },
        { name: 'Motoboy Disponível', link: '/motoboy-disponivel' },
      ],
    },
    {
      title: 'CRM (Gestão de Relacionamento com o Cliente)',
      items: [
        { name: 'Feedback de Clientes', link: '/feedback-clientes' },
        { name: 'Histórico de Pedidos', link: '/CRM' },
      ],
    },
    {
      title: 'Faturamento e Emissão de Notas',
      items: [
        { name: 'Emissão de Nota Fiscal', link: '/emissao-nota-fiscal' },
        { name: 'Formas de Pagamentos', link: '/formas-pagamento' },
      ],
    },
    {
      title: 'Relatórios e Análises',
      items: [
        { name: 'Relatórios de Desempenho', link: '/relatorios-desempenho' },
        { name: 'Análise de Tempo de Entrega', link: '/analise-tempo-entrega' },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        className="w-full mb-8"
      >
        {list.map((item) => (
          <SwiperSlide key={item.id}>
            <img src={item.image} alt="slider" className="slide-item w-full h-[350px] object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="container mx-auto px-4">
        
        <nav className="space-y-4">
          {modules.map((module, index) => (
            <div key={index} className="border-b border-gray-300 pb-2">
              <div
                className="flex justify-between items-center cursor-pointer text-orange-600"
                onClick={() => toggleModule(index)}
              >
                <h2 className="text-lg font-semibold">{module.title}</h2>
                <span
                  className={`transition-transform transform ${
                    activeModule === index ? 'rotate-180' : ''
                  }`}
                >
                  ↓
                </span>
              </div>
              {activeModule === index && (
                <ul className="mt-2 space-y-1">
                  {module.items.map((item, idx) => (
                    <li key={idx}>
                      <Link to={item.link} className="text-gray-700 hover:text-orange-600">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>

      <footer className="mt-8 w-full bg-gray-600 p-4 text-center">
        <div className="text-gray-100 mb-2">
          <p>
            <strong className="text-orange-600">N&G EXPRESS</strong> - Soluções completas para logística e
            entrega rápida.
          </p>
          <p>CNPJ: 24.723.159/0001-00</p>
          <p>
            <FaPhoneAlt className="inline mr-1" /> (47) 9 9912-3260 | <FaEnvelope className="inline mr-1" />{' '}
            comercial.ngexpress@gmail.com
          </p>
        </div>
        <div className="flex justify-center space-x-4 text-orange-600">
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
        <span className="text-gray-500 text-sm block mt-2">
          2016 - 2025, Copyright © N&G Express. Todos os direitos reservados.
        </span>
      </footer>
    </div>
  );
}

export default Home;
