import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

// Verifica se está em rota de login
const isLoginPage = () => {
    return window.location.pathname === '/login';
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Evita loop em caso de erro na própria requisição de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // 1. Tentativa de renovação de token
                const refreshResponse = await api.post('/refresh-token');
                const newToken = refreshResponse.data.token;
                
                // 2. Atualiza storage e headers
                localStorage.setItem('token', newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                
                // 3. Repete a requisição original
                return api(originalRequest);
            } catch (refreshError) {
                // 4. Fallback: Redireciona somente se não estiver na página de login
                if (!isLoginPage()) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;