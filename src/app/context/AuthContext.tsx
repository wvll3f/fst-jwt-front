'use client'
import React, { createContext, useContext, useState } from 'react';
import { axiosInstance } from "@/app/lib/axios"; // Ensure axiosInstance is properly imported
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

interface IresponseLogin {
  userId: string,
  expiresIn: string,
  accessToken: string,
  refreshToken: string
}
interface IAuthStore {
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: any[];
  socket: Socket | null;
  authUser: IresponseLogin | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
  login: (data: any) => Promise<void>;
  checkAuth: (token: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3333" : "/";

const AuthContext = createContext<IAuthStore | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<IresponseLogin | null>(null);
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const checkAuth = async (token: string) => {
    try {
      setIsCheckingAuth(true);
      const res = await axiosInstance.get("/auth/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setAuthUser((prev) => {
          if (prev) {
            return { ...prev, accessToken: res.data };
          }
          return prev;
        });
      }

      console.log(`resposta do check: ${res.data}`)
    } catch (error) {
      console.error("Error in checkAuth:", error);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const signup = async (data: any) => {
    setIsSigningUp(true);
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      console.log(res)
      toast.success("Account created successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  const login = async (data: IresponseLogin) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      localStorage.setItem('accessToken', res.data.accessToken);
      setAuthUser(res.data);
      toast.success("Logged in successfully");
      console.log(authUser)
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem('accessToken');
      setAuthUser(null);
      toast.success("Logged out successfully");
      disconnectSocket();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const updateProfile = async (data: any) => {
    setIsUpdatingProfile(true);
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      setAuthUser(res.data);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const connectSocket = () => {
    if (!authUser) return;

    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser
      }
    });

    setSocket(newSocket);
    socket?.connect()

    socket?.on("getOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });

    socket?.on("disconnect", () => {
      setSocket(null);
    });
  };

  const disconnectSocket = () => {
    if (socket?.connected) socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{
      authUser,
      isSigningUp,
      isLoggingIn,
      isUpdatingProfile,
      isCheckingAuth,
      onlineUsers,
      connectSocket,
      disconnectSocket,
      login,
      checkAuth,
      signup,
      logout,
      updateProfile,
      socket
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
