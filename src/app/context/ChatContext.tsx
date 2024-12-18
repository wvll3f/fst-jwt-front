'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from "../lib/axios"; 
import { useAuthStore } from "../stores/useAuthStore";

export type IUser = {
  id: string;
  name: string;
  email: string;
}

type Message = {
  id: number;
  text: string;
  senderId: number;
  receiverId: number;
  timestamp: string;
}

interface IChatContext {
  messages: Message[];
  users: IUser[];
  selectedUser: IUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  setSelectedUser: (selectedUser: IUser) => void;
  getMessages: (id: string) => Promise<void>;
}

const ChatContext = createContext<IChatContext | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false);

  const getUsers = async () => {
    setIsUsersLoading(true);
    try {
      const res = await axiosInstance.get("/users/sideuser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUsersLoading(false);
    }
  };

  const getMessages = async (id: string) => {
    setIsMessagesLoading(true);
    try {
      const res = await axiosInstance.get(`messages/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setMessages(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  // Subscribe and unsubscribe to socket messages
  // useEffect(() => {
  //   const socket = useAuthStore.getState().socket;

  //   const handleNewMessage = (newMessage: any) => {
  //     if (selectedUser && newMessage.senderId === selectedUser.id) {
  //       setMessages(prevMessages => [...prevMessages, newMessage]);
  //     }
  //   };

  //   socket.on("newMessage", handleNewMessage);

  //   return () => {
  //     socket.off("newMessage", handleNewMessage);
  //   };
  // }, [selectedUser]);

  return (
    <ChatContext.Provider value={{
      messages,
      users,
      selectedUser,
      isUsersLoading,
      isMessagesLoading,
      getUsers,
      setSelectedUser,
      getMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
