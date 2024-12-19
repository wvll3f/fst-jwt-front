'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from "@/app/lib/axios"; // Ensure axiosInstance is properly imported
import toast from "react-hot-toast";
import io from "socket.io-client";


interface IAuthStore {
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: any[];
  socket: any;
  authUser: string | null;
  login: (data: any) => Promise<void>;
  checkAuth: (token: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3333" : "/";

const AuthContext = createContext<IAuthStore | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [socket, setSocket] = useState<any>(null); 

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setAuthUser(storedToken);
  }, []);

  const checkAuth = async (token: string) => {
    try {
      setIsCheckingAuth(true);
      const res = await axiosInstance.get("/auth/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAuthUser(res.data);
      connectSocket(res.data.id);
    } catch (error) {
      console.error("Error in checkAuth:", error);
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const signup = async (data: any) => {
    setIsSigningUp(true);
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      setAuthUser(null);
      toast.success("Account created successfully");
      connectSocket(res.data.id);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  const login = async (data: any) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      localStorage.setItem('accessToken', res.data);
      setAuthUser(res.data);
      toast.success("Logged in successfully");
      connectSocket(res.data.id);
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

  const connectSocket = (userId: string) => {
    if (!userId || socket?.connected) return;
  
    const newSocket = io(BASE_URL, { query: { userId } });
  
    setSocket(newSocket);
  
    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });
  
    newSocket.on("disconnect", () => {
      setSocket(null); // Limpeza na desconexão
    });
  };
  

  const disconnectSocket = () => {
    if (socket?.connected) socket.disconnect();
  };

  // Check authentication on component mount
  useEffect(() => {
    if (authUser) checkAuth(authUser); // Check auth if user exists
  }, []);

  return (
    <AuthContext.Provider value={{
      authUser,
      isSigningUp,
      isLoggingIn,
      isUpdatingProfile,
      isCheckingAuth,
      onlineUsers,
      login,
      checkAuth,
      signup,
      logout,
      updateProfile
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
