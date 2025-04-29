import { useEffect, useState } from 'react';
import UserMenu from './UserMenu';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
}

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Erro ao analisar usuário do localStorage:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className='flex justify-between items-center p-4 bg-blue-600 text-white'>
            <h1 className='text-xl font-bold'>Olá, bem-vindo</h1>
            {user ? (
                <UserMenu user={user} onLogout={handleLogout} />
            ) : (
                <button 
                    onClick={() => navigate('/login')}
                    className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
                >
                    Entrar
                </button>
            )}
        </nav>
    );
}