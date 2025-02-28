/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { createContext, useContext, useState } from 'react';
import { axiosInstance } from "@/app/lib/axios"; // Ensure axiosInstance is properly imported
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';

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
  isAuthenticated: boolean;
  onlineUsers: any[];
  socket: typeof Socket | null;
  authUser: IresponseLogin | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
  login: (data: any) => Promise<void>;
  checkAuth: () => Promise<boolean>;
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
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { push } = useRouter();

  const checkAuth = async () => {
    const currentToken = localStorage.getItem('accessToken')
    try {
      setIsCheckingAuth(true);
      const res = await axiosInstance.get("/auth/check", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      setIsAuthenticated(true)
      connectSocket()
      push('/')
      return true
    } catch (error) {
      console.error("Error in checkAuth:", error);
      setIsAuthenticated(false)
      setAuthUser(null)
      disconnectSocket()
      push('/login')
      return false
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const signup = async (data: any) => {
    setIsSigningUp(true);
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Account created successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  const login = async (data: IresponseLogin) => {
    try {
      setIsLoggingIn(true);
      const res = await axiosInstance.post("/auth/login", data);
      localStorage.setItem('accessToken', res.data.accessToken);
      setAuthUser(res.data);
      setIsAuthenticated(true)
      connectSocket()
      toast.success("Logged in successfully");
      push('/')
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
      setIsAuthenticated(false)
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
    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser
      }
    });

    setSocket(newSocket);
    socket?.connect()

    socket?.on("getOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
      console.log(`onlineUsers : ${onlineUsers}`)
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
      isAuthenticated,
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
