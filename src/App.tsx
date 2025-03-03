import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';
import Home from './Home';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Delivery from './Pages/Delivery/Delivery';
import OrderHistory from './Pages/OrderHistory/OrderHistory';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="w-full min-h-screen bg-gray-950 flex flex-col">
      <div className="w-full py-8 bg-gradient-to-r from-blue-600 to-cyan-500">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
          N&G EXPRESS
        </h1>
        <p className="text-gray-100 text-center text-lg mb-[-30px]">
          Do seu clique à sua porta, tranquilidade e rapidez na palma da sua mão.
        </p>
      </div>

      <BrowserRouter>
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/delivery" 
              element={
                <ProtectedRoute>
                  <Delivery />
                </ProtectedRoute>
              } 
            />   
            <Route 
              path="/historico" 
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </BrowserRouter>      
    </div>
  );
}