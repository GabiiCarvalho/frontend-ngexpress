import { useEffect, useState } from 'react';
import UserMenu from './UserMenu';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const [user, setUser] = useState<{ name: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
        navigate('/login');
    };

    return (
        <nav className='flex justify-between items-center p-4 bg-blue-600 text-white'>
            <h1 className='text-xl font-bold'>Olá, bem-vindo</h1>
            {user ? <UserMenu user={user} onLogout={handleLogout} /> : <button onClick={() => navigate('/login')}>Entrar</button>}
        </nav>
    );
}