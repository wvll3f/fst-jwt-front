'use client'

import { useEffect } from "react";
import { LoaderIcon, Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/useAuthStore";
import { useRouter } from 'next/navigation'
import SideBar from "./components/SideBar";
import NoChatSelected from "./components/NoChatSelected";
import { useChatStore } from "./stores/useChatStore";


export default function Home() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const { selectedUser } = useChatStore();
  const router = useRouter()

  useEffect(() => {

    async function callback() {
      if (authUser == null || !authUser) router.push('/login');
      await checkAuth(authUser)
    }
    callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkAuth]);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderIcon className="size-25 animate-spin" />
      </div>
    );

  return (
    <div className="flex items-center h-screen w-screen bg-slate-900 text-white">
      <SideBar />
      {selectedUser ? <><h1>{selectedUser.email}</h1></> :<NoChatSelected />}
      <Toaster />
    </div>
  )
}
