import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { AxiosResponse } from "axios";
interface User {
    id: string;
    name: string;
    email: string;
  }
  
  interface Message {
    id: number;
    text: string;
    senderId: number;
    receiverId: number;
    timestamp: string;
  }
  
  interface IChateStore {
    messages: Message[];
    users: User[];
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
  }
  
  export const useChatStore = create<IChateStore>((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
  
    getUsers: async () => {
      set({ isUsersLoading: true });
      try {
        const res: AxiosResponse<User[]> = await axiosInstance.get("/users/sideuser", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        set({ users: res.data });
      } catch (error: any) {
        console.log(error);
        //toast.error(error.response.data.message); // Caso queira mostrar um erro
      } finally {
        set({ isUsersLoading: false });
      }
    },
  }));