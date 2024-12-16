import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { AxiosResponse } from "axios";
import { useAuthStore } from "./useAuthStore";
export interface IUser {
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
  users: IUser[] | [];
  selectedUser: IUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<IUser[]>;
  setSelectedUser: (selectedUser: IUser) => any
  getMessages: (id: string) => Promise<void>,
}

export const useChatStore = create<IChateStore>((get: any, set: any) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // setSelectedUser: (selectedUser: User) => {
  //   set((state: any) => {
  //     if (state.selectedUser?.id !== selectedUser.id) {
  //       return { selectedUser };
  //     }
  //     return state;
  //   });
  // },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/users/sideuser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      set({ users: res.data });
      return res.data;
    } catch (error: any) {
      console.log(error);
      //toast.error(error.response.data.message); // Caso queira mostrar um erro
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (id: string) => {
    try {
      set({ isMessagesLoading: true })
      const res: AxiosResponse<Message[]> = await axiosInstance.get(`messages/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      set({ messages: res.data })
    } catch (error) {
      console.log(error)
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage: any) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser.id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },


}));