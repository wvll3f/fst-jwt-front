/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { axiosInstance } from "@/app/lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3333" : "/";

export const useAuthStore = create((set: any, get: any) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async (token:any) => {
    try {
      const res = await axiosInstance.get("/auth/check", {
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      set({ authUser: res.data });
      console.log('aqui por favor ' + res.data)
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: token });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // signup: async (data:any) => {
  //   set({ isSigningUp: true });
  //   try {
  //     const res = await axiosInstance.post("/auth/signup", data);
  //     set({ authUser: res.data });
  //     toast.success("Account created successfully");
  //     get().connectSocket();
  //   } catch (error:any) {
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isSigningUp: false });
  //   }
  // },

  login: async (data: any) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      localStorage.setItem('accessToken', res.data)
      set({ authUser: res.data });
      get().connectSocket();
      set({ isLoggingIn: true });
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // logout: async () => {
  //   try {
  //     await axiosInstance.post("/auth/logout");
  //     set({ authUser: null });
  //     toast.success("Logged out successfully");
  //     get().disconnectSocket();
  //   } catch (error:any) {
  //     toast.error(error.response.data.message);
  //   }
  // },

  // updateProfile: async (data:any) => {
  //   set({ isUpdatingProfile: true });
  //   try {
  //     const res = await axiosInstance.put("/auth/update-profile", data);
  //     set({ authUser: res.data });
  //     toast.success("Profile updated successfully");
  //   } catch (error:any) {
  //     console.log("error in update profile:", error);
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isUpdatingProfile: false });
  //   }
  // },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
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
