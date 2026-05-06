import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// IMPORTANTE: Cambia esta IP por la IP local de tu máquina para probar en dispositivo real
// Si usas el emulador de Android, usa 10.0.2.2
const BASE_URL = "http://192.168.1.3:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

// Interceptor para agregar el token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
    }
    return Promise.reject(error);
  },
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    if (response.data.token) {
      await SecureStore.setItemAsync("token", response.data.token);
      const userData = {
        id: response.data.id,
        email: response.data.email,
        role: response.data.role,
        fullName: response.data.fullName,
      };
      await SecureStore.setItemAsync("user", JSON.stringify(userData));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", {
      ...userData,
      email: userData.email.trim().toLowerCase(),
      clientType: userData.clientType || "INDIVIDUAL",
    });
    return response.data;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
  },

  getCurrentUser: async () => {
    const user = await SecureStore.getItemAsync("user");
    return user ? JSON.parse(user) : null;
  },
};

export const retosService = {
  getAll: async () => {
    const response = await api.get("/retos");
    return response.data;
  },

  toggleComplete: async (id) => {
    const response = await api.patch(`/retos/${id}/toggle`);
    return response.data;
  },
};

export const foroService = {
  getThreads: async () => {
    const response = await api.get("/foro/threads");
    const rawThreads = response.data || [];
    const user = await authService.getCurrentUser();
    const userId = user?.id || null;

    return rawThreads.map((thread) => ({
      ...thread,
      body: thread.content || "",
      author: thread.authorName || "Usuario",
      time: thread.createdAt
        ? new Date(thread.createdAt).toLocaleDateString()
        : "Ahora",
      replies: thread.comments ? thread.comments.length : 0,
      likes: thread.likedBy ? thread.likedBy.length : 0,
      liked: thread.likedBy ? thread.likedBy.includes(userId) : false,
      avatar: thread.authorName
        ? thread.authorName.substring(0, 2).toUpperCase()
        : "U",
      comments: thread.comments
        ? thread.comments.map((comment) => ({
            ...comment,
            time: comment.createdAt
              ? new Date(comment.createdAt).toLocaleDateString()
              : "Ahora",
            avatar: comment.authorName
              ? comment.authorName.substring(0, 2).toUpperCase()
              : "U",
          }))
        : [],
    }));
  },

  getThreadById: async (threadId) => {
    const response = await api.get(`/foro/threads/${threadId}`);
    return response.data;
  },

  createThread: async (threadData) => {
    const response = await api.post("/foro/threads", threadData);
    return response.data;
  },

  addComment: async (threadId, commentData) => {
    const response = await api.post(
      `/foro/threads/${threadId}/comments`,
      commentData,
    );
    return response.data;
  },

  editComment: async (threadId, commentId, newContent) => {
    const response = await api.put(
      `/foro/threads/${threadId}/comments/${commentId}`,
      newContent,
      {
        headers: { "Content-Type": "text/plain" },
      },
    );
    return response.data;
  },

  deleteComment: async (threadId, commentId) => {
    const response = await api.delete(
      `/foro/threads/${threadId}/comments/${commentId}`,
    );
    return response.data;
  },

  toggleLike: async (threadId) => {
    const response = await api.post(`/foro/threads/${threadId}/like`);
    return response.data;
  },

  updateThreadState: async (threadId, event) => {
    const response = await api.put(`/foro/threads/${threadId}/state`, {
      event,
    });
    return response.data;
  },
};

export const citasService = {
  getAll: async () => {
    const response = await api.get("/citas");
    return response.data;
  },

  create: async (citaData) => {
    const response = await api.post("/citas", citaData);
    return response.data;
  },
};

export const diagnosticoService = {
  saveResult: async (responses) => {
    const response = await api.post("/diagnostico/results", {
      answers: responses,
    });
    return response.data;
  },
};
