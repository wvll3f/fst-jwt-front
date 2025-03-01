"use client";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./auth";

export type IUser = {
    id: string;
    name: string;
    email: string;
};

type Message = {
    id: string;
    text: string;
    senderId: string;
    receiverId: string;
    timestamp: string;
};

interface ChatState {
    messages: Message[];
    users: IUser[];
    selectedUser: IUser | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    setSelectedUser: (selectedUser: IUser | null) => void;
    getMessages: (id: string) => Promise<void>;
    sendMessages: (messageData: any) => Promise<void>;
    subscribeToMessages: () => void;
    unsubscribeMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/users/sideuser", {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            set({ users: res.data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    setSelectedUser: (selectedUser: IUser | null) => {
        set({ selectedUser });
    },

    getMessages: async (id: string) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`chat/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            set({ messages: res.data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessages: async (messageData: any) => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        try {
            const res = await axiosInstance.post(`/chat/new-message/${selectedUser.id}`, messageData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            set({ messages: res.data });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao enviar mensagem");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        const { socket } = useAuthStore.getState();
        if (!selectedUser || !socket) return;

        const handleNewMessage = (newMessage: any) => {
            if (selectedUser && newMessage.senderId === selectedUser.id) {
                set((state) => ({ messages: [...state.messages, newMessage] }));
            }
        };
        socket.on("newMessage", handleNewMessage);
    },

    unsubscribeMessages: () => {
        const { socket } = useAuthStore.getState();
        socket?.off("newMessage");
    },
}));
