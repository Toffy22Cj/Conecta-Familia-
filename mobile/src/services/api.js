import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// IMPORTANTE: Cambia esta IP por la IP local de tu máquina para probar en dispositivo real
// Si usas el emulador de Android, usa 10.0.2.2
const BASE_URL =
  Platform.OS === "android"
    ? "http://192.168.1.2:8080/api"
    : "http://192.168.1.3:8080/api";

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
      role: userData.role || "USUARIO",
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

export default api;
