import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Login';

export default function App() {
  return (
    <div className="w-full min-h-screen bg-gray-950 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
      <h1 className="text-5xl font-bold text-orange-600 mb-2 text-center">N&G EXPRESS</h1>
        <p className="text-gray-300 text-center mb-6">
          Do seu clique à sua porta, tranquilidade e rapidez na palma da sua mão.
        </p>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}
