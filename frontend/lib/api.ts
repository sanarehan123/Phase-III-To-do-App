import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Automatically attach token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Types ---
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user_id: string;
  name: string;
  email: string;
}

// --- Auth API ---
export const authApi = {
  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post("/api/auth/signup", { name, email, password });
    return res.data;
  },

  signin: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post("/api/auth/signin", { email, password });
    return res.data;
  },
};

// --- Tasks API ---
export const tasksApi = {
  getAll: async (userId: string, status = "all"): Promise<Task[]> => {
    const res = await apiClient.get(`/api/${userId}/tasks?status=${status}`);
    return res.data;
  },

  create: async (userId: string, title: string, description?: string): Promise<Task> => {
    const res = await apiClient.post(`/api/${userId}/tasks`, { title, description });
    return res.data;
  },

  update: async (userId: string, taskId: number, title?: string, description?: string): Promise<Task> => {
    const res = await apiClient.put(`/api/${userId}/tasks/${taskId}`, { title, description });
    return res.data;
  },

  delete: async (userId: string, taskId: number): Promise<void> => {
    await apiClient.delete(`/api/${userId}/tasks/${taskId}`);
  },

  toggleComplete: async (userId: string, taskId: number): Promise<Task> => {
    const res = await apiClient.patch(`/api/${userId}/tasks/${taskId}/complete`);
    return res.data;
  },
};

// --- Chat API ---
export const chatApi = {
  sendMessage: async (message: string, userId: string): Promise<{ reply: string; action_taken: string | null }> => {
    const res = await apiClient.post("/api/chat", { message, user_id: userId });
    return res.data;
  },
};