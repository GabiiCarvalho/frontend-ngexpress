import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaGoogle, FaUser, FaClipboardList, FaMotorcycle, FaComments, FaFileInvoiceDollar, FaWallet } from 'react-icons/fa';

function Home() {
  const [activeModule, setActiveModule] = useState<number | null>(null);

  const [user, setUser] = useState<{ name: string } | null>(null);

  const toggleModule = (index: number) => {
    setActiveModule(activeModule === index ? null : index);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const list = [
    { id: 1, image: './src/assets/entregador.png' },
    { id: 2, image: './src/assets/entregador1.jpg' },
    { id: 3, image: './src/assets/entregador2.jpeg' },
    { id: 4, image: './src/assets/entregador3.jpg' },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const modules = [
    {
      title: 'Cliente',
      icon: <FaUser className="text-2xl text-orange-600" />,
      items: user
        ? [{ name: 'Perfil', link: '/profile' }]
        : [
          { name: 'Login', link: '/login' },
          { name: 'Cadastro', link: '/register' },
        ],
    },
    {
      title: 'Pedidos',
      icon: <FaClipboardList className="text-2xl text-orange-600" />,
      items: [
        { name: 'Status', link: '/statusPedido' },
        { name: 'Solicitação', link: '/Delivery' },
        { name: 'Histórico', link: '/historico' }
      ],
    },
    {
      title: 'Entregadores',
      icon: <FaMotorcycle className="text-2xl text-orange-600" />,
      items: [
        { name: 'Status em Tempo Real', link: '/tempoReal' },
        { name: 'Motoboy Disponível', link: '/motoboyDisponivel' },
      ],
    },
    {
      title: 'Avaliação de Clientes',
      icon: <FaComments className="text-2xl text-orange-600" />,
      items: [
        { name: 'Feedback de Clientes', link: '/feedbackCliente' }
      ],
    },
    {
      title: 'Faturamento e Emissão de Notas',
      icon: <FaFileInvoiceDollar className="text-2xl text-orange-600" />,
      items: [
        { name: 'Emissão de Nota Fiscal', link: '/emissaoNf' },
        { name: 'Formas de Pagamentos', link: '/formasPagamento' },
      ],
    },
    {
      title: 'Carteira',
      icon: <FaWallet className="text-2xl text-orange-600" />,
      items: [
        { name: 'Saldo', link: '/saldo' },
        { name: 'Adicionar fundos', link: '/adicionarFundos' },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {user && (
        <button onClick={handleLogout} className='mt-2 bg-red-600 text-white px-4 py-2 rounded-mb hover:bg-red-700 transition rounded'>Sair</button>
      )}      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        autoplay={{
          delay: 3000,
          disableOnInteraction: false
        }}
        loop={true}
        className="w-full mb-8"
      >
        {list.map((item) => (
          <SwiperSlide key={item.id}>
            <img src={item.image} alt="slider" className="slide-item w-full h-[500px] object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="container mx-auto px-4">

        <div className='text-center mb-6'>
          {user ? (
            <h2 className='text-2xl font-bold text-orange-600'>Bem-vindo, {user.name}!</h2>
          ) : (
            <h2 className='text-2xl font-bold text-gray-950'>Bem-vindo à N&G EXPRESS!</h2>
          )}
        </div>

        <div className="container mx-auto px-4 mb-8">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="w-full"
          >
            {modules.map((module, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-lg shadow-md p-6 h-64 hover:shadow-lg transition-shadow">
                  <div className='mb-4 bg-orange-200 p-3 rounded-full flex items-center justify-center w-12 h-12 mx-auto transition-all hover:bg-orange-300' >
                    {module.icon}
                  </div>
                  <h3 className="text-xl font-bold text-orange-600 mb-4 text-center">{module.title}</h3>
                  <ul className="space-y-2 px-4">
                    {module.items.map((item, idx) => (
                      <li key={idx} className='text-center'>
                        <Link
                          to={item.link}
                          className="text-gray-700 hover:text-orange-600 transition-colors block"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
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
        <span className="text-gray-200 text-sm block mt-2">
          2016 - 2025, Copyright © N&G Express. Todos os direitos reservados.
        </span>
      </footer>
    </div>
  );
}

export default Home;
