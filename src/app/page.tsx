'use client'
import { useChatContext } from "./context/ChatContext";
import NoChatSelected from "./components/NoChatSelected";
import ChatContainer from "./components/ChatContainer";
import SideBar from "./components/SideBar";
import { useAuthContext } from "./context/AuthContext";
import { useEffect } from "react";
import { Loader } from "lucide-react";

export default function Home() {

  const { checkAuth, authUser, isCheckingAuth } = useAuthContext();
  const { selectedUser } = useChatContext();

  useEffect(() => {
    checkAuth()
    console.log(authUser)
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
