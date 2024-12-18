'use client'

import { useEffect } from "react";
import { LoaderIcon, Toaster } from "react-hot-toast";
import { useRouter } from 'next/navigation'
import SideBar from "./components/SideBar";
import NoChatSelected from "./components/NoChatSelected";
import { useAuthContext } from "./context/AuthContext";
import { useChatContext } from "./context/ChatContext";
import ChatContainer from "./components/ChatContainer";

export default function Home() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthContext();

  const { selectedUser } = useChatContext();
  const router = useRouter()

  useEffect(() => {
    async function callback() {
      await checkAuth(authUser!)
    }
    callback()
    if (authUser == null) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderIcon className="size-25 animate-spin" />
      </div>
    );

  return (
    <div className="flex items-center h-screen w-screen bg-slate-900 text-white">
      <SideBar />
      {selectedUser ? <> <ChatContainer/> </> : <NoChatSelected />}
      <Toaster />
    </div>
  )
}
