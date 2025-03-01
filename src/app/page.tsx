'use client'
import NoChatSelected from "./components/NoChatSelected";
import ChatContainer from "./components/ChatContainer";
import SideBar from "./components/SideBar";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "./store/auth";
import { useChatStore } from "./store/chat";


export default function Home() {
 
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  const { selectedUser } = useChatStore();

  useEffect(() => {
    checkAuth()

  }, [])

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <Loader color="white" className="size-10 animate-spin" />
      </div>
    );

  return (
    <div className="flex h-dvh w-dvw bg-slate-900 text-white">
      <SideBar />
      {selectedUser ? <ChatContainer /> : <NoChatSelected />}
    </div>
  )
}
