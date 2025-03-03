/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { create } from "zustand";
import { axiosInstance } from "@/app/lib/axios";
import { Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import toast from "react-hot-toast";

interface IresponseLogin {
  userId: string;
  expiresIn: string;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  isAuthenticated: boolean;
  onlineUsers: any[];
  socket: typeof Socket | null;
  authUser: IresponseLogin | null;
  checkAuth: () => Promise<void>;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  connectSocket: (authUser: IresponseLogin) => void;
  disconnectSocket: () => void;
}

const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:3333" : "/";

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isAuthenticated: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    const currentDataUser = JSON.parse(localStorage.getItem("dataUser")!);
    const currentToken = localStorage.getItem("accessToken");

    try {
      set({ isCheckingAuth: true });

      const res = await axiosInstance.get("/auth/check", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      set({ isAuthenticated: true, authUser: currentDataUser });
      get().connectSocket(currentDataUser);
    } catch (error) {
      console.error("Erro no checkAuth:", error);
      set({ isAuthenticated: false });
      get().disconnectSocket();
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: any) => {
    set({ isSigningUp: true });
    try {
      await axiosInstance.post("/auth/signup", data);
      toast.success("Conta criada com sucesso");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao cadastrar");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: any) => {
    try {
      set({ isLoggingIn: true });

      const res = await axiosInstance.post("/auth/login", data);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("dataUser", JSON.stringify(res.data));

      set({ authUser: res.data, isAuthenticated: true });
      get().connectSocket(res.data);
      toast.success("Login realizado com sucesso");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao fazer login");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("accessToken");
      set({ authUser: null, isAuthenticated: false });
      toast.success("Logout realizado com sucesso");
      get().disconnectSocket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao fazer logout");
    }
  },

  updateProfile: async (data: any) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Perfil atualizado com sucesso");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar perfil");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: (authUser: IresponseLogin) => {
    console.log("Conectando ao socket...");

    const newSocket = io(BASE_URL, {
      query: { userId: authUser.userId },
    });

    newSocket.connect();
    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });

    newSocket.on("disconnect", () => {
      set({ socket: null });
      console.log("Socket desconectado");
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

