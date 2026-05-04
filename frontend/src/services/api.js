import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

const storedToken = localStorage.getItem("token");
if (storedToken) {
  setAuthHeader(storedToken);
}

// Interceptor para agregar el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log("[Axios] Token inyectado para:", config.url);
  } else {
    console.log("[Axios] Sin token para:", config.url);
  }
  return config;
});

// Interceptor para manejo global de respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthHeader(null);
    }
    return Promise.reject(error);
  },
);

export const authService = {
  login: async (credentials) => {
    // Sanitización básica
    const cleanCredentials = {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    };
    const response = await api.post("/auth/login", cleanCredentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      setAuthHeader(response.data.token);
      console.log("[Auth] Token guardado, length:", response.data.token.length);
      // Guardar el objeto de usuario con la info recibida
      const userData = {
        email: response.data.email,
        role: response.data.role,
        fullName: response.data.fullName,
      };
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return response.data;
  },
  register: async (userData) => {
    // Sanitización de registro
    const cleanData = {
      ...userData,
      email: userData.email.trim().toLowerCase(),
      fullName: userData.fullName.trim(),
      role: userData.role || "USUARIO",
      clientType: userData.clientType || "INDIVIDUAL",
    };
    delete cleanData.nombre;
    const response = await api.post("/auth/register", cleanData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthHeader(null);
  },
};

export const retosService = {
  getAll: async () => {
    const response = await api.get("/retos");
    return response.data.map((r) => ({
      ...r,
      desc: r.description || "",
      duration: r.estimatedMinutes ? `${r.estimatedMinutes} min` : "15 min",
      icon: r.icon || "check",
    }));
  },
  toggleComplete: async (id) => {
    const response = await api.patch(`/retos/${id}/toggle`);
    return response.data;
  },
};

export const foroService = {
  getThreads: async (category = "Todos") => {
    const url =
      category === "Todos"
        ? "/foro/threads"
        : `/foro/threads?category=${category}`;
    const response = await api.get(url);
    return response.data.map((t) => ({
      ...t,
      body: t.content || "",
      author: t.authorName || "Usuario",
      time: t.createdAt
        ? new Date(t.createdAt).toLocaleDateString()
        : "Reciente",
      avatar: t.authorName ? t.authorName.substring(0, 2).toUpperCase() : "U",
    }));
  },
  createThread: async (threadData) => {
    const response = await api.post("/foro/threads", threadData);
    return response.data;
  },
  toggleLike: async (id) => {
    const response = await api.post(`/foro/threads/${id}/like`);
    return response.data;
  },
};

export const citasService = {
  getAll: async () => {
    const response = await api.get("/citas");
    return response.data.map((c) => ({
      ...c,
      name: c.specialist?.fullName || "Especialista",
      especialidad: "Psicología", // Default or map if available
      fecha: c.appointmentDate
        ? new Date(c.appointmentDate).toLocaleDateString()
        : "Pendiente",
      hora: c.appointmentDate
        ? new Date(c.appointmentDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      tipo: c.notes || "Sesión",
      avatar: c.specialist?.fullName
        ? c.specialist.fullName.substring(0, 2).toUpperCase()
        : "ES",
    }));
  },
  create: async (citaData) => {
    const response = await api.post("/citas", citaData);
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
  getSpecialists: async () => {
    const response = await api.get("/especialistas");
    return response.data;
  },
};

export const diagnosticoService = {
  saveResult: async (answers) => {
    const response = await api.post("/diagnostico/results", { answers });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get("/diagnostico/history");
    return response.data;
  },
};

export default api;
