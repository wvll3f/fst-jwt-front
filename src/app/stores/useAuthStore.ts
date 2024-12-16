/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { axiosInstance } from "@/app/lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

interface IAuthStore {
  isSigningUp: boolean,
  isLoggingIn: boolean,
  isUpdatingProfile: boolean,
  isCheckingAuth: boolean,
  onlineUsers: any[],
  socket: any,
  authUser:string | null,
  login: (data: any) => Promise<void>,
  checkAuth: (data: any) => Promise<void>,

}

const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3333" : "/";

export const useAuthStore = create<IAuthStore>((set: any, get: any) => ({
  authUser: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async (token: any) => {
    try {
      set({ isCheckingAuth: true })
      const res = await axiosInstance.get("/auth/check", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      localStorage.removeItem('accessToken')
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data:any) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error:any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: any) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      localStorage.setItem('accessToken', res.data)
      set({ authUser: res.data });
      console.log(res.data)
      get().connectSocket();
      set({ isLoggingIn: true });
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error:any) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data:any) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error:any) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (localStorage.getItem('accesstoken') ||!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser.id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
