import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo global de respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo cerrar sesión si el error es en una ruta que NO sea de datos del dashboard
      const url = error.config?.url || '';
      const isDataEndpoint = url.includes('/retos') || url.includes('/citas') || 
                             url.includes('/foro') || url.includes('/diagnostico');
      
      if (!isDataEndpoint) {
        // Solo limpiar sesión si la ruta de auth falla
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      // Para rutas de datos, simplemente rechazamos sin cerrar sesión
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    // Sanitización básica
    const cleanCredentials = {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password
    };
    const response = await api.post('/auth/login', cleanCredentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Guardar el objeto de usuario con la info recibida
      const userData = {
        email: response.data.email,
        role: response.data.role,
        fullName: response.data.fullName
      };
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return response.data;
  },
  register: async (userData) => {
    // Sanitización de registro
    const cleanData = {
      ...userData,
      email: userData.email.trim().toLowerCase(),
      nombre: userData.nombre.trim()
    };
    const response = await api.post('/auth/register', cleanData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const retosService = {
  getAll: async () => {
    const response = await api.get('/retos');
    return response.data;
  },
  toggleComplete: async (id) => {
    const response = await api.patch(`/retos/${id}/toggle`);
    return response.data;
  },
};

export const foroService = {
  getThreads: async (category = 'Todos') => {
    const url = category === 'Todos' ? '/foro/threads' : `/foro/threads?category=${category}`;
    const response = await api.get(url);
    return response.data;
  },
  createThread: async (threadData) => {
    const response = await api.post('/foro/threads', threadData);
    return response.data;
  },
  toggleLike: async (id) => {
    const response = await api.post(`/foro/threads/${id}/like`);
    return response.data;
  },
};

export const citasService = {
  getAll: async () => {
    const response = await api.get('/citas');
    return response.data;
  },
  create: async (citaData) => {
    const response = await api.post('/citas', citaData);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.patch(`/citas/${id}`, { status });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/citas/${id}`);
    return response.data;
  },
};

export const diagnosticoService = {
  saveResult: async (score, answers) => {
    const response = await api.post('/diagnostico/results', { score, answers });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/diagnostico/history');
    return response.data;
  },
};

export default api;
