import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaGoogle, FaUser, FaClipboardList, FaMotorcycle, FaComments, FaFileInvoiceDollar, FaWallet } from 'react-icons/fa';

function Home() {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const navigate = useNavigate();

  const [user, setUser] = useState<{ name: string } | null>(null);

  const toggleModule = (index: number) => {
    setActiveModule(activeModule === index ? null : index);
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };


  const modules = [
    {
      title: 'Cliente',
      icon: <FaUser className="text-2xl text-blue-600" />,
      items: user
        ? [{ name: 'Perfil', link: '/profile' }]
        : [
          { name: 'Login', link: '/login' },
          { name: 'Cadastro', link: '/register' },
        ],
    },
    {
      title: 'Pedidos',
      icon: <FaClipboardList className="text-2xl text-blue-600" />,
      items: [
        { name: 'Status', link: '/statusPedido' },
        { name: 'Solicitação', link: '/Delivery' },
        { name: 'Histórico', link: '/historico' }
      ],
    },
    {
      title: 'Entregadores',
      icon: <FaMotorcycle className="text-2xl text-blue-600" />,
      items: [
        { name: 'Status em Tempo Real', link: '/tempoReal' },
        { name: 'Motoboy Disponível', link: '/motoboyDisponivel' },
      ],
    },
    {
      title: 'Avaliação de Clientes',
      icon: <FaComments className="text-2xl text-blue-600" />,
      items: [
        { name: 'Feedback de Clientes', link: '/feedbackCliente' }
      ],
    },
    {
      title: 'Faturamento e Emissão de Notas',
      icon: <FaFileInvoiceDollar className="text-2xl text-blue-600" />,
      items: [
        { name: 'Emissão de Nota Fiscal', link: '/emissaoNf' },
        { name: 'Formas de Pagamentos', link: '/formasPagamento' },
      ],
    },
    {
      title: 'Carteira',
      icon: <FaWallet className="text-2xl text-blue-600" />,
      items: [
        { name: 'Saldo', link: '/saldo' },
        { name: 'Adicionar fundos', link: '/adicionarFundos' },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Promocional com Espaçamento Ajustado */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white pt-4 pb-6 px-6 text-center shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-2">PREPARE-SE PARA O MÊS DO CONSUMIDOR</h2>
          <p className="text-sm md:text-lg mb-3">Esquente suas vendas com fretes especiais!</p>
          <div className="space-y-2">
            <p className="text-lg md:text-xl font-bold animate-pulse">50% OFF no 1º envio</p>
            <p className="text-xs md:text-sm">
              Use o código <span className="font-mono bg-white/20 px-2 py-1 rounded">CONSUMIDOR50</span>
            </p>
            <button className="bg-white text-blue-600 px-4 md:px-6 py-2 rounded-full font-bold mt-2 hover:bg-gray-100 transition-all shadow-lg text-sm md:text-base">
              Quero enviar →
            </button>
          </div>
        </div>
      </div>

      {/* Carrossel com Espaçamento Responsivo */}
      <div className="w-full mt-4 md:mt-8 px-4">
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
          className="w-full h-[300px] md:h-[780px] rounded-xl shadow-xl"
        >
          {list.map((item) => (
            <SwiperSlide key={item.id}>
              <img 
                src={item.image} 
                alt="slider" 
                className="w-full h-full object-cover object-center"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Conteúdo Principal */}
      <main className="w-full px-4 py-8 flex-grow">
        <div className='max-w-7xl mx-auto'>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {user ? `Bem-vindo, ${user.name}!` : 'Bem-vindo'}
          </h1>
          <p className="text-blue-600 text-lg">Nós movimentamos a eficácia do seu negócio</p>
        </div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 w-full">
          {modules.map((module, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-blue-50"
            >
              <div className="flex items-center mb-4 space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  {module.icon}
                </div>
                <h3 className="text-xl font-bold text-blue-900">{module.title}</h3>
              </div>
              <ul className="space-y-2">
                {module.items.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.link}
                      className="flex items-center p-3 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Destaque CNPJ */}
        <div className="w-full bg-blue-900 text-white rounded-xl p-6 text-center mb-12">
          <p className="text-lg font-bold mb-2">OFERTA EXCLUSIVA PARA CNPJ</p>
          <p className="text-3xl font-bold">1º Pedido Grátis*</p>
          <p className="text-sm mt-2 opacity-80">*Consulte condições</p>
        </div>
        </div>
      </main>


      <footer className="w-full bg-blue-900 text-white py-8">
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
              <div className="w-full pt-6 border-t border-blue-800 text-center text-sm text-blue-300"></div>

              <p>2016 - 2025, Copyright © N&G Express. Todos os direitos reservados.</p>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
